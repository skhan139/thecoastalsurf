import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './Home.css'

const imageSlides = [
  { src: '/images/neworg.jpg', alt: 'The Coastal Surf organization photo 1', fileName: 'neworg.jpg' },
  { src: '/images/neworg2.jpg', alt: 'The Coastal Surf organization photo 2', fileName: 'neworg2.jpg' },
  { src: '/images/neworg3.jpg', alt: 'The Coastal Surf organization photo 3', fileName: 'neworg3.jpg' },
]

export default function Home() {
  const [showWave, setShowWave] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    try {
      const seen = window.localStorage.getItem('coastal_seen_wave')
      if (!seen) {
        setShowWave(true)
        // mark seen so animation only plays once per browser
        window.localStorage.setItem('coastal_seen_wave', '1')
      }
    } catch (e) {
      // localStorage may be unavailable; still show wave
      setShowWave(true)
    }
    try {
      const introSeen = window.localStorage.getItem('coastal_seen_intro')
      if (!introSeen) {
        setShowIntro(true)
        window.localStorage.setItem('coastal_seen_intro', '1')
      }
    } catch (e) {
      setShowIntro(true)
    }
  }, [])

  return (
    <div className={`home ${showIntro ? 'home-intro' : ''}`}>
      {/* Hero Section */}
      <section className="hero">
        {showWave && (
          <div className="hero-wave" aria-hidden="true">
            <svg viewBox="0 0 1440 220" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path className="wave-path" d="M0,160 C120,200 300,120 480,140 C660,160 840,220 1020,200 C1200,180 1320,120 1440,140 L1440 220 L0 220 Z" fill="rgba(255,255,255,0.12)" />
              <path className="wave-path soft" d="M0,180 C140,140 320,200 480,180 C640,160 840,120 1000,140 C1160,160 1320,200 1440,180 L1440 220 L0 220 Z" fill="rgba(255,255,255,0.06)" />
            </svg>
          </div>
        )}
        <div className="hero-layout">
          <div className="hero-image-wrap">
            <img src={imageSlides[currentSlide].src} alt={imageSlides[currentSlide].alt} className="hero-image" />
            <div className="hero-image-actions">
              <button
                type="button"
                className="slider-button"
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? imageSlides.length - 1 : prev - 1))}
              >
                Previous
              </button>
              <span className="slider-indicator">
                {currentSlide + 1} / {imageSlides.length}
              </span>
              <button
                type="button"
                className="slider-button"
                onClick={() => setCurrentSlide((prev) => (prev === imageSlides.length - 1 ? 0 : prev + 1))}
              >
                Next
              </button>
            </div>
            <div className="hero-image-actions">
              <a
                href={imageSlides[currentSlide].src}
                download={imageSlides[currentSlide].fileName}
                className="download-image-button"
              >
                Download Image
              </a>
              <p className="contact-info-text">Please contact Wayne Brown at 843-295-0010 or Rusty Magill at 252-489-5172 for questions or more information.</p>
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
