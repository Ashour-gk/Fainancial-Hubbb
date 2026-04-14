'use client'

import { useState } from 'react'
import { RefreshCw, Calendar, ChevronDown } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface DashboardViewProps {
  onAddClick: () => void
}

export default function DashboardView({ onAddClick }: DashboardViewProps) {
  const [status, setStatus]         = useState('')
  const [category, setCategory]     = useState('')
  const [fromDate, setFromDate]     = useState('')
  const [toDate, setToDate]         = useState('')

  const handleReset = () => {
    setStatus('')
    setCategory('')
    setFromDate('')
    setToDate('')
  }

  // Chart data
  const monthlyData = [
    { month: 'يناير', المصروفات: 45000, المعتمدة: 38000 },
    { month: 'فبراير', المصروفات: 52000, المعتمدة: 45000 },
    { month: 'مارس', المصروفات: 48000, المعتمدة: 42000 },
    { month: 'إبريل', المصروفات: 61000, المعتمدة: 55000 },
    { month: 'مايو', المصروفات: 58000, المعتمدة: 50000 },
    { month: 'يونيو', المصروفات: 67000, المعتمدة: 62000 },
  ]

  const categoryData = [
    { name: 'إشتراكات نت', value: 45000, color: '#3b82f6' },
    { name: 'مشتريات متنوعة', value: 85000, color: '#10b981' },
    { name: 'عهدة', value: 120000, color: '#f59e0b' },
    { name: 'انتقالات', value: 35000, color: '#ef4444' },
  ]

  const statusData = [
    { status: 'معتمد', عدد: 45, color: '#10b981' },
    { status: 'قيد المراجعة', عدد: 28, color: '#f59e0b' },
    { status: 'مسودة', عدد: 35, color: '#8b5cf6' },
    { status: 'مرفوض', عدد: 8, color: '#ef4444' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap');

        /* ── Wrapper ── */
        .db2-wrap {
          min-height: 100vh;
          background: #f5f7fa;
          direction: rtl;
          font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
          padding: 36px 40px 60px;
        }
        @media(max-width: 768px) { .db2-wrap { padding: 20px 16px 60px; } }

        /* ── Header ── */
        .db2-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 14px;
        }
        .db2-header-text h1 {
          font-size: 1.75rem;
          font-weight: 800;
          color: #1a1a2e;
          margin: 0 0 4px;
        }
        .db2-header-text p {
          font-size: 0.85rem;
          color: #94a3b8;
          margin: 0;
          font-weight: 500;
        }
        .db2-refresh-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.18s, transform 0.15s, box-shadow 0.18s;
          box-shadow: 0 4px 14px rgba(37,99,235,0.3);
          white-space: nowrap;
        }
        .db2-refresh-btn:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(37,99,235,0.4);
        }
        .db2-refresh-btn:active { transform: translateY(0); }

        /* ── Filter Card ── */
        .db2-filter-card {
          background: #fff;
          border: 1px solid #e8edf4;
          border-radius: 16px;
          padding: 20px 24px;
          margin-bottom: 24px;
          box-shadow: 0 1px 6px rgba(15,27,45,0.06);
        }
        .db2-filter-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr auto;
          gap: 14px;
          align-items: end;
        }
        @media(max-width: 960px) {
          .db2-filter-grid { grid-template-columns: 1fr 1fr; }
          .db2-filter-reset { grid-column: span 2; }
        }
        @media(max-width: 560px) {
          .db2-filter-grid { grid-template-columns: 1fr; }
          .db2-filter-reset { grid-column: span 1; }
        }

        .db2-filter-group { display: flex; flex-direction: column; gap: 6px; }
        .db2-filter-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #64748b;
          text-align: right;
        }
        .db2-filter-select-wrap {
          position: relative;
        }
        .db2-filter-select {
          width: 100%;
          padding: 9px 14px 9px 36px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.85rem;
          color: #334155;
          background: #f8fafc;
          appearance: none;
          -webkit-appearance: none;
          cursor: pointer;
          transition: border-color 0.15s, box-shadow 0.15s;
          text-align: right;
          direction: rtl;
        }
        .db2-filter-select:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
          background: #fff;
        }
        .db2-filter-select-ico {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .db2-date-wrap {
          position: relative;
        }
        .db2-date-input {
          width: 100%;
          padding: 9px 14px 9px 36px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.85rem;
          color: #334155;
          background: #f8fafc;
          cursor: pointer;
          transition: border-color 0.15s, box-shadow 0.15s;
          box-sizing: border-box;
          text-align: right;
          direction: rtl;
        }
        .db2-date-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
          background: #fff;
        }
        .db2-date-input::placeholder { color: #94a3b8; }
        .db2-date-ico {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .db2-filter-reset {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          background: #f1f5f9;
          color: #475569;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
          white-space: nowrap;
          height: fit-content;
          align-self: end;
        }
        .db2-filter-reset:hover {
          background: #e2e8f0;
          color: #1e293b;
          border-color: #cbd5e1;
        }

        /* ── Summary Cards ── */
        .db2-summary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media(max-width: 640px) { .db2-summary-grid { grid-template-columns: 1fr; } }

        .db2-summary-card {
          background: #fff;
          border: 1px solid #e8edf4;
          border-radius: 16px;
          padding: 24px 28px;
          box-shadow: 0 1px 6px rgba(15,27,45,0.06);
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .db2-summary-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(15,27,45,0.1);
        }
        .db2-summary-title {
          font-size: 0.92rem;
          font-weight: 800;
          color: #1a1a2e;
          margin-bottom: 20px;
          text-align: right;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 12px;
        }
        .db2-summary-stats {
          display: flex;
          gap: 24px;
          justify-content: flex-end;
          flex-wrap: wrap;
        }
        .db2-summary-stat {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }
        .db2-summary-value {
          font-size: 1.6rem;
          font-weight: 900;
          color: #1a1a2e;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .db2-summary-sub {
          font-size: 0.78rem;
          color: #94a3b8;
          font-weight: 600;
          text-align: right;
        }
        .db2-summary-divider {
          width: 1px;
          background: #e8edf4;
          align-self: stretch;
        }

        /* ── Charts Grid ── */
        .db2-charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 20px;
        }
        @media(max-width: 1200px) {
          .db2-charts-grid { grid-template-columns: 1fr; }
        }

        .db2-chart-card {
          background: #fff;
          border: 1px solid #e8edf4;
          border-radius: 16px;
          padding: 24px 28px;
          box-shadow: 0 1px 6px rgba(15,27,45,0.06);
        }

        .db2-chart-title {
          font-size: 1rem;
          font-weight: 800;
          color: #1a1a2e;
          margin-bottom: 20px;
          text-align: right;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 12px;
        }

        .db2-chart-container {
          width: 100%;
          height: 300px;
          direction: rtl;
        }
      `}</style>

      <div className="db2-wrap">

        {/* ── Header ── */}
        <div className="db2-header">
          <div className="db2-header-text">
            <h1>تحليل التقارير المالية</h1>
            <p>نظرة عامة على التقارير</p>
          </div>
          <button className="db2-refresh-btn" onClick={onAddClick}>
            <RefreshCw size={15} />
            تحديث البيانات
          </button>
        </div>

        {/* ── Filter Card ── */}
        <div className="db2-filter-card">
          <div className="db2-filter-grid">

            {/* Status */}
            <div className="db2-filter-group">
              <span className="db2-filter-label">الحالة</span>
              <div className="db2-filter-select-wrap">
                <select
                  className="db2-filter-select"
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                >
                                  <option value="">جميع الحالات</option>
                  <option value="completed">مكتمل</option>
                  <option value="approved">معتمد</option>
                  <option value="rejected">مرفوض</option>
                  <option value="review">قيد المراجعة</option>
                  <option value="deleted">محذوف</option>
                  <option value="draft">مسودّة</option>
                </select>
                <span className="db2-filter-select-ico">
                  <ChevronDown size={14} />
                </span>
              </div>
            </div>

            {/* Category */}
            <div className="db2-filter-group">
              <span className="db2-filter-label">التصنيف</span>
              <div className="db2-filter-select-wrap">
                <select
                  className="db2-filter-select"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="">جميع التصنيفات</option>
                  <option value="net">إشتراكات نت</option>
                  <option value="misc">مشتريات متنوعة</option>
                  <option value="custody">عهدة</option>
                  <option value="transport">انتقالات</option>
                </select>
                <span className="db2-filter-select-ico">
                  <ChevronDown size={14} />
                </span>
              </div>
            </div>

            {/* From Date */}
            <div className="db2-filter-group">
              <span className="db2-filter-label">من تاريخ</span>
              <div className="db2-date-wrap">
                <input
                  type="date"
                  className="db2-date-input"
                  placeholder="اختر تاريخاً"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                />
                <span className="db2-date-ico">
                  <Calendar size={14} />
                </span>
              </div>
            </div>

            {/* To Date */}
            <div className="db2-filter-group">
              <span className="db2-filter-label">إلى تاريخ</span>
              <div className="db2-date-wrap">
                <input
                  type="date"
                  className="db2-date-input"
                  placeholder="اختر تاريخاً"
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                />
                <span className="db2-date-ico">
                  <Calendar size={14} />
                </span>
              </div>
            </div>

            {/* Reset */}
            <button className="db2-filter-reset" onClick={handleReset}>
              <RefreshCw size={13} />
              إعادة ضبط الفلاتر
            </button>

          </div>
        </div>

        {/* ── Summary Cards ── */}
        <div className="db2-summary-grid">

          {/* Expenses Summary */}
          <div className="db2-summary-card">
            <div className="db2-summary-title">ملخص المصروفات</div>
            <div className="db2-summary-stats">
              <div className="db2-summary-stat">
                <span className="db2-summary-value">£284,500.00</span>
                <span className="db2-summary-sub">إجمالي المبلغ</span>
              </div>
              <div className="db2-summary-divider" />
              <div className="db2-summary-stat">
                <span className="db2-summary-value">142</span>
                <span className="db2-summary-sub">إجمالي المصروفات</span>
              </div>
            </div>
          </div>

          {/* Contract Data */}
          <div className="db2-summary-card">
            <div className="db2-summary-title">بيانات العهدة</div>
            <div className="db2-summary-stats">
              <div className="db2-summary-stat">
                <span className="db2-summary-value">£300,500.00</span>
                <span className="db2-summary-sub">إجمالي المبلغ</span>
              </div>
              <div className="db2-summary-divider" />
              <div className="db2-summary-stat">
                <span className="db2-summary-value">38</span>
                <span className="db2-summary-sub">إجمالي تقارير العهدة</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Charts Grid ── */}
        <div className="db2-charts-grid">
          
          {/* Monthly Trend Chart */}
          <div className="db2-chart-card">
            <div className="db2-chart-title">اتجاهات المصروفات الشهرية</div>
            <div className="db2-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8edf4" />
                  <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '0.8rem' }} />
                  <YAxis stroke="#94a3b8" style={{ fontSize: '0.8rem' }} />
                  <Tooltip 
                    contentStyle={{ background: '#fff', border: '1px solid #e8edf4', borderRadius: '8px' }}
                    formatter={(value) => `£${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="المصروفات" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
                  <Line type="monotone" dataKey="المعتمدة" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution Chart */}
          <div className="db2-chart-card">
            <div className="db2-chart-title">توزيع المصروفات حسب التصنيف</div>
            <div className="db2-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: £${value.toLocaleString()}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `£${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Distribution Chart */}
          <div className="db2-chart-card">
            <div className="db2-chart-title">توزيع التقارير حسب الحالة</div>
            <div className="db2-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8edf4" />
                  <XAxis dataKey="status" stroke="#94a3b8" style={{ fontSize: '0.8rem' }} />
                  <YAxis stroke="#94a3b8" style={{ fontSize: '0.8rem' }} />
                  <Tooltip formatter={(value) => value} />
                  <Bar dataKey="عدد" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
