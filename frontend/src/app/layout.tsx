// src/app/layout.tsx
import Link from "next/link"
import "./globals.css"

export const metadata = {
  title: "MES RFID",
  description: "Track and manage textile production with RFID",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen bg-gray-100 text-gray-900">
        <aside className="w-64 bg-white shadow-lg p-4 space-y-4">
          <h1 className="text-xl font-bold text-blue-600">MES RFID</h1>
          <nav className="flex flex-col gap-2">
            <Link href="/" className="text-blue-600 hover:underline">Dashboard</Link>
            <Link href="/historic" className="text-blue-600 hover:underline">Historic</Link>
            <Link href="/inventory" className="text-blue-600 hover:underline">Inventory</Link>
            <Link href="/steps" className="text-blue-600 hover:underline">Steps</Link>
            <Link href="/stats" className="text-blue-600 hover:underline">Statistics</Link>
          </nav>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </body>
    </html>
  )
}
