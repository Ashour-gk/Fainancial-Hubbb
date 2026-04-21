'use client'

import { useState, useMemo, useRef } from 'react'
import {
  Plus, Trash2, FileSpreadsheet, ChevronDown, X
} from 'lucide-react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import ReportDetailView from './report-detail-view'

/* ─── Types ─── */
interface Report {
  id: number
  title: string
  category: string
  status: string
  lastOperationDate: string
  totalAmount: string
  createdBy: string
  selected?: boolean
}

/* ─── Status config ─── */
const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; border: string }> = {
  completed: { label: 'مكتمل',        bg: '#f0fdfa', color: '#0d9488', border: '#99f6e4' },
  approved:  { label: 'معتمد',        bg: '#f0fdf4', color: '#16a34a', border: '#86efac' },
  rejected:  { label: 'مرفوض',        bg: '#fff1f2', color: '#e11d48', border: '#fda4af' },
  review:    { label: 'قيد المراجعة', bg: '#fffbeb', color: '#d97706', border: '#fcd34d' },
  deleted:   { label: 'محذوف',        bg: '#f9fafb', color: '#9ca3af', border: '#d1d5db' },
  draft:     { label: 'مسودّة',       bg: '#f8fafc', color: '#94a3b8', border: '#cbd5e1' },
}

const CATEGORIES = ['إشتراكات نت', 'مشتريات متنوعة', 'عهدة', 'انتقالات']

/* ─── Seed data ─── */
const INITIAL_REPORTS: Report[] = [
  { id: 1, title: 'بيانات تسوية عهدة مبلغ',    category: 'إشتراكات نت',     status: 'approved',  lastOperationDate: '1/15/2024', totalAmount: '£4,750.00',  createdBy: 'Mr. Sweilem' },
  { id: 2, title: 'مشتريات مكتبية متنوعة',       category: 'مشتريات متنوعة', status: 'review',    lastOperationDate: '2/1/2024',  totalAmount: '£12,500.00', createdBy: 'Mr. Sweilem' },
  { id: 3, title: 'عهدة نقدية ربع سنوية',        category: 'عهدة',           status: 'rejected',  lastOperationDate: '1/28/2024', totalAmount: '£25,000.00', createdBy: 'Mr. Sweilem' },
  { id: 4, title: 'مصاريف انتقالات الموظفين',    category: 'انتقالات',       status: 'completed', lastOperationDate: '12/1/2023', totalAmount: '£3,200.00',  createdBy: 'Mr. Sweilem' },
  { id: 5, title: 'مشتريات معدات تقنية',         category: 'مشتريات متنوعة', status: 'draft',     lastOperationDate: '2/5/2024',  totalAmount: '£980.00',    createdBy: 'Mr. Sweilem' },
  { id: 6, title: 'اشتراك خدمات الإنترنت',       category: 'إشتراكات نت',    status: 'deleted',   lastOperationDate: '2/10/2024', totalAmount: '£1,500.00',  createdBy: 'Mr. Sweilem' },
]

let nextId = INITIAL_REPORTS.length + 1

/* ─── Custom Cell Renderers ─── */
const CheckboxCellRenderer = (props: any) => (
  <input
    type="checkbox"
    checked={props.data.selected || false}
    onChange={() => props.onCheckboxChange?.(props.data.id)}
    style={{
      width: '18px',
      height: '18px',
      cursor: 'pointer',
      accentColor: '#2563eb',
    }}
  />
)

const StatusCellRenderer = (props: any) => {
  const cfg = STATUS_CONFIG[props.value] || STATUS_CONFIG.draft
  const [showDropdown, setShowDropdown] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleStatusChange = (newStatus: string) => {
    props.onStatusChange?.(props.data.id, newStatus)
    setShowDropdown(false)
  }

  const availableStatuses = Object.keys(STATUS_CONFIG).filter(s => s !== props.value)

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          padding: '4px 14px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: '700',
          border: `1.5px solid ${cfg.border}`,
          background: cfg.bg,
          color: cfg.color,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          width: '100%',
          textAlign: 'center',
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        {cfg.label}
      </button>
      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(15,27,45,.15)',
            zIndex: 400,
            minWidth: '160px',
            overflow: 'hidden',
          }}
        >
          {availableStatuses.map(status => {
            const statusCfg = STATUS_CONFIG[status]
            return (
              <div
                key={status}
                onClick={() => handleStatusChange(status)}
                style={{
                  padding: '10px 14px',
                  fontSize: '0.85rem',
                  color: '#334155',
                  cursor: 'pointer',
                  transition: 'background 0.12s',
                  textAlign: 'right',
                  direction: 'rtl',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {statusCfg.label}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const ActionsCellRenderer = (props: any) => (
  <button
    onClick={(e) => {
      e.stopPropagation()
      if (confirm('هل تريد حذف هذا التقرير؟')) {
        props.onDelete?.(props.data.id)
      }
    }}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '30px',
      height: '30px',
      borderRadius: '8px',
      border: 'none',
      background: 'transparent',
      color: '#ef4444',
      cursor: 'pointer',
      transition: 'background 0.13s',
    }}
    onMouseEnter={(e) => (e.currentTarget.style.background = '#fee2e2')}
    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
  >
    <Trash2 size={15} />
  </button>
)

export default function FinancialReportsView() {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const [searchText, setSearchText] = useState('')

  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newCat, setNewCat] = useState('')
  const [formErr, setFormErr] = useState('')

  const catRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<AgGridReact>(null)

  const filteredReports = useMemo(() => {
    return reports.filter(r =>
      r.title.toLowerCase().includes(searchText.toLowerCase()) ||
      r.category.toLowerCase().includes(searchText.toLowerCase())
    )
  }, [reports, searchText])

  const handleCheckboxChange = (id: number) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, selected: !r.selected } : r))
  }

  const handleStatusChange = (reportId: number, newStatus: string) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r))
  }

  const handleDelete = (id: number) => {
    setReports(prev => prev.filter(r => r.id !== id))
  }

  const handleCreate = () => {
    if (!newTitle.trim()) {
      setFormErr('عنوان التقرير مطلوب')
      return
    }
    const now = new Date()
    const dateStr = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`
    const newReport: Report = {
      id: nextId++,
      title: newTitle.trim(),
      category: newCat || 'غير مصنف',
      status: 'draft',
      lastOperationDate: dateStr,
      totalAmount: '£0.00',
      createdBy: 'Mr. Sweilem',
    }
    setReports(prev => [newReport, ...prev])
    setShowModal(false)
    setNewTitle('')
    setNewDesc('')
    setNewCat('')
    setFormErr('')
    setSelectedReport(newReport)
  }

  const handleExport = () => {
    const headers = ['م', 'تاريخ آخر عملية', 'الفئة', 'إجمالي المبلغ', 'الحالة']
    const rows = reports.map((r, i) => [
      i + 1,
      r.lastOperationDate,
      r.category,
      r.totalAmount,
      STATUS_CONFIG[r.status]?.label ?? r.status,
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `financial_reports_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const columnDefs = [
    {
      headerName: '',
      field: 'selected',
      width: 50,
      cellRenderer: CheckboxCellRenderer,
      sortable: false,
      filter: false,
      suppressMenu: true,
    },
    {
      headerName: 'تاريخ آخر عملية',
      field: 'lastOperationDate',
      flex: 1,
      minWidth: 120,
      sortable: true,
    },
    {
      headerName: 'الفئة',
      field: 'category',
      flex: 1,
      minWidth: 120,
      sortable: true,
    },
    {
      headerName: 'إجمالي المبلغ',
      field: 'totalAmount',
      flex: 1,
      minWidth: 120,
      sortable: true,
    },
    {
      headerName: 'الحالة',
      field: 'status',
      width: 180,
      cellRenderer: StatusCellRenderer,
      sortable: false,
      filter: false,
      suppressMenu: true,
    },
    {
      headerName: '',
      field: 'actions',
      width: 50,
      cellRenderer: ActionsCellRenderer,
      sortable: false,
      filter: false,
      suppressMenu: true,
    },
  ]

  if (selectedReport) {
    return (
      <ReportDetailView report={selectedReport} onBack={() => setSelectedReport(null)} />
    )
  }

  return (
    <>
      <style>{`
        /* ══ Financial Reports Hub ══ */
        .frh-wrap {
          padding: 28px 16px 60px;
          background: #f5f7fa;
          min-height: 100vh;
          direction: rtl;
          font-family: 'Cairo','Segoe UI',Tahoma,sans-serif;
        }
        @media(max-width:768px) { .frh-wrap { padding: 18px 12px 60px; } }
        @media(max-width:480px) { .frh-wrap { padding: 14px 10px 60px; } }

        .frh-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 24px;
        }
        @media(max-width:768px) {
          .frh-header {
            flex-direction: column;
            align-items: stretch;
          }
        }

        .frh-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #0f1b2d;
          letter-spacing: -.02em;
          flex: 1;
          min-width: 200px;
        }
        @media(max-width:768px) { .frh-title { font-size: 1.4rem; } }
        @media(max-width:480px) { .frh-title { font-size: 1.2rem; } }

        .frh-search-box {
          width: 100%;
          max-width: 340px;
          padding: 10px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-family: inherit;
          font-size: .875rem;
          color: #0f1b2d;
          outline: none;
          direction: rtl;
          transition: border-color .15s;
        }
        @media(max-width:768px) { .frh-search-box { max-width: 100%; } }
        .frh-search-box:focus {
          border-color: #93c5fd;
          box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.2);
        }
        .frh-search-box::placeholder { color: #94a3b8; }

        .frh-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        @media(max-width:768px) { .frh-actions { width: 100%; } }

        .frh-btn-export {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          background: #fff;
          color: #16a34a;
          border: 1.5px solid #bbf7d0;
          border-radius: 10px;
          font-family: inherit;
          font-size: .875rem;
          font-weight: 700;
          cursor: pointer;
          transition: all .17s;
          white-space: nowrap;
        }
        .frh-btn-export:hover {
          background: #f0fdf4;
          border-color: #86efac;
        }
        @media(max-width:768px) { .frh-btn-export { flex: 1; justify-content: center; } }

        .frh-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          box-shadow: 0 2px 14px rgba(15, 27, 45, 0.06);
          overflow: hidden;
          margin-bottom: 24px;
        }

        .ag-theme-quartz {
          --ag-font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
          --ag-font-size: 14px;
          --ag-header-height: 48px;
          --ag-row-height: 46px;
          --ag-header-foreground-color: #94a3b8;
          --ag-header-background-color: #fafafa;
          --ag-odd-row-background-color: #fff;
          --ag-grid-size: 6px;
          --ag-borders: 1px solid #f1f5f9;
        }

        .ag-theme-quartz .ag-header-cell {
          padding: 0 16px;
          font-weight: 700;
          font-size: 0.78rem;
          white-space: nowrap;
          text-align: right;
          direction: rtl;
        }

        .ag-theme-quartz .ag-cell {
          padding: 0 16px;
          direction: rtl;
          text-align: right;
        }

        .ag-theme-quartz .ag-row:hover {
          background-color: #f0f7ff !important;
        }

        .ag-theme-quartz .ag-row {
          border-bottom: 1px solid #f8fafc;
        }

        @media(max-width:768px) {
          .ag-theme-quartz {
            --ag-font-size: 13px;
            --ag-row-height: 42px;
            --ag-header-height: 44px;
          }
          .ag-theme-quartz .ag-header-cell,
          .ag-theme-quartz .ag-cell {
            padding: 0 8px;
          }
        }

        /* ══ Modal ══ */
        .frh-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 20, 40, 0.45);
          backdrop-filter: blur(3px);
          z-index: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: frh-fadein 0.18s ease;
        }
        @keyframes frh-fadein { from { opacity: 0; } to { opacity: 1; } }

        .frh-modal {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(10, 20, 40, 0.2);
          width: 100%;
          max-width: 470px;
          padding: 28px;
          direction: rtl;
          font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
          animation: frh-slideup 0.22s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        @keyframes frh-slideup { from { transform: translateY(20px); opacity: 0; } to { transform: none; opacity: 1; } }
        @media(max-width:480px) { .frh-modal { max-width: 100%; padding: 20px; } }

        .frh-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
        }

        .frh-modal-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .frh-modal-ico {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #eff6ff;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .frh-modal-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f1b2d;
        }

        .frh-modal-close {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: none;
          background: #f1f5f9;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s;
        }
        .frh-modal-close:hover { background: #e2e8f0; color: #0f1b2d; }

        .frh-field { margin-bottom: 16px; }

        .frh-label {
          display: block;
          font-size: 0.82rem;
          font-weight: 700;
          color: #334155;
          margin-bottom: 6px;
        }
        .frh-label span { color: #ef4444; margin-right: 2px; }

        .frh-input,
        .frh-textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.9rem;
          color: #0f1b2d;
          outline: none;
          direction: rtl;
          transition: border-color 0.15s, box-shadow 0.15s;
          box-sizing: border-box;
        }
        .frh-input:focus,
        .frh-textarea:focus {
          border-color: #93c5fd;
          box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.2);
        }
        .frh-input.error { border-color: #fca5a5; }
        .frh-input::placeholder,
        .frh-textarea::placeholder { color: #cbd5e1; }

        .frh-textarea { resize: none; min-height: 72px; }
        .frh-error { font-size: 0.8rem; color: #dc2626; margin-top: 4px; }

        .frh-cat-wrap { position: relative; }

        .frh-cat-btn {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          background: #fff;
          font-family: inherit;
          font-size: 0.9rem;
          color: #0f1b2d;
          cursor: pointer;
          direction: rtl;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: border-color 0.15s;
        }
        .frh-cat-btn:hover,
        .frh-cat-btn:focus { border-color: #93c5fd; outline: none; }

        .frh-cat-dd {
          position: absolute;
          top: calc(100% + 4px);
          right: 0;
          left: 0;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(15, 27, 45, 0.13);
          z-index: 600;
          overflow: hidden;
        }

        .frh-cat-opt {
          padding: 10px 14px;
          font-size: 0.875rem;
          color: #334155;
          cursor: pointer;
          direction: rtl;
          transition: background 0.12s;
        }
        .frh-cat-opt:hover { background: #eff6ff; color: #1d4ed8; }
        .frh-cat-opt.active { background: #dbeafe; color: #1d4ed8; font-weight: 600; }

        .frh-modal-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 24px;
        }
        @media(max-width:480px) { .frh-modal-actions { flex-direction: column-reverse; width: 100%; } }

        .frh-btn-cancel {
          padding: 9px 20px;
          background: #f1f5f9;
          color: #64748b;
          border: none;
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }
        .frh-btn-cancel:hover { background: #e2e8f0; }
        @media(max-width:480px) { .frh-btn-cancel { width: 100%; } }

        .frh-btn-submit {
          padding: 9px 24px;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.17s;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.28);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .frh-btn-submit:not(:disabled):hover { background: #1d4ed8; transform: translateY(-1px); }
        .frh-btn-submit:disabled {
          background: #e2e8f0;
          color: #94a3b8;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }
        @media(max-width:480px) { .frh-btn-submit { width: 100%; justify-content: center; } }
      `}</style>

      <div className="frh-wrap">
        {/* ── Header ── */}
        <div className="frh-header">
          <h1 className="frh-title">سجل التقارير المالية</h1>
          <input
            type="text"
            className="frh-search-box"
            placeholder="ابحث عن التقرير أو الفئة..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <div className="frh-actions">
            <button className="frh-btn-export" onClick={handleExport}>
              <FileSpreadsheet size={16} />
              تصدير بصيغة اكسل
            </button>
          </div>
        </div>

        {/* ── AG Grid Table ── */}
        <div className="frh-card" style={{ height: '500px', minHeight: '400px' }}>
          <div className="ag-theme-quartz" style={{ height: '100%', width: '100%' }}>
            <AgGridReact
              ref={gridRef}
              rowData={filteredReports}
              columnDefs={columnDefs}
              defaultColDef={{
                sortable: true,
                resizable: true,
                suppressMovable: true,
              }}
              domLayout="autoHeight"
              suppressPaginationPanel={true}
              suppressScrollOnNewData={true}
              onCellClicked={(params) => {
                if (params.colDef.field !== 'selected' && params.colDef.field !== 'actions' && params.colDef.field !== 'status') {
                  setSelectedReport(params.data)
                }
              }}
              context={{
                onCheckboxChange: handleCheckboxChange,
                onStatusChange: handleStatusChange,
                onDelete: handleDelete,
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div className="frh-modal-overlay" onClick={() => handleCloseModal()}>
          <div className="frh-modal" onClick={e => e.stopPropagation()}>
            <div className="frh-modal-header">
              <div className="frh-modal-title-wrap">
                <div className="frh-modal-ico">
                  <Plus size={20} />
                </div>
                <h2 className="frh-modal-title">إنشاء تقرير جديد</h2>
              </div>
              <button className="frh-modal-close" onClick={() => handleCloseModal()}>
                <X size={20} />
              </button>
            </div>

            <div className="frh-field">
              <label className="frh-label">
                <span>*</span> عنوان التقرير
              </label>
              <input
                type="text"
                className={'frh-input' + (formErr && !newTitle ? ' error' : '')}
                placeholder="أدخل عنوان التقرير"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
              />
            </div>

            <div className="frh-field">
              <label className="frh-label">الفئة</label>
              <div className="frh-cat-wrap" ref={catRef}>
                <button className="frh-cat-btn" onClick={() => setCatOpen(!catOpen)}>
                  <span>{newCat || 'اختر فئة'}</span>
                  <ChevronDown size={16} />
                </button>
                {catOpen && (
                  <div className="frh-cat-dd">
                    {CATEGORIES.map(cat => (
                      <div
                        key={cat}
                        className={'frh-cat-opt' + (newCat === cat ? ' active' : '')}
                        onClick={() => {
                          setNewCat(cat)
                          setCatOpen(false)
                        }}
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="frh-field">
              <label className="frh-label">الوصف</label>
              <textarea
                className="frh-textarea"
                placeholder="أدخل وصفاً للتقرير (اختياري)"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
              ></textarea>
            </div>

            {formErr && <div className="frh-error">{formErr}</div>}

            <div className="frh-modal-actions">
              <button className="frh-btn-cancel" onClick={() => handleCloseModal()}>
                إلغاء
              </button>
              <button className="frh-btn-submit" onClick={handleCreate}>
                <Plus size={16} />
                إنشاء التقرير
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )

  function handleCloseModal() {
    setShowModal(false)
    setNewTitle('')
    setNewDesc('')
    setNewCat('')
    setFormErr('')
  }
}
