import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-layout">
          <div className="hero-image-wrap">
            <img src="/images/neworg.jpg" alt="The Coastal Surf organization" className="hero-image" />
            <div className="hero-image-actions">
              <a
                href="/images/neworg.jpg"
                download="coastal-surf-organization.jpg"
                className="download-image-button"
              >
                Download Image
              </a>
            </div>
          </div>
          <div className="hero-content">
            <div className="hero-title-images" aria-hidden="true">
              <img src="/images/softball.jpg" alt="" className="hero-title-image" />
                <img src="/images/baseball.jpg" alt="" className="hero-title-image" />
            </div>
            <h1>Coastal Surf Baseball</h1>
            <p className="tagline">Elite Travel Baseball Program</p>
            <p className="hero-description">
              Developing exceptional young athletes through competitive baseball,
              character building, and championship-level training.
            </p>
            <Link to="/travel-ball" className="cta-button">Join Our Program</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Championship Program</h3>
            <p>Competing at the highest levels of travel baseball with consistent tournament success.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👨‍🏫</div>
            <h3>Expert Coaching</h3>
            <p>Trained professionals dedicated to developing player skills and game intelligence.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Player Development</h3>
            <p>Individualized training programs focused on technical and mental growth.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Team Culture</h3>
            <p>Building strong bonds through teamwork, respect, and shared goals.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Make a Splash?</h2>
        <p>Take the next step in your baseball journey with The Coastal Surf</p>
        <Link to="/contact" className="cta-button secondary">Contact Us Today</Link>
      </section>
    </div>
  )
}
