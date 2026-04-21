'use client'

import { useState } from 'react'
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Loader } from 'lucide-react'

export default function SignUpView({ onNavigateToLogin, onSignUpSuccess }: {
  onNavigateToLogin: () => void
  onSignUpSuccess: () => void
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (name === 'password') {
      calculatePasswordStrength(value)
    }
  }

  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++
    setPasswordStrength(strength)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.fullName || !formData.email || !formData.password) {
      setError('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة')
      return
    }

    if (formData.password.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
      return
    }

    if (!formData.agreeToTerms) {
      setError('يجب عليك الموافقة على الشروط والأحكام')
      return
    }

    setLoading(true)
    setTimeout(() => {
      onSignUpSuccess()
      setLoading(false)
    }, 1500)
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return '#cbd5e1'
    if (passwordStrength === 1) return '#ea580c'
    if (passwordStrength === 2) return '#f59e0b'
    if (passwordStrength === 3) return '#84cc16'
    return '#16a34a'
  }

  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return 'ضعيفة جداً'
    if (passwordStrength === 1) return 'ضعيفة'
    if (passwordStrength === 2) return 'متوسطة'
    if (passwordStrength === 3) return 'قوية'
    return 'قوية جداً'
  }

  return (
    <>
      <style>{`
        .sv-wrap {
          min-height: 100vh;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          direction: rtl;
          font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
        }

        .sv-container {
          width: 100%;
          max-width: 480px;
        }

        .sv-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(15, 27, 45, 0.3);
          overflow: hidden;
        }

        .sv-header {
          background: linear-gradient(135deg, #c1272d, #a91f24);
          padding: 32px 24px;
          text-align: center;
        }

        .sv-logo {
          width: 48px;
          height: 48px;
          background: #fff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          font-size: 20px;
          color: #c1272d;
        }
        .sv-logo img {
          width: 36px;
          height: 36px;
          object-fit: contain;
        }

        .sv-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 4px;
        }

        .sv-subtitle {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.85);
        }

        .sv-body {
          padding: 28px 24px;
        }

        .sv-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .sv-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sv-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .sv-input-wrap {
          position: relative;
        }

        .sv-input {
          width: 100%;
          padding: 10px 14px 10px 36px;
          border: 1.5px solid #e2e8f0;
          border-radius: 9px;
          font-family: inherit;
          font-size: 0.8rem;
          color: #1e293b;
          background: #fff;
          outline: none;
          direction: rtl;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .sv-input:focus {
          outline: none;
          border-color: #c1272d;
          box-shadow: inset 0 0 0 3px rgba(193, 39, 45, 0.06);
          background: #fff;
          color: #c1272d;
        }

        .sv-password-strength-label {
          font-size: 0.7rem;
          color: #c1272d;
          font-weight: 700;
        }

        .sv-checkbox-wrap {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.8rem;
          color: #c1272d;
        }

        .sv-submit-btn {
          padding: 12px;
          background: linear-gradient(135deg, #c1272d, #a91f24);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(193, 39, 45, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .sv-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(193, 39, 45, 0.4);
        }

        .sv-footer {
          text-align: center;
          padding: 20px 24px;
          border-top: 1px solid #f1f5f9;
          font-size: 0.875rem;
          color: #64748b;
        }

        .sv-login-link {
          color: #c1272d;
          text-decoration: none;
          font-weight: 700;
          cursor: pointer;
          transition: color 0.2s;
        }

        .sv-login-link:hover {
          color: #a91f24;
        }

        .sv-input::placeholder {
          color: #94a3b8;
        }

        .sv-icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
          font-size: 0.9rem;
        }

        .sv-password-toggle {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 3px;
          transition: color 0.2s;
        }

        .sv-password-toggle:hover {
          color: #3b82f6;
        }

        .sv-password-strength {
          margin-top: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.7rem;
        }

        .sv-strength-bar {
          flex: 1;
          height: 3px;
          background: #f1f5f9;
          border-radius: 2px;
          overflow: hidden;
        }

        .sv-strength-fill {
          height: 100%;
          transition: width 0.3s, background-color 0.3s;
        }

        .sv-error {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 10px 12px;
          background: #fee2e2;
          border: 1px solid #fca5a5;
          border-radius: 9px;
          font-size: 0.8rem;
          color: #dc2626;
        }

        .sv-error-icon {
          flex-shrink: 0;
          margin-top: 1px;
        }

        .sv-agreement {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.75rem;
          color: #64748b;
        }

        .sv-agreement input {
          cursor: pointer;
          width: 14px;
          height: 14px;
          border-radius: 3px;
          border: 1.5px solid #e2e8f0;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .sv-terms-link {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 600;
        }

        .sv-terms-link:hover {
          text-decoration: underline;
        }

        .sv-submit-btn {
          padding: 11px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: #fff;
          border: none;
          border-radius: 9px;
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 4px;
        }

        .sv-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }

        .sv-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .sv-footer {
          padding: 0 24px 20px;
          text-align: center;
          font-size: 0.8rem;
          color: #64748b;
          border-top: 1px solid #f1f5f9;
        }

        .sv-login-link {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 700;
          cursor: pointer;
          margin-left: 4px;
        }

        .sv-login-link:hover {
          color: #2563eb;
        }
      `}</style>

      <div className="sv-wrap">
        <div className="sv-container">
          <div className="sv-card">
            {/* Header */}
            <div className="sv-header">
              <div className="sv-logo">
                <img src="/elsewedy-logo.png" alt="Elsewedy Logo" />
              </div>
              <h1 className="sv-title">إنشاء حساب</h1>
              <p className="sv-subtitle">انضم إلى Elsewedy Financial Hub اليوم</p>
            </div>

            {/* Body */}
            <div className="sv-body">
              {error && (
                <div className="sv-error">
                  <AlertCircle size={16} className="sv-error-icon" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="sv-form">
                {/* Full Name */}
                <div className="sv-field">
                  <label className="sv-label">الاسم الكامل</label>
                  <div className="sv-input-wrap">
                    <User size={14} className="sv-icon" />
                    <input
                      type="text"
                      name="fullName"
                      className="sv-input"
                      placeholder="Mr. Sweilem"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="sv-field">
                  <label className="sv-label">البريد الإلكتروني</label>
                  <div className="sv-input-wrap">
                    <Mail size={14} className="sv-icon" />
                    <input
                      type="email"
                      name="email"
                      className="sv-input"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="sv-field">
                  <label className="sv-label">كلمة المرور</label>
                  <div className="sv-input-wrap">
                    <Lock size={14} className="sv-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className="sv-input"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="sv-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="sv-password-strength">
                      <div className="sv-strength-bar">
                        <div
                          className="sv-strength-fill"
                          style={{
                            width: `${(passwordStrength / 4) * 100}%`,
                            backgroundColor: getPasswordStrengthColor(),
                          }}
                        />
                      </div>
                      <span style={{ color: getPasswordStrengthColor() }}>
                        {getPasswordStrengthLabel()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="sv-field">
                  <label className="sv-label">تأكيد كلمة المرور</label>
                  <div className="sv-input-wrap">
                    <Lock size={14} className="sv-icon" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      className="sv-input"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="sv-password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Agreement */}
                <label className="sv-agreement">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <span>
                    أوافق على{' '}
                    <a href="#" className="sv-terms-link">الشروط والأحكام</a> و{' '}
                    <a href="#" className="sv-terms-link">سياسة الخصوصية</a>
                  </span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="sv-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      جاري إنشاء الحساب...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      إنشاء الحساب
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="sv-footer">
              لديك حساب بالفعل؟
              <span className="sv-login-link" onClick={onNavigateToLogin}>
                سجل دخولك
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
