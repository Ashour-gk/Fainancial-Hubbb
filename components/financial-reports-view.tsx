'use client'

import { useState, useRef } from 'react'
import {
  Plus, Trash2, FileText, ChevronDown, User, Calendar, X, FileSpreadsheet
} from 'lucide-react'
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

const CATEGORIES = ['إشتراكات نت', 'مشتريات متنوعة', 'عهدة', 'انتقالات', 'رواتب', 'صيانة']

/* ─── Seed data ─── */
const INITIAL_REPORTS: Report[] = [
  { id: 1, title: 'بيانات تسوية عهدة مبلغ',    category: 'إشتراكات نت',     status: 'approved',  lastOperationDate: '1/15/2024', totalAmount: '£4,750.00',  createdBy: 'أحمد يحيى' },
  { id: 2, title: 'مشتريات مكتبية متنوعة',       category: 'مشتريات متنوعة', status: 'review',    lastOperationDate: '2/1/2024',  totalAmount: '£12,500.00', createdBy: 'أحمد يحيى' },
  { id: 3, title: 'عهدة نقدية ربع سنوية',        category: 'عهدة',           status: 'rejected',  lastOperationDate: '1/28/2024', totalAmount: '£25,000.00', createdBy: 'أحمد يحيى' },
  { id: 4, title: 'مصاريف انتقالات الموظفين',    category: 'انتقالات',       status: 'completed', lastOperationDate: '12/1/2023', totalAmount: '£3,200.00',  createdBy: 'أحمد يحيى' },
  { id: 5, title: 'مشتريات معدات تقنية',         category: 'مشتريات متنوعة', status: 'draft',     lastOperationDate: '2/5/2024',  totalAmount: '£980.00',    createdBy: 'أحمد يحيى' },
  { id: 6, title: 'اشتراك خدمات الإنترنت',       category: 'إشتراكات نت',    status: 'deleted',   lastOperationDate: '2/10/2024', totalAmount: '£1,500.00',  createdBy: 'أحمد يحيى' },
]

let nextId = INITIAL_REPORTS.length + 1

export default function FinancialReportsView() {
  const [reports, setReports]             = useState<Report[]>(INITIAL_REPORTS)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showModal, setShowModal]         = useState(false)
  const [catOpen, setCatOpen]             = useState(false)

  /* Modal form state */
  const [newTitle, setNewTitle]   = useState('')
  const [newDesc, setNewDesc]     = useState('')
  const [newCat, setNewCat]       = useState('')
  const [formErr, setFormErr]     = useState('')

  const catRef = useRef<HTMLDivElement>(null)

  /* ── Open detail view ── */
  const handleRowClick = (report: Report) => setSelectedReport(report)

  /* ── Delete report ── */
  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    if (confirm('هل تريد حذف هذا التقرير؟')) {
      setReports(prev => prev.filter(r => r.id !== id))
    }
  }

  /* ── Create report ── */
  const handleCreate = () => {
    if (!newTitle.trim()) { setFormErr('عنوان التقرير مطلوب'); return }
    const now = new Date()
    const dateStr = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`
    const newReport: Report = {
      id: nextId++,
      title: newTitle.trim(),
      category: newCat || 'غير مصنف',
      status: 'draft',
      lastOperationDate: dateStr,
      totalAmount: '£0.00',
      createdBy: 'أحمد يحيى',
    }
    setReports(prev => [newReport, ...prev])
    setShowModal(false)
    setNewTitle(''); setNewDesc(''); setNewCat(''); setFormErr('')
    // Immediately open the detail view
    setSelectedReport(newReport)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setNewTitle(''); setNewDesc(''); setNewCat(''); setFormErr('')
  }

  /* ── Export to Excel (CSV) ── */
  const handleExport = () => {
    const headers = ['م', 'تاريخ آخر عملية', 'الفئة', 'إجمالي المبلغ', 'الحالة']
    const rows = reports.map((r, i) => [
      i + 1, r.lastOperationDate, r.category, r.totalAmount,
      STATUS_CONFIG[r.status]?.label ?? r.status,
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `financial_reports_${new Date().toISOString().split('T')[0]}.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  /* ── If a report is selected, show its detail page ── */
  if (selectedReport) {
    return (
      <ReportDetailView
        report={selectedReport}
        onBack={() => setSelectedReport(null)}
      />
    )
  }

  /* ── List View ── */
  return (
    <>
      <style>{`
        /* ══ Financial Reports Hub ══ */
        .frh-wrap {
          padding: 28px 32px 60px;
          background: #f5f7fa;
          min-height: 100vh;
          direction: rtl;
          font-family: 'Cairo','Segoe UI',Tahoma,sans-serif;
        }
        @media(max-width:640px){ .frh-wrap{ padding:18px 14px 60px } }

        /* Header */
        .frh-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 24px;
        }
        .frh-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #0f1b2d;
          letter-spacing: -.02em;
        }
        .frh-actions { display: flex; gap: 10px; flex-wrap: wrap; }

        /* Buttons */
        .frh-btn-create {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 20px;
          background: #2563eb; color: #fff;
          border: none; border-radius: 10px;
          font-family: inherit; font-size: .875rem; font-weight: 700;
          cursor: pointer; transition: all .17s;
          box-shadow: 0 2px 10px rgba(37,99,235,.28);
        }
        .frh-btn-create:hover { background: #1d4ed8; transform: translateY(-1px); }
        .frh-btn-export {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 18px;
          background: #fff; color: #16a34a;
          border: 1.5px solid #bbf7d0; border-radius: 10px;
          font-family: inherit; font-size: .875rem; font-weight: 700;
          cursor: pointer; transition: all .17s;
        }
        .frh-btn-export:hover { background: #f0fdf4; border-color: #86efac; }

        /* Table card */
        .frh-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          box-shadow: 0 2px 14px rgba(15,27,45,.06);
          overflow: hidden;
        }
        .frh-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .frh-table {
          width: 100%; border-collapse: collapse; min-width: 560px;
        }
        .frh-thead th {
          padding: 12px 18px;
          font-size: .78rem; font-weight: 700; color: #94a3b8;
          text-align: right;
          border-bottom: 1px solid #f1f5f9;
          background: #fafafa;
          white-space: nowrap;
        }
        .frh-thead th .frh-th-inner {
          display: inline-flex; align-items: center; gap: 5px;
        }
        .frh-tbody tr {
          border-bottom: 1px solid #f8fafc;
          transition: background .13s;
          cursor: pointer;
        }
        .frh-tbody tr:last-child { border-bottom: none; }
        .frh-tbody tr:hover { background: #f0f7ff; }
        .frh-tbody td { padding: 13px 18px; vertical-align: middle; }
        .frh-td-date { font-size: .875rem; color: #334155; font-weight: 500; }
        .frh-td-cat  { font-size: .875rem; color: #334155; font-weight: 600; }
        .frh-td-amt  { font-size: .9rem;   color: #0f1b2d; font-weight: 700; }
        .frh-status-badge {
          display: inline-flex; align-items: center;
          padding: 4px 14px; border-radius: 20px;
          font-size: .8rem; font-weight: 700; white-space: nowrap;
          border: 1.5px solid;
        }
        .frh-del-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; border-radius: 8px;
          border: none; background: transparent; color: #ef4444;
          cursor: pointer; transition: background .13s;
        }
        .frh-del-btn:hover { background: #fee2e2; }

        /* Empty state */
        .frh-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 60px 20px; color: #94a3b8; gap: 12px;
        }
        .frh-empty-icon { width: 56px; height: 56px; border-radius: 16px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; }
        .frh-empty p { font-size: .9rem; font-weight: 600; margin: 0; }

        /* ══ Modal ══ */
        .frh-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(10,20,40,.45);
          backdrop-filter: blur(3px);
          z-index: 500;
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          animation: frh-fadein .18s ease;
        }
        @keyframes frh-fadein { from{opacity:0} to{opacity:1} }
        .frh-modal {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(10,20,40,.2);
          width: 100%; max-width: 470px;
          padding: 28px;
          direction: rtl;
          font-family: 'Cairo','Segoe UI',Tahoma,sans-serif;
          animation: frh-slideup .22s cubic-bezier(.4,0,.2,1);
          position: relative;
        }
        @keyframes frh-slideup { from{transform:translateY(20px);opacity:0} to{transform:none;opacity:1} }

        .frh-modal-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 22px;
        }
        .frh-modal-title-wrap { display: flex; align-items: center; gap: 10px; }
        .frh-modal-ico {
          width: 38px; height: 38px; border-radius: 10px;
          background: #eff6ff; color: #2563eb;
          display: flex; align-items: center; justify-content: center;
        }
        .frh-modal-title { font-size: 1.15rem; font-weight: 800; color: #0f1b2d; }
        .frh-modal-close {
          width: 32px; height: 32px; border-radius: 8px;
          border: none; background: #f1f5f9; color: #64748b;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background .15s;
        }
        .frh-modal-close:hover { background: #e2e8f0; color: #0f1b2d; }

        /* Meta line (user + date) */
        .frh-modal-meta {
          display: flex; align-items: center; gap: 6px;
          font-size: .82rem; color: #64748b;
          background: #f8fafc; border-radius: 9px;
          padding: 8px 14px; margin-bottom: 20px;
        }
        .frh-modal-meta svg { color: #94a3b8; }

        /* Fields */
        .frh-field { margin-bottom: 16px; }
        .frh-label {
          display: block; font-size: .82rem; font-weight: 700;
          color: #334155; margin-bottom: 6px;
        }
        .frh-label span { color: #ef4444; margin-right: 2px; }
        .frh-input, .frh-textarea {
          width: 100%; padding: 10px 14px;
          border: 1.5px solid #e2e8f0; border-radius: 10px;
          font-family: inherit; font-size: .9rem; color: #0f1b2d;
          outline: none; direction: rtl;
          transition: border-color .15s, box-shadow .15s;
          box-sizing: border-box;
        }
        .frh-input:focus, .frh-textarea:focus {
          border-color: #93c5fd;
          box-shadow: 0 0 0 3px rgba(147,197,253,.2);
        }
        .frh-input.error { border-color: #fca5a5; }
        .frh-input::placeholder, .frh-textarea::placeholder { color: #cbd5e1; }
        .frh-textarea { resize: none; min-height: 72px; }
        .frh-error { font-size: .8rem; color: #dc2626; margin-top: 4px; }

        /* Category dropdown */
        .frh-cat-wrap { position: relative; }
        .frh-cat-btn {
          width: 100%; padding: 10px 14px;
          border: 1.5px solid #e2e8f0; border-radius: 10px;
          background: #fff; font-family: inherit; font-size: .9rem;
          color: #0f1b2d; cursor: pointer; direction: rtl;
          display: flex; align-items: center; justify-content: space-between;
          transition: border-color .15s;
        }
        .frh-cat-btn:hover, .frh-cat-btn:focus { border-color: #93c5fd; outline: none; }
        .frh-cat-dd {
          position: absolute; top: calc(100% + 4px); right: 0; left: 0;
          background: #fff; border: 1px solid #e2e8f0;
          border-radius: 12px; box-shadow: 0 8px 24px rgba(15,27,45,.13);
          z-index: 600; overflow: hidden;
        }
        .frh-cat-opt {
          padding: 10px 14px; font-size: .875rem; color: #334155;
          cursor: pointer; direction: rtl; transition: background .12s;
        }
        .frh-cat-opt:hover { background: #eff6ff; color: #1d4ed8; }
        .frh-cat-opt.active { background: #dbeafe; color: #1d4ed8; font-weight: 600; }

        .frh-cat-hint {
          font-size: .76rem; color: #94a3b8; margin-top: 5px;
        }

        /* Modal actions */
        .frh-modal-actions {
          display: flex; align-items: center; justify-content: flex-end;
          gap: 10px; margin-top: 24px;
        }
        .frh-btn-cancel {
          padding: 9px 20px; background: #f1f5f9; color: #64748b;
          border: none; border-radius: 10px;
          font-family: inherit; font-size: .875rem; font-weight: 600;
          cursor: pointer; transition: background .15s;
        }
        .frh-btn-cancel:hover { background: #e2e8f0; }
        .frh-btn-submit {
          padding: 9px 24px; background: #2563eb; color: #fff;
          border: none; border-radius: 10px;
          font-family: inherit; font-size: .875rem; font-weight: 700;
          cursor: pointer; transition: all .17s;
          box-shadow: 0 2px 8px rgba(37,99,235,.28);
          display: inline-flex; align-items: center; gap: 6px;
        }
        .frh-btn-submit:not(:disabled):hover { background: #1d4ed8; transform: translateY(-1px); }
        .frh-btn-submit:disabled {
          background: #e2e8f0;
          color: #94a3b8;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }
      `}</style>

      <div className="frh-wrap">
        {/* ── Header ── */}
        <div className="frh-header">
          <h1 className="frh-title">سجل التقارير المالية</h1>
          <div className="frh-actions">
            <button className="frh-btn-export" onClick={handleExport}>
              <FileSpreadsheet size={16} />
              تصدير بصيغة اكسل
            </button>
            <button className="frh-btn-create" onClick={() => setShowModal(true)}>
              <Plus size={16} />
              إنشاء تقرير
            </button>
          </div>
        </div>

        {/* ── Table Card ── */}
        <div className="frh-card">
          <div className="frh-table-wrap">
            <table className="frh-table">
              <thead className="frh-thead">
                <tr>
                  <th style={{ width: 40 }}></th>
                  <th>
                    <span className="frh-th-inner">
                      تاريخ آخر عملية <ChevronDown size={12} />
                    </span>
                  </th>
                  <th>
                    <span className="frh-th-inner">
                      الفئة <ChevronDown size={12} />
                    </span>
                  </th>
                  <th>
                    <span className="frh-th-inner">
                      إجمالي المبلغ <ChevronDown size={12} />
                    </span>
                  </th>
                  <th>
                    <span className="frh-th-inner">
                      الحالة <ChevronDown size={12} />
                    </span>
                  </th>
                  <th style={{ width: 40 }}></th>
                </tr>
              </thead>
              <tbody className="frh-tbody">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="frh-empty">
                        <div className="frh-empty-icon">
                          <FileText size={26} color="#94a3b8" />
                        </div>
                        <p>لا توجد تقارير حتى الآن</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  reports.map(report => {
                    const cfg = STATUS_CONFIG[report.status] ?? STATUS_CONFIG.draft
                    return (
                      <tr key={report.id} onClick={() => handleRowClick(report)}>
                        <td>
                          <button
                            className="frh-del-btn"
                            onClick={e => handleDelete(e, report.id)}
                            title="حذف التقرير"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                        <td className="frh-td-date">{report.lastOperationDate}</td>
                        <td className="frh-td-cat">{report.category}</td>
                        <td className="frh-td-amt">{report.totalAmount}</td>
                        <td>
                          <span
                            className="frh-status-badge"
                            style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}
                          >
                            {cfg.label}
                          </span>
                        </td>
                        <td style={{ width: 40 }}></td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ══ Create Report Modal ══ */}
      {showModal && (
        <div className="frh-modal-overlay" onClick={e => { if (e.target === e.currentTarget) handleCloseModal() }}>
          <div className="frh-modal">
            {/* Modal Header */}
            <div className="frh-modal-header">
              <div className="frh-modal-title-wrap">
                <div className="frh-modal-ico"><FileText size={18} /></div>
                <span className="frh-modal-title">أنشئ تقريراً جديداً</span>
              </div>
              <button className="frh-modal-close" onClick={handleCloseModal}>
                <X size={16} />
              </button>
            </div>

            {/* Meta: user + date */}
            <div className="frh-modal-meta">
              <User size={14} />
              <span>أحمد يحيى</span>
              <span style={{ margin: '0 8px', color: '#cbd5e1' }}>|</span>
              <Calendar size={14} />
              <span>
                {new Date().toLocaleDateString('ar-EG', {
                  year: 'numeric', month: 'numeric', day: 'numeric'
                })}
              </span>
            </div>

            {/* Title field */}
            <div className="frh-field">
              <label className="frh-label">
                عنوان التقرير <span>*</span>
              </label>
              <input
                className={`frh-input${formErr ? ' error' : ''}`}
                placeholder="مثال: بيانات تسوية عهدة مبلغ"
                value={newTitle}
                onChange={e => { setNewTitle(e.target.value); setFormErr('') }}
                autoFocus
              />
              {formErr && <div className="frh-error">{formErr}</div>}
            </div>

            {/* Description field */}
            <div className="frh-field">
              <label className="frh-label">الوصف <span>*</span></label>
              <textarea
                className="frh-textarea"
                placeholder="وصف مختصر عن التقرير..."
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
              />
            </div>

            {/* Category field */}
            <div className="frh-field">
              <label className="frh-label">التصنيف <span>*</span></label>
              <div className="frh-cat-wrap" ref={catRef}>
                <button
                  type="button"
                  className="frh-cat-btn"
                  onClick={() => setCatOpen(o => !o)}
                >
                  <span style={{ color: newCat ? '#0f1b2d' : '#cbd5e1' }}>
                    {newCat || 'اختر تصنيفاً...'}
                  </span>
                  <ChevronDown
                    size={14}
                    style={{ flexShrink: 0, transition: 'transform .2s', transform: catOpen ? 'rotate(180deg)' : 'none' }}
                  />
                </button>
                {catOpen && (
                  <div className="frh-cat-dd">
                    {CATEGORIES.map(c => (
                      <div
                        key={c}
                        className={`frh-cat-opt${newCat === c ? ' active' : ''}`}
                        onClick={() => { setNewCat(c); setCatOpen(false) }}
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="frh-modal-actions">
              <button className="frh-btn-cancel" onClick={handleCloseModal}>إلغاء</button>
              <button
                className="frh-btn-submit"
                onClick={handleCreate}
                disabled={!newTitle.trim() || !newDesc.trim() || !newCat}
                title={!newTitle.trim() || !newDesc.trim() || !newCat ? 'يرجى تعبئة جميع الحقول أولاً' : undefined}
              >
                <Plus size={15} />
                إنشاء التقرير
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
