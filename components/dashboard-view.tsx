'use client'

import { useState } from 'react'
import { RefreshCw, RotateCcw, ChevronDown, Calendar } from 'lucide-react'
import StatsCards from './stats-cards'
import DataGrid from './data-grid'

interface DashboardViewProps {
  onAddClick: () => void
}

export default function DashboardView({ onAddClick }: DashboardViewProps) {
  const [statusFilter, setStatusFilter] = useState('جميع الحالات')
  const [categoryFilter, setCategoryFilter] = useState('جميع التصنيفات')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const resetFilters = () => {
    setStatusFilter('جميع الحالات')
    setCategoryFilter('جميع التصنيفات')
    setFromDate('')
    setToDate('')
  }

  return (
    <main className="dashboard-main">
      {/* Page Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-block">
          <h1 className="dashboard-title">تحليل التقارير المالية</h1>
          <p className="dashboard-subtitle">نظرة عامة على التقارير</p>
        </div>
        <button className="btn-refresh" onClick={onAddClick}>
          <RefreshCw size={16} />
          <span>تحديث البيانات</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        {/* Status Filter */}
        <div className="filter-select-wrapper">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option>جميع الحالات</option>
            <option>مكتمل</option>
            <option>معلق</option>
            <option>مرفوض</option>
          </select>
          <ChevronDown size={16} className="filter-select-icon" />
        </div>

        {/* Category Filter */}
        <div className="filter-select-wrapper">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option>جميع التصنيفات</option>
            <option>إشتراكات نت</option>
            <option>مصروفات إدارية</option>
            <option>أخرى</option>
          </select>
          <ChevronDown size={16} className="filter-select-icon" />
        </div>

        {/* From Date */}
        <div className="filter-date-wrapper">
          <label className="filter-date-label">من تاريخ</label>
          <div className="filter-date-input-wrapper">
            <Calendar size={16} className="filter-date-icon" />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              placeholder="اختر تاريخاً"
              className="filter-date-input"
            />
          </div>
        </div>

        {/* To Date */}
        <div className="filter-date-wrapper">
          <label className="filter-date-label">إلى تاريخ</label>
          <div className="filter-date-input-wrapper">
            <Calendar size={16} className="filter-date-icon" />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              placeholder="اختر تاريخاً"
              className="filter-date-input"
            />
          </div>
        </div>

        {/* Reset */}
        <button className="filter-reset-btn" onClick={resetFilters} title="إعادة ضبط الفلاتر">
          <RotateCcw size={15} />
          <span>إعادة ضبط الفلاتر</span>
        </button>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Data Grid */}
      <div className="datagrid-section">
        <DataGrid />
      </div>
    </main>
  )
}
