import './Team.css'

export default function Team() {
  const players = [
    { id: 1, name: 'Player Name', position: 'Pitcher', number: 12 },
    { id: 2, name: 'Player Name', position: 'Catcher', number: 5 },
    { id: 3, name: 'Player Name', position: 'Infielder', number: 23 },
    { id: 4, name: 'Player Name', position: 'Outfielder', number: 7 },
  ]

  const coaches = [
    { id: 1, name: 'Head Coach', title: 'Manager' },
    { id: 2, name: 'Pitching Coach', title: 'Specialist' },
    { id: 3, name: 'Hitting Coach', title: 'Specialist' },
  ]

  return (
    <div className="team-page">
      <div className="page-header">
        <h1>Our Team</h1>
        <p>Meet the talented athletes and coaches of The Coastal Surf</p>
      </div>

      {/* Coaches Section */}
      <section className="team-section">
        <h2>Coaching Staff</h2>
        <div className="coaches-grid">
          {coaches.map(coach => (
            <div key={coach.id} className="coach-card">
              <div className="coach-avatar">👨‍💼</div>
              <h3>{coach.name}</h3>
              <p className="coach-title">{coach.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Players Section */}
      <section className="team-section">
        <h2>Roster</h2>
        <div className="players-grid">
          {players.map(player => (
            <div key={player.id} className="player-card">
              <div className="player-number">{player.number}</div>
              <div className="player-avatar">⚾</div>
              <h3>{player.name}</h3>
              <p className="player-position">{player.position}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
