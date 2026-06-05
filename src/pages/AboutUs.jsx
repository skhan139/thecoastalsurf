import './AboutUs.css'

export default function AboutUs() {
  return (
    <div className="about-page">
      <div className="page-header">
        <h1>About Us</h1>
        <p>The Story Behind The Coastal Surf</p>
      </div>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="mission-content">
          <div className="mission-text">
            <h2>Our Mission</h2>
            <p>
              The Coastal Surf is dedicated to developing exceptional young baseball players through competitive play, professional coaching, and character-building experiences. We believe in nurturing not just athletes, but future leaders who embody integrity, teamwork, and excellence.
            </p>
            <p>
              Our program combines elite-level competition with personalized player development, ensuring every athlete reaches their full potential both on and off the field.
            </p>
          </div>
          <div className="mission-highlight">
            <div className="highlight-box">
              <h3>Founded</h3>
              <p>2026</p>
            </div>
            <div className="highlight-box">
              <h3>Teams</h3>
              <p>TBD</p>
            </div>
            <div className="highlight-box">
              <h3>Coaching Experience</h3>
              <p>Collegiate - Professional</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <h2>Our Core Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">🏆</div>
            <h3>Excellence</h3>
            <p>We pursue excellence in everything we do, from coaching to player development to organizational standards.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🤝</div>
            <h3>Integrity</h3>
            <p>We conduct ourselves with honesty, respect, and ethical behavior in all interactions and decisions.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🎯</div>
            <h3>Development</h3>
            <p>We focus on continuous improvement and growth for our players, coaches, and organization.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">❤️</div>
            <h3>Community</h3>
            <p>We build strong relationships and foster a supportive environment where everyone feels valued.</p>
          </div>
        </div>
      </section>

      {/* Coaching Staff */}
      <section className="staff-section">
        <h2>Our Leadership</h2>
        <div className="staff-grid">
          <div className="staff-card">
            <div className="staff-avatar">👨‍💼</div>
            <h3>Wayne Brown</h3>
            <p className="staff-title">Program Director</p>
            <p className="staff-bio">20+ years of professional baseball experience and youth coaching expertise.</p>
          </div>
          <div className="staff-card">
            <div className="staff-avatar">👨‍🏫</div>
            <h3>Mike Edge</h3>
            <p className="staff-title">Player Development Coach</p>
            <p className="staff-bio">Coach Edge has extensive experience in developing young athletes and helping them reach their full potential. A 1997 Draft Pick by the Montreal Expos, he brings a wealth of knowledge and firsthand experience to his coaching role.</p>
          </div>
          <div className="staff-card">
            <div className="staff-avatar">👨‍🏫</div>
            <h3>Craig Rotruck</h3>
            <p className="staff-title">Performance </p>
            <p className="staff-bio">Specializes in offensive strategy and individual player optimization.</p>
          </div>
          <div className="staff-card">
            <div className="staff-avatar">👨‍💼</div>
            <h3>Todd Robinson</h3>
            <p className="staff-title">Pitching Coach</p>
            <p className="staff-bio">With Over 34 years of experience and seven high school state titles, Todd has helped elevate numerous athletes to the collegiate and professional level. </p>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="achievements-section">
        <h2>Our Achievements</h2>
        <div className="achievements-grid">
          <div className="achievement-card">
            <div className="achievement-number">15+</div>
            <p>National Tournament Championships</p>
          </div>
          <div className="achievement-card">
            <div className="achievement-number">150+</div>
            <p>Players Committed to College</p>
          </div>
          <div className="achievement-card">
            <div className="achievement-number">50+</div>
            <p>Professional Scouts Network</p>
          </div>
          <div className="achievement-card">
            <div className="achievement-number">98%</div>
            <p>Player Satisfaction Rating</p>
          </div>
        </div>
      </section>
    </div>
  )
}
