import { useState } from 'react'
import { apiRequest } from '../api'

function Header({ user, onSessionChange }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [authMode, setAuthMode] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  async function submitAuth(event) {
    event.preventDefault()
    setAuthError('')
    setSubmitting(true)

    try {
      const { user: signedInUser } = await apiRequest(
        `/api/auth/${authMode}`,
        {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        },
      )
      onSessionChange(signedInUser)
      setAuthMode(null)
      setEmail('')
      setPassword('')
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function signOut() {
    setAuthError('')
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' })
      onSessionChange(null)
    } catch (error) {
      setAuthError(error.message)
    }
  }

  function openAuth(mode) {
    setAuthError('')
    setAuthMode(mode)
    closeMenu()
  }

  return (
    <header id="home" className="site-header">
      <div className="header-inner mx-auto flex w-full max-w-[75rem] flex-wrap items-center justify-between gap-x-6 px-5 py-5 sm:flex-nowrap sm:px-8 lg:px-10">
        <a
          href="#home"
          className="logo shrink-0"
          aria-label="Cait home"
          onClick={closeMenu}
        >
          Cait<span>Restaurant</span>
        </a>

        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-[var(--color-border)] bg-transparent text-[var(--color-heading)] sm:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="size-6"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="size-6"
              aria-hidden="true"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>

        <nav
          id="main-navigation"
          aria-label="Main navigation"
          className={`${menuOpen ? 'flex' : 'hidden'} w-full flex-col items-stretch gap-3 pt-4 sm:flex sm:w-auto sm:flex-row sm:items-center sm:gap-8 sm:pt-0`}
        >
          <ul className="nav-list flex flex-col items-stretch gap-1 sm:flex-row sm:items-center sm:gap-8">
            <li>
              <a href="#menu" onClick={closeMenu}>Menu</a>
            </li>
            <li>
              <a href="#about" onClick={closeMenu}>Our Story</a>
            </li>
          </ul>

          <a
            href="#reservations"
            className="button"
            onClick={closeMenu}
          >
            Reserve a Table
          </a>

          {user ? (
            <div className="account-controls">
              <span className="account-email">{user.email}</span>
              <button type="button" className="account-action" onClick={signOut}>
                Sign out
              </button>
            </div>
          ) : (
            <div className="account-controls">
              <button
                type="button"
                className="account-action"
                onClick={() => openAuth('login')}
              >
                Sign in
              </button>
              <button
                type="button"
                className="account-action"
                onClick={() => openAuth('signup')}
              >
                Sign up
              </button>
            </div>
          )}
        </nav>
      </div>

      {authMode && (
        <div className="auth-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setAuthMode(null)
        }}>
          <section
            className="auth-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
          >
            <button
              type="button"
              className="auth-close"
              aria-label="Close sign-in dialog"
              onClick={() => setAuthMode(null)}
            >
              ×
            </button>
            <p className="menu-eyebrow">Cait Restaurant</p>
            <h2 id="auth-title">
              {authMode === 'signup' ? 'Create your account' : 'Welcome back'}
            </h2>
            <form className="auth-form" onSubmit={submitAuth}>
              <label htmlFor="auth-email">Email address</label>
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
                minLength={authMode === 'signup' ? 8 : undefined}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              {authError && <p className="auth-error" role="alert">{authError}</p>}
              <button
                className="button button-primary"
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? 'Please wait...'
                  : authMode === 'signup'
                    ? 'Create account'
                    : 'Sign in'}
              </button>
            </form>
            <p className="auth-switch">
              {authMode === 'signup' ? 'Already have an account?' : 'New to Cait?'}{' '}
              <button
                type="button"
                onClick={() => openAuth(authMode === 'signup' ? 'login' : 'signup')}
              >
                {authMode === 'signup' ? 'Sign in' : 'Create an account'}
              </button>
            </p>
          </section>
        </div>
      )}
      {authError && !authMode && <p className="auth-toast" role="alert">{authError}</p>}
    </header>
  )
}

export default Header
