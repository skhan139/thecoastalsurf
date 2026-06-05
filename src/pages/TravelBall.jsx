import './TravelBall.css'

export default function TravelBall() {
  return (
    <div className="travel-ball-page">
      <div className="page-header">
        <h1>Travel Ball Program</h1>
        <p>Compete at the highest levels of youth baseball</p>
      </div>

      {/* Teams Section */}
      <section className="travel-section">
        <h2>Coming Soon!</h2>
        <p className="coming-soon-text">Our teams will be announced soon.</p>
      </section>

      {/* Tournaments Section */}
      <section className="travel-section">
        <h2>Coming Soon!</h2>
        <p className="coming-soon-text">The travel ball schedule will be posted soon.</p>
      </section>

      {/* Info Section */}
      <section className="travel-info">
        <div className="info-container">
          <div className="info-box">
            <h3>Why Choose Travel Ball?</h3>
            <ul>
              <li>Exposure to college scouts</li>
              <li>High-level competition</li>
              <li>Player skill advancement</li>
              <li>National tournament opportunities</li>
            </ul>
          </div>
          <div className="info-box">
            <h3>What We Offer</h3>
            <ul>
              <li>Expert coaching staff</li>
              <li>Multiple team levels</li>
              <li>Tournament travel logistics</li>
              <li>Year-round training programs</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
