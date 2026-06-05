import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>The Coastal Surf</h3>
          <p>Elite Travel Baseball Program</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/camp-registration">Camp Registration</a></li>
            <li><a href="/travel-ball">Travel Ball</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: info@coastalsurf.com</p>
          <p>Phone: (555) 123-4567</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {currentYear} The Coastal Surf. All rights reserved.</p>
      </div>
    </footer>
  )
}
