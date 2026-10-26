
import { useState } from 'react'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

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
        </nav>
      </div>
    </header>
  )
}

export default Header
