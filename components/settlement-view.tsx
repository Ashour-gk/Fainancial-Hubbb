'use client'

import { useState, useRef } from 'react'
import { Calendar, User, FileText, Paperclip, Trash2, Plus } from 'lucide-react'
import { AgGridReact } from 'ag-grid-react'
import '@/lib/ag-grid-setup' // Register AG Grid modules

interface ExpenseRecord {
  id: number
  date: string
  amount: string
  description: string
  attachment?: string
}

export default function SettlementView() {
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('internet')
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([
    {
      id: 1,
      date: '01/20/2024',
      amount: '300',
      description: 'شحن نت المدرسة 01252652642',
      attachment: 'مثال'
    },
    {
      id: 2,
      date: '01/22/2024',
      amount: '00.0',
      description: '',
      attachment: ''
    }
  ])

  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const gridRef = useRef<AgGridReact>(null)

  const addExpenseRow = () => {
    const newExpense: ExpenseRecord = {
      id: Math.max(...expenses.map(e => e.id), 0) + 1,
      date: new Date().toISOString().split('T')[0],
      amount: '0.00',
      description: '',
      attachment: ''
    }
    setExpenses([...expenses, newExpense])
    setSaveMessage('تمت إضافة صف جديد')
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const deleteExpenseRow = (id: number) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter(expense => expense.id !== id))
      setSaveMessage('تم حذف الصف بنجاح')
      setTimeout(() => setSaveMessage(''), 3000)
    } else {
      setSaveMessage('لا يمكن حذف جميع الصفوف')
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  const updateExpense = (id: number, field: keyof ExpenseRecord, value: string) => {
    setExpenses(expenses.map(expense =>
      expense.id === id ? { ...expense, [field]: value } : expense
    ))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage('')

    try {
      // Validate data
      const hasEmptyFields = expenses.some(exp => !exp.date || !exp.description || parseFloat(exp.amount) < 0)
      if (hasEmptyFields) {
        setSaveMessage('يرجى ملء جميع الحقول المطلوبة')
        setTimeout(() => setSaveMessage(''), 3000)
        return
      }

      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSaveMessage('تم حفظ البيانات بنجاح!')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      setSaveMessage('حدث خطأ أثناء الحفظ')
      setTimeout(() => setSaveMessage(''), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = () => {
    // Create CSV content
    const headers = ['م', 'التاريخ', 'المبلغ', 'البيان', 'المرفقات']
    const csvContent = [
      headers.join(','),
      ...expenses.map((exp, index) =>
        [index + 1, exp.date, exp.amount, exp.description, exp.attachment || ''].join(',')
      )
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setSaveMessage('تم تصدير البيانات بنجاح')
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || '0'), 0)

  // AgGrid Column Definitions
  const [colDefs] = useState([
    {
      headerName: 'م',
      valueGetter: (params: any) => params.node.rowIndex + 1,
      width: 60,
      sortable: false,
      filter: false
    },
    {
      headerName: 'التاريخ',
      field: 'date',
      editable: true,
      cellEditor: 'agDateCellEditor',
      cellEditorParams: {
        dateFormat: 'yyyy-MM-dd'
      },
      width: 120
    },
    {
      headerName: 'المبلغ',
      field: 'amount',
      editable: true,
      cellEditor: 'agNumberCellEditor',
      width: 100
    },
    {
      headerName: 'البيان',
      field: 'description',
      editable: true,
      cellEditor: 'agTextCellEditor',
      flex: 1
    },
    {
      headerName: 'المرفقات',
      field: 'attachment',
      editable: false,
      cellRenderer: (params: any) => {
        if (params.value) {
          return (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">{params.value}</span>
              <button
                onClick={() => {
                  const updatedExpenses = expenses.map(exp =>
                    exp.id === params.data.id ? { ...exp, attachment: '' } : exp
                  )
                  setExpenses(updatedExpenses)
                }}
                className="text-gray-400 hover:text-red-500"
              >
                <span className="text-xs">×</span>
              </button>
            </div>
          )
        }
        return (
          <button className="text-gray-400 hover:text-gray-600">
            <Paperclip size={16} />
          </button>
        )
      },
      width: 100
    },
    {
      headerName: '',
      field: 'actions',
      editable: false,
      cellRenderer: (params: any) => (
        <button
          onClick={() => deleteExpenseRow(params.data.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={16} />
        </button>
      ),
      width: 60,
      sortable: false,
      filter: false
    }
  ])

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    headerClass: 'ag-header-cell-label'
  }

  const onCellValueChanged = (params: any) => {
    const updatedExpenses = expenses.map(exp =>
      exp.id === params.data.id ? { ...params.data } : exp
    )
    setExpenses(updatedExpenses)
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Settlement Data Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 relative">
        <div className="absolute top-4 left-4">
          <FileText className="text-gray-400 dark:text-gray-600" size={24} />
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">بيانات تسوية عهدة مبلغ</h2>

        <div className="space-y-4">
          {/* Description Field */}
          <div>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="أضف وصفا مختصرا (اختياري)"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Status and Category Row */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              <span className="text-sm text-gray-700 dark:text-gray-300">مسودة</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">التصنيف:</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-right bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="internet">إشتراكات نت</option>
                <option value="other">أخرى</option>
              </select>
            </div>
          </div>

          {/* Creation Info */}
          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>أنشئ بواسطة أحمد يحيى</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>تاريخ الإنشاء ١٥ يناير ٢٠٢٤</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Record Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 relative">
        <div className="absolute top-4 left-4">
          <FileText className="text-gray-400 dark:text-gray-600" size={24} />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">سجل المصروفات</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">إضافة أو تعديل أو حذف المصروفات</p>
        </div>

        {/* AgGrid Table */}
        <div className="ag-theme-alpine dark:ag-theme-alpine-dark" style={{ height: 300, width: '100%', direction: 'rtl' }}>
          <AgGridReact
            ref={gridRef}
            rowData={expenses}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            onCellValueChanged={onCellValueChanged}
            domLayout='autoHeight'
            enableRtl={true}
            suppressRowClickSelection={true}
            theme="legacy"
          />
        </div>

        {/* Add Row Button */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={addExpenseRow}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus size={20} />
            <span>إضافة صف</span>
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
          >
            <FileText size={20} />
            <span>تصدير CSV</span>
          </button>
        </div>

        {/* Status Message */}
        {saveMessage && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${saveMessage.includes('نجاح') ? 'bg-green-100 text-green-800' :
              saveMessage.includes('خطأ') ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
            }`}>
            {saveMessage}
          </div>
        )}
      </div>

      {/* Summary Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 relative">
        <div className="absolute top-4 left-4">
          <FileText className="text-gray-400 dark:text-gray-600" size={24} />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">ملخص</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">المجاميع المحسوبة تلقائياً</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">إجمالي المصروفات</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              £{totalExpenses.toFixed(2)}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">عدد البنود</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">{expenses.length}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">المتبقي</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              £{(300 - totalExpenses).toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'جاري الحفظ...' : 'حفظ البيانات'}
          </button>
        </div>
      </div>
    </div>
  )
}
