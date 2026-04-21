'use client'

import { useState, useCallback } from 'react'
import {
  ArrowRight, FileText, Tag, Calendar, User, Plus,
  Trash2, Paperclip, X, ChevronDown, Save, CheckCircle
} from 'lucide-react'

/* ─── Types ─────────────────────────────── */
interface ExpenseRow {
  id: number
  date: string
  amount: number
  description: string
  tags: string[]
  attachments: string[]
}

interface ReportDetailProps {
  report: {
    id: number
    title: string
    category: string
    status: string
    lastOperationDate: string
    totalAmount: string
  }
  onBack: () => void
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; border: string }> = {
  completed: { label: 'مكتمل',        bg: '#f0fdfa', color: '#0d9488', border: '#99f6e4' },
  approved:  { label: 'معتمد',        bg: '#f0fdf4', color: '#16a34a', border: '#86efac' },
  rejected:  { label: 'مرفوض',        bg: '#fff1f2', color: '#e11d48', border: '#fda4af' },
  review:    { label: 'قيد المراجعة', bg: '#fffbeb', color: '#d97706', border: '#fcd34d' },
  deleted:   { label: 'محذوف',        bg: '#f9fafb', color: '#9ca3af', border: '#d1d5db' },
  draft:     { label: 'مسودّة',       bg: '#f8fafc', color: '#94a3b8', border: '#cbd5e1' },
}

const CATEGORIES = ['إشتراكات نت', 'مشتريات متنوعة', 'عهدة', 'انتقالات']
const SAMPLE_TAGS = ['مثال', 'فاتورة', 'إيصال', 'عقد', 'أخرى']

let nextId = 10

export default function ReportDetailView({ report, onBack }: ReportDetailProps) {
  const [title, setTitle] = useState(report.title)
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(report.category !== 'غير مصنف' ? report.category : '')
  const [catOpen, setCatOpen] = useState(false)
  const [saved, setSaved] = useState(false)

  const [rows, setRows] = useState<ExpenseRow[]>([
    { id: 1, date: '01/20/2024', amount: 300, description: 'شحن نت المدرسة 01252652642', tags: ['مثال'], attachments: ['مثال'] },
    { id: 2, date: '01/22/2024', amount: 0, description: '', tags: [], attachments: [] },
  ])

  const cfg = STATUS_CONFIG[report.status] ?? STATUS_CONFIG.draft
  const today = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
  const total = rows.reduce((s, r) => s + (r.amount || 0), 0)

  /* ─── Row helpers ─── */
  const addRow = () => {
    setRows(prev => [...prev, { id: nextId++, date: new Date().toLocaleDateString('en-US'), amount: 0, description: '', tags: [], attachments: [] }])
  }

  const deleteRow = useCallback((id: number) => {
    setRows(prev => prev.filter(r => r.id !== id))
  }, [])

  const updateRow = useCallback((id: number, field: keyof ExpenseRow, value: string | number) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }, [])

  const addTag = useCallback((id: number, tag: string) => {
    setRows(prev => prev.map(r => r.id === id && !r.tags.includes(tag) ? { ...r, tags: [...r.tags, tag] } : r))
  }, [])

  const removeTag = useCallback((id: number, tag: string) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, tags: r.tags.filter(t => t !== tag) } : r))
  }, [])

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <>
      <style>{`
        /* ── Report Detail Page ── */
        .rd-wrap{padding:24px 28px 60px;background:#f5f7fa;min-height:100vh;direction:rtl;font-family:'Cairo','Segoe UI',Tahoma,sans-serif}
        @media(max-width:640px){.rd-wrap{padding:16px 12px 60px}}

        /* Back bar */
        .rd-back{display:inline-flex;align-items:center;gap:8px;color:#64748b;font-size:.875rem;font-weight:600;cursor:pointer;border:none;background:none;padding:6px 10px 6px 0;border-radius:8px;transition:color .15s;margin-bottom:20px}
        .rd-back:hover{color:#2563eb}

        /* Header card */
        .rd-header-card{background:#fff;border:1px solid #e2e8f0;border-radius:18px;box-shadow:0 2px 14px rgba(15,27,45,.06);padding:24px 28px;margin-bottom:18px}
        @media(max-width:640px){.rd-header-card{padding:18px 16px}}
        .rd-header-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:18px}
        .rd-title-group{display:flex;align-items:center;gap:12px;flex:1;min-width:200px}
        .rd-title-ico{width:40px;height:40px;border-radius:11px;background:#eff6ff;color:#2563eb;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .rd-title-input{font-size:1.4rem;font-weight:800;color:#0f1b2d;border:none;outline:none;background:transparent;direction:rtl;width:100%;font-family:inherit}
        .rd-title-input::placeholder{color:#94a3b8}
        @media(max-width:640px){.rd-title-input{font-size:1.1rem}}
        .rd-status-badge{display:inline-flex;align-items:center;padding:5px 14px;border-radius:20px;font-size:.8rem;font-weight:700;white-space:nowrap;flex-shrink:0;border:1.5px solid;}
        .rd-desc-input{width:100%;border:none;outline:none;background:transparent;color:#64748b;font-size:.9rem;font-family:inherit;direction:rtl;margin-bottom:16px}
        .rd-desc-input::placeholder{color:#cbd5e1}

        /* Category row */
        .rd-cat-row{display:flex;align-items:center;gap:8px;padding:12px 0;border-top:1px solid #f1f5f9}
        .rd-cat-label{display:flex;align-items:center;gap:6px;font-size:.82rem;color:#64748b;font-weight:600;flex-shrink:0}
        .rd-cat-sel{position:relative;flex:1;max-width:260px}
        .rd-cat-btn{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 14px;border:1.5px solid #e2e8f0;border-radius:9px;background:#fff;cursor:pointer;font-family:inherit;font-size:.875rem;color:#334155;width:100%;transition:border-color .15s}
        .rd-cat-btn:hover{border-color:#93c5fd}
        .rd-cat-dd{position:absolute;top:calc(100% + 4px);right:0;left:0;background:#fff;border:1px solid #e2e8f0;border-radius:11px;box-shadow:0 8px 24px rgba(15,27,45,.13);z-index:200;overflow:hidden}
        .rd-cat-opt{padding:9px 14px;font-size:.875rem;color:#334155;cursor:pointer;direction:rtl;transition:background .12s}
        .rd-cat-opt:hover{background:#eff6ff;color:#1d4ed8}
        .rd-cat-opt.active{background:#dbeafe;color:#1d4ed8;font-weight:600}

        /* Meta row */
        .rd-meta-row{display:flex;align-items:center;gap:24px;padding:14px 0 0;border-top:1px solid #f1f5f9;flex-wrap:wrap;gap:16px}
        .rd-meta-item{display:flex;align-items:center;gap:7px;font-size:.82rem;color:#64748b}
        .rd-meta-val{font-weight:600;color:#334155}

        /* Section card */
        .rd-section{background:#fff;border:1px solid #e2e8f0;border-radius:18px;box-shadow:0 2px 14px rgba(15,27,45,.06);margin-bottom:18px;overflow:hidden}
        .rd-section-hd{display:flex;align-items:center;justify-content:space-between;padding:18px 24px 14px;border-bottom:1px solid #f1f5f9}
        @media(max-width:640px){.rd-section-hd{padding:14px 16px 12px}}
        .rd-section-title{font-size:1rem;font-weight:700;color:#0f1b2d}
        .rd-section-sub{font-size:.78rem;color:#94a3b8;margin-top:1px}

        /* Expense table */
        .rd-table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}
        .rd-table{width:100%;border-collapse:collapse;min-width:520px}
        .rd-thead th{padding:10px 14px;font-size:.78rem;font-weight:700;color:#94a3b8;text-align:right;border-bottom:1px solid #f1f5f9;white-space:nowrap;background:#fafafa}
        .rd-tbody tr{border-bottom:1px solid #f8fafc;transition:background .13s}
        .rd-tbody tr:hover{background:#f8fafd}
        .rd-tbody td{padding:10px 14px;vertical-align:middle}
        .rd-row-num{font-size:.82rem;font-weight:700;color:#94a3b8;text-align:center}
        .rd-cell-input{width:100%;border:none;outline:none;background:transparent;font-family:inherit;font-size:.875rem;color:#1e293b;direction:rtl;min-width:80px}
        .rd-cell-input::placeholder{color:#cbd5e1}
        .rd-cell-input:focus{background:#f0f9ff;border-radius:6px;padding:2px 6px;margin:-2px -6px}
        .rd-amount-input{width:80px;text-align:left;direction:ltr}
        .rd-date-input{width:115px;font-size:.82rem;color:#475569}

        /* Tags cell */
        .rd-tags{display:flex;flex-wrap:wrap;gap:4px;align-items:center}
        .rd-tag{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;background:#eff6ff;color:#1d4ed8;border-radius:6px;font-size:.72rem;font-weight:600}
        .rd-tag-x{cursor:pointer;display:flex;align-items:center;opacity:.6}
        .rd-tag-x:hover{opacity:1}
        .rd-tag-add{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;background:#f1f5f9;color:#64748b;border-radius:6px;font-size:.72rem;cursor:pointer;border:1px dashed #cbd5e1;transition:background .13s}
        .rd-tag-add:hover{background:#e2e8f0;color:#334155}

        /* Attachment tag */
        .rd-attach{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;background:#f0fdf4;color:#15803d;border-radius:6px;font-size:.72rem;font-weight:600}
        .rd-attach-x{cursor:pointer;opacity:.6}
        .rd-attach-x:hover{opacity:1}
        .rd-attach-add{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;background:#f1f5f9;color:#64748b;border-radius:6px;font-size:.72rem;cursor:pointer;border:1px dashed #cbd5e1;transition:background .13s}
        .rd-attach-add:hover{background:#e2e8f0}

        /* Delete row btn */
        .rd-del-btn{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:7px;border:none;background:transparent;color:#ef4444;cursor:pointer;transition:background .13s}
        .rd-del-btn:hover{background:#fee2e2}

        /* Add row btn */
        .rd-add-row{display:flex;align-items:center;gap:7px;padding:11px 20px;color:#2563eb;font-size:.875rem;font-weight:600;cursor:pointer;border:none;background:none;font-family:inherit;transition:color .15s}
        .rd-add-row:hover{color:#1d4ed8}

        /* Summary section */
        .rd-summary-body{padding:20px 24px}
        @media(max-width:640px){.rd-summary-body{padding:16px}}
        .rd-summary-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:.9rem;color:#334155}
        .rd-summary-row:last-child{border-bottom:none;font-size:1rem;font-weight:800;color:#0f1b2d;padding-top:14px}
        .rd-summary-row .label{color:#64748b;font-weight:500}
        .rd-summary-row:last-child .label{color:#0f1b2d;font-weight:800}
        .rd-amount-positive{color:#16a34a;font-weight:700}
        .rd-amount-zero{color:#94a3b8;font-weight:600}

        /* Save button */
        .rd-save-btn{display:inline-flex;align-items:center;gap:7px;padding:10px 22px;background:#2563eb;color:#fff;border:none;border-radius:10px;font-family:inherit;font-size:.875rem;font-weight:700;cursor:pointer;transition:all .17s ease;box-shadow:0 2px 8px rgba(37,99,235,.28)}
        .rd-save-btn:hover{background:#1d4ed8;transform:translateY(-1px)}
        .rd-save-btn.saved{background:#16a34a;box-shadow:0 2px 8px rgba(22,163,74,.28)}
        .rd-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:4px}
      `}</style>

      <div className="rd-wrap">
        {/* Back button */}
        <button className="rd-back" onClick={onBack}>
          <ArrowRight size={16} />
          العودة إلى سجل التقارير
        </button>

        {/* ── Header Card ── */}
        <div className="rd-header-card">
          <div className="rd-header-top">
            <div className="rd-title-group">
              <div className="rd-title-ico"><FileText size={20} /></div>
              <input
                className="rd-title-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="عنوان التقرير..."
              />
            </div>
            <span className="rd-status-badge" style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}>
              {cfg.label}
            </span>
          </div>

          <input
            className="rd-desc-input"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="أضف وصفاً مختصراً (اختياري)"
          />

          {/* Category */}
          <div className="rd-cat-row">
            <span className="rd-cat-label"><Tag size={14} /> التصنيف</span>
            <div className="rd-cat-sel">
              <button className="rd-cat-btn" type="button" onClick={() => setCatOpen(o => !o)}>
                <span style={{ color: category ? '#334155' : '#94a3b8' }}>{category || 'اختر تصنيفاً...'}</span>
                <ChevronDown size={14} style={{ flexShrink: 0, transition: 'transform .2s', transform: catOpen ? 'rotate(180deg)' : 'none' }} />
              </button>
              {catOpen && (
                <div className="rd-cat-dd">
                  {CATEGORIES.map(c => (
                    <div key={c} className={`rd-cat-opt${category === c ? ' active' : ''}`}
                      onClick={() => { setCategory(c); setCatOpen(false) }}>{c}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="rd-meta-row">
            <span className="rd-meta-item">
              <User size={14} color="#94a3b8" />
              <span>أنشئ بواسطة</span>
              <span className="rd-meta-val">Mr. Sweilem</span>
            </span>
            <span className="rd-meta-item">
              <Calendar size={14} color="#94a3b8" />
              <span>تاريخ الإنشاء</span>
              <span className="rd-meta-val">{today}</span>
            </span>
          </div>
        </div>

        {/* ── Expense Log ── */}
        <div className="rd-section">
          <div className="rd-section-hd">
            <div>
              <div className="rd-section-title">سجل المصروفات</div>
              <div className="rd-section-sub">إضافة أو تعديل أو حذف المصروفات</div>
            </div>
          </div>

          <div className="rd-table-wrap">
            <table className="rd-table">
              <thead className="rd-thead">
                <tr>
                  <th style={{ width: 40, textAlign: 'center' }}>م</th>
                  <th style={{ width: 100 }}>المبلغ</th>
                  <th>البيان</th>
                  <th style={{ width: 160 }}>المرفقات</th>
                  <th style={{ width: 40 }}></th>
                </tr>
              </thead>
              <tbody className="rd-tbody">
                {rows.map((row, idx) => (
                  <tr key={row.id}>
                    <td className="rd-row-num">{idx + 1}</td>
                    <td>
                      <input
                        type="number"
                        className="rd-cell-input rd-amount-input"
                        value={row.amount || ''}
                        placeholder="0.0"
                        onChange={e => updateRow(row.id, 'amount', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td>
                      <input
                        className="rd-cell-input"
                        value={row.description}
                        placeholder="أدخل البيان..."
                        onChange={e => updateRow(row.id, 'description', e.target.value)}
                      />
                      {/* Tags */}
                      <div className="rd-tags" style={{ marginTop: 4 }}>
                        {row.tags.map(t => (
                          <span key={t} className="rd-tag">
                            {t}
                            <span className="rd-tag-x" onClick={() => removeTag(row.id, t)}><X size={10} /></span>
                          </span>
                        ))}
                        <span className="rd-tag-add" title="إضافة وسم"
                          onClick={() => {
                            const next = SAMPLE_TAGS.find(t => !row.tags.includes(t))
                            if (next) addTag(row.id, next)
                          }}>
                          <Plus size={10} /> وسم
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="rd-tags">
                        {row.attachments.map(a => (
                          <span key={a} className="rd-attach">
                            <Paperclip size={10} /> {a}
                            <span className="rd-attach-x" onClick={() => setRows(prev => prev.map(r => r.id === row.id ? { ...r, attachments: r.attachments.filter(x => x !== a) } : r))}><X size={10} /></span>
                          </span>
                        ))}
                        <span className="rd-attach-add">
                          <Paperclip size={10} />
                        </span>
                      </div>
                    </td>
                    <td>
                      <button className="rd-del-btn" onClick={() => deleteRow(row.id)} title="حذف الصف">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="rd-add-row" onClick={addRow}>
            <Plus size={16} /> إضافة صف
          </button>
        </div>

        {/* ── Summary ── */}
        <div className="rd-section">
          <div className="rd-section-hd">
            <div>
              <div className="rd-section-title">ملخص</div>
              <div className="rd-section-sub">المجاميع المحسوبة تلقائياً</div>
            </div>
          </div>
          <div className="rd-summary-body">
            <div className="rd-summary-row">
              <span className="label">عدد عمليات الصرف</span>
              <span>{rows.length}</span>
            </div>
            <div className="rd-summary-row">
              <span className="label">إجمالي المصروفات</span>
              <span className={total > 0 ? 'rd-amount-positive' : 'rd-amount-zero'}>
                £{total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="rd-summary-row">
              <span className="label">إجمالي المبلغ</span>
              <span>£{total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="rd-actions">
          <button className={`rd-save-btn${saved ? ' saved' : ''}`} onClick={handleSave}>
            {saved ? <><CheckCircle size={15} /> تم الحفظ</> : <><Save size={15} /> حفظ التقرير</>}
          </button>
        </div>
      </div>
    </>
  )
}
