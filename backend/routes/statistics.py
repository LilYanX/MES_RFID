from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from models.statistics import StatisticsResponse
from db.mongodb import db
import pandas as pd

router = APIRouter()

async def get_article_tracking():
    # Répartition des articles par étape
    pipeline = [
        {"$group": {"_id": "$step_name", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ]
    articles_by_step = await db["rfid_events"].aggregate(pipeline).to_list(length=None)
    
    # Temps moyen par étape
    avg_time_pipeline = [
        {"$group": {
            "_id": "$step_name",
            "avg_time": {"$avg": "$duration"}
        }},
        {"$sort": {"_id": 1}}
    ]
    avg_time_by_step = await db["rfid_events"].aggregate(avg_time_pipeline).to_list(length=None)
    
    # Remplacer les None par 0.0
    avg_time_by_step_dict = {item["_id"]: item["avg_time"] if item["avg_time"] is not None else 0.0 for item in avg_time_by_step}
    
    # Articles inactifs
    idle_threshold = 15  # minutes
    idle_pipeline = [
        {"$match": {"last_update": {"$lt": datetime.utcnow() - timedelta(minutes=idle_threshold)}}},
        {"$project": {"_id": 1, "step_name": 1, "last_update": 1}},
        {"$sort": {"last_update": 1}}
    ]
    idle_articles = await db["rfid_events"].aggregate(idle_pipeline).to_list(length=None)
    
    return {
        "articles_by_step": {item["_id"]: item["count"] for item in articles_by_step},
        "avg_time_by_step": avg_time_by_step_dict,
        "idle_articles": idle_articles
    }

async def get_process_performance():
    # Taux de passage par heure
    pipeline = [
        {"$group": {
            "_id": {"$hour": "$timestamp"},
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id": 1}}
    ]
    throughput = await db["rfid_events"].aggregate(pipeline).to_list(length=None)
    
    # Temps moyen de cycle
    avg_cycle_time = await db["rfid_events"].aggregate([
        {"$match": {"step_id": 8}},
        {"$group": {"_id": None, "avg_time": {"$avg": "$duration"}}}
    ]).to_list(length=None)
    
    # Throughput journalier
    daily_pipeline = [
        {"$group": {
            "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$timestamp"}},
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id": -1}}
    ]
    daily_throughput = await db["rfid_events"].aggregate(daily_pipeline).to_list(length=None)
    
    return {
        "throughput": {item["_id"]: item["count"] for item in throughput},
        "avg_cycle_time": avg_cycle_time[0]["avg_time"] if avg_cycle_time else 0,
        "daily_throughput": daily_throughput
    }

async def get_anomalies():
    try:
        # Articles bloqués (inactifs)
        idle_threshold = 15  # minutes
        blocked_pipeline = [
            {"$match": {
                "last_update": {"$lt": datetime.utcnow() - timedelta(minutes=idle_threshold)},
                "step_id": {"$ne": 8}
            }},
            {"$project": {
                "_id": 1,
                "article_id": 1,
                "step_name": 1,
                "last_update": 1,
                "duration": 1
            }},
            {"$sort": {"last_update": 1}},
            {"$limit": 100}  # Limite pour éviter de surcharger la réponse
        ]
        blocked_articles = await db["rfid_events"].aggregate(blocked_pipeline).to_list(length=None)
        
        # Écarts entre étapes
        skipped_steps_pipeline = [
            {"$group": {
                "_id": {"$concat": ["$previous_step", " -> ", "$step_name"]},
                "count": {"$sum": 1}
            }},
            {"$sort": {"count": -1}},
            {"$limit": 10}  # Limite des 10 écarts les plus fréquents
        ]
        skipped_steps = await db["rfid_events"].aggregate(skipped_steps_pipeline).to_list(length=None)
        
        # Scans dupliqués (articles passant plusieurs fois par la même étape)
        duplicate_pipeline = [
            {"$group": {
                "_id": {"article_id": "$article_id", "step_id": "$step_id"},
                "count": {"$sum": 1},
                "first_seen": {"$min": "$timestamp"},
                "last_seen": {"$max": "$timestamp"}
            }},
            {"$match": {"count": {"$gt": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 10}  # Limite des 10 doublons les plus fréquents
        ]
        duplicates = await db["rfid_events"].aggregate(duplicate_pipeline).to_list(length=None)
        
        return {
            "blocked_articles": blocked_articles,
            "skipped_steps": skipped_steps,
            "duplicate_scans": duplicates
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching anomalies: {str(e)}"
        )

async def get_portal_status():
    # Statut des portails
    pipeline = [
        {"$group": {
            "_id": "$portal_id",
            "last_update": {"$max": "$timestamp"},
            "status": {"$last": "$status"}
        }},
        {"$sort": {"_id": 1}}
    ]
    portal_status = await db["portals"].aggregate(pipeline).to_list(length=None)
    
    # Taux de lecture
    read_rates_pipeline = [
        {"$group": {
            "_id": "$portal_id",
            "total_reads": {"$sum": 1},
            "successful_reads": {"$sum": {"$cond": [{"$eq": ["$status", "success"]}, 1, 0]}}
        }},
        {"$project": {
            "_id": 1,
            "read_rate": {"$divide": ["$successful_reads", "$total_reads"]}
        }},
        {"$sort": {"read_rate": -1}}
    ]
    read_rates = await db["rfid_events"].aggregate(read_rates_pipeline).to_list(length=None)
    
    return {
        "active_portals": portal_status,
        "read_rates": read_rates,
        "uptime": [],  # À implémenter
        "error_history": []  # À implémenter
    }

@router.get("/stats", response_model=StatisticsResponse, tags=["Statistics"])
async def get_stats():
    try:
        # Récupération des données
        article_tracking = await get_article_tracking()
        print("article_tracking:", article_tracking)  # Debug
        
        process_performance = await get_process_performance()
        print("process_performance:", process_performance)  # Debug
        
        anomalies = await get_anomalies()
        print("anomalies:", anomalies)  # Debug
        
        portal_status = await get_portal_status()
        print("portal_status:", portal_status)  # Debug
        
        # Calcul des KPIs
        articles_in_progress = await db["rfid_events"].count_documents({"step_id": {"$ne": 8}})
        print("articles_in_progress:", articles_in_progress)  # Debug
        
        articles_finished_today = await db["rfid_events"].count_documents({
            "step_id": 8,
            "timestamp": {"$gte": datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)}
        })
        print("articles_finished_today:", articles_finished_today)  # Debug
        
        return {
            "article_tracking": {
                "total_articles": sum(article_tracking["articles_by_step"].values()),
                "articles_by_step": article_tracking["articles_by_step"],
                "average_time_by_step": article_tracking["avg_time_by_step"],
                "idle_articles": article_tracking["idle_articles"]
            },
            "process_performance": {
                "throughput": {str(k): v for k, v in process_performance["throughput"].items()},
                "average_cycle_time": process_performance["avg_cycle_time"],
                "daily_throughput": process_performance["daily_throughput"],
                "performance_by_portal": []  # À implémenter
            },
            "anomalies": {
                "blocked_articles": anomalies["blocked_articles"],
                "skipped_steps": anomalies["skipped_steps"],
                "duplicate_scans": anomalies["duplicate_scans"]
            },
            "portal_status": {
                "active_portals": portal_status["active_portals"],
                "read_rates": portal_status["read_rates"],
                "uptime": [],  # À implémenter
                "error_history": []  # À implémenter
            },
            "article_types": {
                "distribution": {},  # À implémenter
                "average_cycle_by_type": {},  # À implémenter
                "top_references": []  # À implémenter
            },
            "global_kpis": {
                "articles_in_progress": articles_in_progress,
                "average_processing_time": process_performance["avg_cycle_time"],
                "articles_finished_today": articles_finished_today,
                "alerts": {
                    "active": len(anomalies["blocked_articles"]),
                    "resolved": 0  # À implémenter
                }
            }
        }
    except Exception as e:
        print("Erreur dans get_stats:", str(e))  # Debug
        raise HTTPException(
            status_code=500,
            detail={
                "error": str(e),
                "type": type(e).__name__,
                "message": "Une erreur est survenue lors de la récupération des statistiques"
            }
        )
