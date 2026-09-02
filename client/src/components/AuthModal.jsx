import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  X,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Zap
} from 'lucide-react';

export function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  onRegisterSuccess,
  initialMode = 'login'
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (mode === 'login') {
      // Login flow
      const user = {
        name: name.trim() || email.split('@')[0],
        email: email.trim(),
        role: role || 'Student',
        avatar: (name.trim() || email.split('@')[0]).slice(0, 2).toUpperCase()
      };
      onLoginSuccess(user);
    } else {
      // Register flow
      const user = {
        name: name.trim(),
        email: email.trim(),
        role,
        avatar: name.trim().slice(0, 2).toUpperCase()
      };
      onRegisterSuccess(user);
    }

    onClose();
  };

  const handleQuickDemoLogin = () => {
    const demoUser = {
      name: 'Pragya',
      email: 'pragya@studyai.edu',
      role: 'Student',
      avatar: 'PG'
    };
    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div className="auth-modal-backdrop" onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="auth-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        {/* Modal Brand Header */}
        <div className="auth-header">
          <div className="auth-brand-gem">
            <Sparkles size={20} />
          </div>
          <h2 className="auth-title">
            {mode === 'login' ? 'Welcome back to StudyAI' : 'Create your StudyAI account'}
          </h2>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Sign in to access your study decks, streak, and quiz analytics.'
              : 'Join thousands of students learning smarter with structured AI.'}
          </p>
        </div>

        {/* Auth Mode Tabs */}
        <div className="auth-tabs-row">
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login');
              setErrorMessage('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => {
              setMode('register');
              setErrorMessage('');
            }}
          >
            Create Account
          </button>
        </div>

        {/* Quick Demo Login Preset Button */}
        <div className="quick-demo-login-box">
          <button
            type="button"
            className="btn-quick-demo"
            onClick={handleQuickDemoLogin}
          >
            <Zap size={15} />
            <span>1-Click Demo Login as <strong>Pragya (Student)</strong></span>
          </button>
        </div>

        <div className="auth-divider">
          <span>or continue with email</span>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="auth-error-alert">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Name Field (Register Mode Only) */}
          {mode === 'register' && (
            <div className="auth-field-group">
              <label className="auth-label">Full Name</label>
              <div className="auth-input-wrap">
                <User size={16} className="auth-input-icon" />
                <input
                  type="text"
                  className="auth-input"
                  placeholder="e.g. Pragya Gupta"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus={mode === 'register'}
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="auth-field-group">
            <label className="auth-label">Email Address</label>
            <div className="auth-input-wrap">
              <Mail size={16} className="auth-input-icon" />
              <input
                type="email"
                className="auth-input"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus={mode === 'login'}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="auth-field-group">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <Lock size={16} className="auth-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Role Selection (Register Mode Only) */}
          {mode === 'register' && (
            <div className="auth-field-group">
              <label className="auth-label">Study Role</label>
              <div className="role-pills-grid">
                {['Student', 'Engineering', 'Medical', 'Self-Learner'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`role-pill-btn ${role === r ? 'active' : ''}`}
                    onClick={() => setRole(r)}
                  >
                    <GraduationCap size={13} />
                    <span>{r}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="btn-auth-submit">
            <span>{mode === 'login' ? 'Sign In to StudyAI' : 'Create Free Account'}</span>
            <ArrowRight size={17} />
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="auth-footer-prompt">
          {mode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                className="auth-switch-link"
                onClick={() => {
                  setMode('register');
                  setErrorMessage('');
                }}
              >
                Create Account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                className="auth-switch-link"
                onClick={() => {
                  setMode('login');
                  setErrorMessage('');
                }}
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
