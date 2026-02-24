'use client'

import { useState } from 'react'
import Sidebar from '@/components/sidebar'
import DashboardView from '@/components/dashboard-view'
import FinancialReportsView from '@/components/financial-reports-view'
import ReportsView from '@/components/reports-view'
import SettlementView from '@/components/settlement-view'
import ReportLogView from '@/components/report-log-view'
import UsersView from '@/components/users-view'
import SettingsView from '@/components/settings-view'

export default function AppShell() {
  const [activeTab, setActiveTab] = useState('reports')

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onAddClick={() => setActiveTab('reports')} />
      case 'reports':
        return <ReportsView />
      case 'settlement':
        return <SettlementView />
      case 'report-log':
        return <ReportLogView />
      case 'users':
        return <UsersView />
      case 'settings':
        return <SettingsView />
      default:
        return <FinancialReportsView />
    }
  }

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        {renderView()}
      </div>
    </div>
  )
}
