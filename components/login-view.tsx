'use client'

import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader } from 'lucide-react'

export default function LoginView({ onNavigateToSignUp, onLoginSuccess }: {
  onNavigateToSignUp: () => void
  onLoginSuccess: () => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate login
    setTimeout(() => {
      if (email && password) {
        onLoginSuccess()
      } else {
        setError('يرجى إدخال البريد الإلكتروني وكلمة المرور')
      }
      setLoading(false)
    }, 1500)
  }

  return (
    <>
      <style>{`
        .lv-wrap {
          min-height: 100vh;
          background: linear-gradient(135deg, #0d1f35 0%, #1a2f4a 50%, #0f2442 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          direction: rtl;
          font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
        }

        .lv-container {
          width: 100%;
          max-width: 420px;
        }

        .lv-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(15, 27, 45, 0.3);
          overflow: hidden;
        }

        .lv-header {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          padding: 40px 24px;
          text-align: center;
        }

        .lv-logo {
          width: 56px;
          height: 56px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          font-size: 24px;
          color: #fff;
        }

        .lv-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 4px;
        }

        .lv-subtitle {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.85);
        }

        .lv-body {
          padding: 32px 24px;
        }

        .lv-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .lv-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .lv-label {
          font-size: 0.875rem;
          font-weight: 700;
          color: #374151;
        }

        .lv-input-wrap {
          position: relative;
        }

        .lv-input {
          width: 100%;
          padding: 12px 16px 12px 40px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.875rem;
          color: #1e293b;
          background: #fff;
          outline: none;
          direction: rtl;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .lv-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
        }

        .lv-input::placeholder {
          color: #94a3b8;
        }

        .lv-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .lv-password-toggle {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          transition: color 0.2s;
        }

        .lv-password-toggle:hover {
          color: #3b82f6;
        }

        .lv-remember-forgot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.875rem;
        }

        .lv-remember {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
        }

        .lv-remember input {
          cursor: pointer;
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 1.5px solid #e2e8f0;
        }

        .lv-forgot-link {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }

        .lv-forgot-link:hover {
          color: #2563eb;
        }

        .lv-error {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          background: #fee2e2;
          border: 1px solid #fca5a5;
          border-radius: 10px;
          font-size: 0.875rem;
          color: #dc2626;
        }

        .lv-error-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .lv-submit-btn {
          padding: 12px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .lv-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }

        .lv-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .lv-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
          font-size: 0.875rem;
          color: #cbd5e1;
        }

        .lv-divider::before,
        .lv-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }

        .lv-social-buttons {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .lv-social-btn {
          flex: 1;
          padding: 10px;
          border: 1.5px solid #e2e8f0;
          background: #fff;
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .lv-social-btn:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
        }

        .lv-footer {
          padding: 0 24px 24px;
          text-align: center;
          font-size: 0.875rem;
          color: #64748b;
          border-top: 1px solid #f1f5f9;
        }

        .lv-footer-text {
          margin-bottom: 8px;
        }

        .lv-signup-link {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 700;
          cursor: pointer;
          transition: color 0.2s;
        }

        .lv-signup-link:hover {
          color: #2563eb;
        }
      `}</style>

      <div className="lv-wrap">
        <div className="lv-container">
          <div className="lv-card">
            {/* Header */}
            <div className="lv-header">
              <div className="lv-logo">📊</div>
              <h1 className="lv-title">Financial Hub</h1>
              <p className="lv-subtitle">نظام التقارير المالية المتقدم</p>
            </div>

            {/* Body */}
            <div className="lv-body">
              {error && (
                <div className="lv-error">
                  <AlertCircle size={18} className="lv-error-icon" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="lv-form">
                {/* Email Field */}
                <div className="lv-field">
                  <label className="lv-label">البريد الإلكتروني</label>
                  <div className="lv-input-wrap">
                    <Mail size={16} className="lv-icon" />
                    <input
                      type="email"
                      className="lv-input"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="lv-field">
                  <label className="lv-label">كلمة المرور</label>
                  <div className="lv-input-wrap">
                    <Lock size={16} className="lv-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="lv-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="lv-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="lv-remember-forgot">
                  <label className="lv-remember">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={loading}
                    />
                    تذكرني
                  </label>
                  <a href="#" className="lv-forgot-link">هل نسيت كلمة المرور؟</a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="lv-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      جاري تسجيل الدخول...
                    </>
                  ) : (
                    'تسجيل الدخول'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="lv-divider">أو</div>

              {/* Social Buttons */}
              <div className="lv-social-buttons">
                <button className="lv-social-btn" disabled={loading}>
                  <span>🔷</span>
                  Google
                </button>
                <button className="lv-social-btn" disabled={loading}>
                  <span>🔷</span>
                  Microsoft
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="lv-footer">
              <p className="lv-footer-text">
                ليس لديك حساب؟{' '}
                <span className="lv-signup-link" onClick={onNavigateToSignUp}>
                  أنشئ حساب جديد
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
