'use client'

import { useState } from 'react'
import { Trash2, CheckCircle, AlertCircle, Info, Clock } from 'lucide-react'

export default function NotificationsView() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'تم الموافقة على التقرير',
      message: 'تم الموافقة على تقرير الإيرادات الشهري بنجاح',
      time: 'منذ ساعتين',
      read: false,
    },
    {
      id: 2,
      type: 'warning',
      title: 'تنبيه: تاريخ استحقاق قريب',
      message: 'تقرير الميزانية السنوية سيستحق الموافقة خلال 3 أيام',
      time: 'منذ 4 ساعات',
      read: false,
    },
    {
      id: 3,
      type: 'info',
      title: 'تحديث النظام',
      message: 'تم تحديث النظام بميزات جديدة لتحسين الأداء',
      time: 'منذ يوم واحد',
      read: true,
    },
    {
      id: 4,
      type: 'error',
      title: 'خطأ في المعاملة',
      message: 'حدث خطأ أثناء معالجة تقرير المصروفات - يرجى إعادة المحاولة',
      time: 'منذ يوم واحد',
      read: true,
    },
    {
      id: 5,
      type: 'success',
      title: 'تم إنشاء تقرير جديد',
      message: 'تم إنشاء تقرير الأرباح والخسائر بنجاح',
      time: 'منذ يومين',
      read: true,
    },
  ])

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const getIconAndColor = (type: string) => {
    switch (type) {
      case 'success':
        return { icon: <CheckCircle size={20} />, color: '#16a34a', bg: '#dcfce7' }
      case 'warning':
        return { icon: <AlertCircle size={20} />, color: '#ea580c', bg: '#fed7aa' }
      case 'error':
        return { icon: <AlertCircle size={20} />, color: '#dc2626', bg: '#fee2e2' }
      case 'info':
        return { icon: <Info size={20} />, color: '#2563eb', bg: '#dbeafe' }
      default:
        return { icon: <Clock size={20} />, color: '#64748b', bg: '#f1f5f9' }
    }
  }

  return (
    <>
      <style>{`
        .nv-wrap {
          padding: 28px 32px 60px;
          background: #f5f7fa;
          min-height: 100vh;
          direction: rtl;
          font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
        }
        @media (max-width: 768px) {
          .nv-wrap {
            padding: 16px 14px 60px;
          }
        }

        .nv-header {
          margin-bottom: 28px;
        }

        .nv-title {
          font-size: 1.7rem;
          font-weight: 800;
          color: #0f1b2d;
          margin-bottom: 4px;
        }

        .nv-subtitle {
          font-size: 0.875rem;
          color: #64748b;
        }

        .nv-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .nv-notification {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .nv-notification:hover {
          box-shadow: 0 2px 14px rgba(15, 27, 45, 0.06);
          transform: translateY(-1px);
        }

        .nv-notification.unread {
          background: #f8fafd;
          border-color: #cbd5e1;
        }

        .nv-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: white;
        }

        .nv-content {
          flex: 1;
          min-width: 0;
        }

        .nv-notification-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f1b2d;
          margin-bottom: 4px;
        }

        .nv-notification-message {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 6px;
          line-height: 1.4;
        }

        .nv-time {
          font-size: 0.75rem;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .nv-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .nv-btn {
          padding: 6px 10px;
          border: none;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          background: transparent;
          color: #64748b;
        }

        .nv-btn:hover {
          background: #f1f5f9;
          color: #1e293b;
        }

        .nv-delete-btn {
          width: 28px;
          height: 28px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #dc2626;
        }

        .nv-delete-btn:hover {
          background: #fee2e2;
        }

        .nv-empty {
          text-align: center;
          padding: 60px 20px;
          background: #fff;
          border: 1px dashed #cbd5e1;
          border-radius: 12px;
        }

        .nv-empty-icon {
          font-size: 3rem;
          margin-bottom: 16px;
          color: #cbd5e1;
        }

        .nv-empty-text {
          font-size: 0.95rem;
          color: #64748b;
          font-weight: 500;
        }

        .nv-filters {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .nv-filter-btn {
          padding: 8px 16px;
          border: 1px solid #e2e8f0;
          background: #fff;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.15s;
        }

        .nv-filter-btn:hover {
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .nv-filter-btn.active {
          border-color: #3b82f6;
          background: #eff6ff;
          color: #3b82f6;
        }
      `}</style>

      <div className="nv-wrap">
        <div className="nv-header">
          <h1 className="nv-title">الإشعارات</h1>
          <p className="nv-subtitle">إدارة وعرض جميع الإشعارات والتنبيهات الخاصة بك</p>
        </div>

        <div className="nv-filters">
          <button className="nv-filter-btn active">جميع الإشعارات</button>
          <button className="nv-filter-btn">غير المقروءة</button>
          <button className="nv-filter-btn">الموافقات</button>
          <button className="nv-filter-btn">التنبيهات</button>
        </div>

        <div className="nv-container">
          {notifications.length === 0 ? (
            <div className="nv-empty">
              <div className="nv-empty-icon">✓</div>
              <div className="nv-empty-text">لا توجد إشعارات جديدة</div>
            </div>
          ) : (
            notifications.map(notif => {
              const { icon, color, bg } = getIconAndColor(notif.type)
              return (
                <div
                  key={notif.id}
                  className={`nv-notification${notif.read ? '' : ' unread'}`}
                >
                  <div
                    className="nv-icon"
                    style={{ background: bg, color }}
                  >
                    {icon}
                  </div>
                  <div className="nv-content">
                    <div className="nv-notification-title">{notif.title}</div>
                    <div className="nv-notification-message">{notif.message}</div>
                    <div className="nv-time">
                      <Clock size={13} />
                      {notif.time}
                    </div>
                  </div>
                  <div className="nv-actions">
                    {!notif.read && (
                      <button
                        className="nv-btn"
                        onClick={() => handleMarkAsRead(notif.id)}
                      >
                        وضع علامة كمقروء
                      </button>
                    )}
                    <button
                      className="nv-delete-btn"
                      onClick={() => handleDelete(notif.id)}
                      title="حذف الإشعار"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}
