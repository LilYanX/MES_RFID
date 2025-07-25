'use client'

import { useEffect, useState } from 'react'
import DashboardTable from "./components/DashboardTable";
import DashboardHeader from "./components/DashboardHeader";

type Article = {
  uuid: string
  latest_step_id: number
  latest_step_name: string
  last_seen: string
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/dashboard')
        const data = await res.json()
        setArticles(data.articles)
      } catch (error) {
        console.error('Error loading articles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  return (
    <main className="p-8">
      <DashboardHeader count={articles.length} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DashboardTable articles={articles} />
      )}
    </main>
  )
}
