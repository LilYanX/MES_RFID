from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from pydantic import BaseModel

class ArticleStats(BaseModel):
    total_articles: int
    articles_by_step: Dict[str, int]
    average_time_by_step: Dict[str, float]
    idle_articles: List[Dict[str, Any]]

class ProcessStats(BaseModel):
    throughput: Dict[str, int]
    average_cycle_time: float
    daily_throughput: List[Dict[str, Any]]
    performance_by_portal: List[Dict[str, Any]]

class AnomalyStats(BaseModel):
    blocked_articles: List[Dict[str, Any]]
    skipped_steps: List[Dict[str, Any]]
    duplicate_scans: List[Dict[str, Any]]

class PortalStats(BaseModel):
    active_portals: List[Dict[str, Any]]
    read_rates: List[Dict[str, Any]]
    uptime: List[Dict[str, Any]]
    error_history: List[Dict[str, Any]]

class ArticleTypeStats(BaseModel):
    distribution: Dict[str, int]
    average_cycle_by_type: Dict[str, float]
    top_references: List[Dict[str, Any]]

class GlobalKPIs(BaseModel):
    articles_in_progress: int
    average_processing_time: float
    articles_finished_today: int
    alerts: Dict[str, int]

class StatisticsResponse(BaseModel):
    article_tracking: ArticleStats
    process_performance: ProcessStats
    anomalies: AnomalyStats
    portal_status: PortalStats
    article_types: ArticleTypeStats
    global_kpis: GlobalKPIs
