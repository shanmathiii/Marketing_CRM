import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Megaphone, Filter, Mail, BarChart2, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { logout, getUser } from '../utils/auth'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/campaigns', icon: Megaphone, label: 'Campaigns' },
  { to: '/contacts', icon: Users, label: 'Contacts' },
  { to: '/segments', icon: Filter, label: 'Segments' },
  { to: '/emails', icon: Mail, label: 'Email Templates' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const user = getUser()

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {sidebarOpen && <span className="text-lg font-bold text-primary-600">MarketingCRM</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded hover:bg-gray-100">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`
              }
            >
              <Icon size={18} />
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-200">
          {sidebarOpen && <p className="text-xs text-gray-500 mb-2 px-3">{user?.name || 'User'}</p>}
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 w-full"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
