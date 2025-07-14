'use client'

import { useEffect, useState } from 'react'

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
        console.error('Erreur lors du chargement des articles :', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard - MES RFID</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
          <p className="mb-4">Nombre d’articles en cours de traitement : <strong>{articles.length}</strong></p>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-xl">
              <thead className="bg-gray-100 text-gray-800">
                <tr>
                  <th className="py-2 px-4 border">UUID</th>
                  <th className="py-2 px-4 border">Étape</th>
                  <th className="py-2 px-4 border">Date de scan</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.uuid} className="text-center border-t hover:bg-gray-50">
                    <td className="py-2 px-4">{article.uuid}</td>
                    <td className="py-2 px-4">{article.latest_step_name}</td>
                    <td className="py-2 px-4">{new Date(article.last_seen).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  )
}
