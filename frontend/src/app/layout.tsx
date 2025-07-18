// src/app/layout.tsx
import Link from "next/link"
import "./globals.css"

export const metadata = {
  title: "MES RFID",
  description: "Track and manage textile production with RFID",
}

// ---- Composants de menu et icônes ----
function MenuLink({ href, icon: Icon, children }: { href: string, icon: any, children: React.ReactNode }) {
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const active = path === href || (href !== '/' && path.startsWith(href));
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${active ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-blue-100 hover:text-blue-700'}`}
    >
      <Icon className="w-5 h-5" />
      {children}
    </Link>
  );
}
function DashboardIcon(props: any) {
  return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z"/></svg>;
}
function HistoryIcon(props: any) {
  return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
}
function InventoryIcon(props: any) {
  return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4"/></svg>;
}
function StepsIcon(props: any) {
  return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16"/></svg>;
}
function StatsIcon(props: any) {
  return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm-3-4V5a1 1 0 00-2 0v8a1 1 0 002 0z"/></svg>;
}
function ArticleIcon(props: any) {
  return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2z"/></svg>;
}
// Ajout de l'icône Paramètres
function SettingsIcon(props: any) {
  return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-1.14 1.952-1.14 2.252 0a1.724 1.724 0 002.573 1.01c.987-.57 2.18.623 1.61 1.61a1.724 1.724 0 001.01 2.573c1.14.3 1.14 1.952 0 2.252a1.724 1.724 0 00-1.01 2.573c.57.987-.623 2.18-1.61 1.61a1.724 1.724 0 00-2.573 1.01c-.3 1.14-1.952 1.14-2.252 0a1.724 1.724 0 00-2.573-1.01c-.987.57-2.18-.623-1.61-1.61a1.724 1.724 0 00-1.01-2.573c-1.14-.3-1.14-1.952 0-2.252a1.724 1.724 0 001.01-2.573c-.57-.987.623-2.18 1.61-1.61a1.724 1.724 0 002.573-1.01z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>;
}
// ---- Fin composants menu ----

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen bg-gray-100 text-gray-900">
        <aside className="w-64 bg-white shadow-lg p-4 space-y-4">
          <h1 className="text-2xl font-extrabold text-blue-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" /></svg>
            MES RFID
          </h1>
          <nav className="flex flex-col gap-1 mt-6">
            <MenuLink href="/" icon={DashboardIcon}>Dashboard</MenuLink>
            <MenuLink href="/historic" icon={HistoryIcon}>Historic</MenuLink>
            <MenuLink href="/inventory" icon={InventoryIcon}>Inventory</MenuLink>
            <MenuLink href="/steps" icon={StepsIcon}>Steps</MenuLink>
            <MenuLink href="/stats" icon={StatsIcon}>Statistics</MenuLink>
            <MenuLink href="/articles" icon={ArticleIcon}>Articles</MenuLink>
            <MenuLink href="/settings" icon={SettingsIcon}>Settings</MenuLink>
          </nav>
        </aside>

        <main className="flex-1 p-8">{children}</main>
      </body>
    </html>
  )
}
