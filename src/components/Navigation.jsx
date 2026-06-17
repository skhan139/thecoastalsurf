import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navigation.css'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEventMenuOpen, setIsEventMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const toggleEventMenu = () => {
    setIsEventMenuOpen((prev) => !prev)
  }

  const openEventMenu = () => {
    setIsEventMenuOpen(true)
  }

  const closeEventMenu = () => {
    setIsEventMenuOpen(false)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    setIsEventMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <img className="logo-icon" src="/images/baseball.jpg" alt="Baseball" />
          <span className="logo-text">Coastal Surf Baseball</span>
        </Link>

        <button
          type="button"
          className={`hamburger ${isMenuOpen ? 'open' : ''}`}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          onClick={toggleMenu}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>

        <div id="primary-navigation" className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
          <Link to="/travel-ball" className="nav-link" onClick={closeMenu}>Travel Ball</Link>
          <div
            className={`nav-dropdown ${isEventMenuOpen ? 'open' : ''}`}
            onMouseEnter={openEventMenu}
            onMouseLeave={closeEventMenu}
          >
            <button
              type="button"
              className="nav-link nav-dropdown-trigger"
              aria-haspopup="true"
              aria-expanded={isEventMenuOpen}
              onClick={toggleEventMenu}
            >
              Select Event
              <span className={`dropdown-caret ${isEventMenuOpen ? 'open' : ''}`}>▾</span>
            </button>

            <div className="dropdown-menu">
              <Link to="/travel-ball-registration" className="dropdown-link" onClick={closeMenu}>Travel Ball Registration</Link>
              <Link to="/camp-registration" className="dropdown-link" onClick={closeMenu}>Camp Registration</Link>
              <Link to="/clinic-registration" className="dropdown-link" onClick={closeMenu}>Clinic Registration</Link>
            </div>
          </div>
          <Link to="/about" className="nav-link" onClick={closeMenu}>About Us</Link>
          <Link to="/contact" className="nav-link" onClick={closeMenu}>Contact</Link>
          <Link to="/admin" className="nav-link" onClick={closeMenu}>Admin</Link>
        </div>
      </div>
    </nav>
  )
}
