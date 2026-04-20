'use client'

import { useState } from 'react'
import Sidebar from '@/components/sidebar'
import DashboardView from '@/components/dashboard-view'
import FinancialReportsView from '@/components/financial-reports-view'
import NotificationsView from '@/components/notifications-view'
import LoginView from '@/components/login-view'
import SignUpView from '@/components/signup-view'
import ReportLogView from '@/components/report-log-view'

export default function AppShell() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authView, setAuthView] = useState<'login' | 'signup'>('login')
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderView = () => {
    if (!isAuthenticated) {
      if (authView === 'login') {
        return (
          <LoginView
            onNavigateToSignUp={() => setAuthView('signup')}
            onLoginSuccess={() => setIsAuthenticated(true)}
          />
        )
      } else {
        return (
          <SignUpView
            onNavigateToLogin={() => setAuthView('login')}
            onSignUpSuccess={() => {
              setIsAuthenticated(true)
              setAuthView('login')
            }}
          />
        )
      }
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onAddClick={() => setActiveTab('financial')} />
      case 'financial':
        return <FinancialReportsView />
      case 'notifications':
        return <NotificationsView />
      default:
        return <DashboardView onAddClick={() => setActiveTab('financial')} />
    }
  }

  return (
    <>
      <style>{`
        /* ── App Shell Responsive Layout ── */
        .app-layout {
          display: flex;
          min-height: 100vh;
          background: #f5f7fa;
          direction: rtl;
        }
        .app-main {
          flex: 1;
          overflow-y: auto;
          min-width: 0;
        }
        /* Mobile: add top padding for the hamburger button */
        @media (max-width: 768px) {
          .app-main {
            padding-top: 64px;
          }
        }
      `}</style>
      {isAuthenticated ? (
        <div className="app-layout">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="app-main">
            {renderView()}
          </div>
        </div>
      ) : (
        renderView()
      )}
    </>
  )
}
