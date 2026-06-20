import { useEffect, useState } from 'react'
import { auth, db, hasRequiredConfig } from '../firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { collection, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore'
import './Registration.css'

export default function Admin() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState('')
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(false)
  const [minAge, setMinAge] = useState('')
  const [maxAge, setMaxAge] = useState('')

  useEffect(() => {
    if (!auth) return
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      if (u) {
        console.log('Admin signed in:', { uid: u.uid, email: u.email })
      } else {
        console.log('Admin signed out')
      }
    })
    return unsub
  }, [])

  useEffect(() => {
    // Only attach realtime listener when a signed-in admin user
    // exists and Firestore is configured. This avoids permission
    // errors for unauthenticated visitors.
    if (!user) return
    if (!hasRequiredConfig || !db) return

    setLoading(true)
    const q = query(collection(db, 'campRegistrations'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((doc) => {
          const data = doc.data() || {}

          // Normalize createdAt to an ISO string whether it's a
          // Firestore Timestamp, a server-generated object, or
          // already a string.
          const rawCreated = data.createdAt
          let createdAtISO = ''
          if (rawCreated) {
            if (typeof rawCreated.toDate === 'function') {
              createdAtISO = rawCreated.toDate().toISOString()
            } else if (typeof rawCreated.toMillis === 'function') {
              createdAtISO = new Date(rawCreated.toMillis()).toISOString()
            } else if (typeof rawCreated === 'string') {
              createdAtISO = rawCreated
            }
          }

          return {
            id: doc.id,
            camp: data.camp || '',
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
            dateOfBirth: data.dateOfBirth || '',
            position: data.position || '',
            experience: data.experience || '',
            parentName: data.parentName || '',
            parentPhone: data.parentPhone || '',
            message: data.message || '',
            age: data.age ?? null,
            paymentPlan: data.paymentPlan || '',
            createdAt: createdAtISO,
          }
        })
        setRegistrations(items)
        setLoading(false)
      },
      (err) => {
        console.error('Realtime listener error', err)
        setMessage('Could not load registrations.')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  const fetchRegistrations = async () => {
    if (!hasRequiredConfig || !db) {
      setMessage('Firebase is not configured.')
      return
    }

    setLoading(true)
    try {
      const q = query(collection(db, 'campRegistrations'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      const items = snap.docs.map((doc) => {
        const data = doc.data() || {}

        const rawCreated = data.createdAt
        let createdAtISO = ''
        if (rawCreated) {
          if (typeof rawCreated.toDate === 'function') {
            createdAtISO = rawCreated.toDate().toISOString()
          } else if (typeof rawCreated.toMillis === 'function') {
            createdAtISO = new Date(rawCreated.toMillis()).toISOString()
          } else if (typeof rawCreated === 'string') {
            createdAtISO = rawCreated
          }
        }

        return {
          id: doc.id,
          camp: data.camp || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          dateOfBirth: data.dateOfBirth || '',
          position: data.position || '',
          experience: data.experience || '',
          parentName: data.parentName || '',
          parentPhone: data.parentPhone || '',
          message: data.message || '',
          age: data.age ?? null,
          paymentPlan: data.paymentPlan || '',
          createdAt: createdAtISO,
        }
      })
      setRegistrations(items)
      setMessage('')
    } catch (err) {
      console.error(err)
      setMessage('Could not load registrations.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setMessage('')
    if (!hasRequiredConfig || !auth) {
      setMessage('Firebase Auth is not configured. Add Firebase keys to .env and restart the app.')
      return
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      setMessage('Account created — you are now signed in.')
      setEmail('')
      setPassword('')
    } catch (err) {
      console.error(err)
      setMessage(err.message || 'Could not create account.')
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage('')
    if (!hasRequiredConfig || !auth) {
      setMessage('Firebase Auth is not configured. Add Firebase keys to .env and restart the app.')
      return
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
      setMessage('Signed in.')
      setEmail('')
      setPassword('')
    } catch (err) {
      console.error(err)
      setMessage(err.message || 'Could not sign in.')
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setMessage('Signed out.')
      setRegistrations([])
    } catch (err) {
      console.error(err)
      setMessage('Could not sign out.')
    }
  }

  const filtered = registrations.filter((r) => {
    const age = typeof r.age === 'number' ? r.age : null
    if (minAge && (!age || age < Number(minAge))) return false
    if (maxAge && (!age || age > Number(maxAge))) return false
    return true
  })

  const CAMP_ID = 'summer-camp-2026'
  const TRAVEL_ID = 'travel-ball-2026'
  const CLINIC_ID = 'skills-clinic-2026'

  const campRegs = filtered.filter((r) => r.camp === CAMP_ID)
  const travelRegs = filtered.filter((r) => r.camp === TRAVEL_ID)
  const clinicRegs = filtered.filter((r) => r.camp === CLINIC_ID)

  const renderCards = (items) => {
    if (!items || items.length === 0) return <div className="info-card">No registrations found.</div>

    return items.map((r) => (
      <div key={r.id} className="info-card" style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <strong>{r.firstName} {r.lastName}</strong>
          <span>{r.camp || '-'}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <div><strong>Email:</strong> {r.email || '-'}</div>
          <div><strong>Phone:</strong> {r.phone || '-'}</div>
          <div><strong>DOB:</strong> {r.dateOfBirth || '-'}</div>
          <div><strong>Age:</strong> {r.age ?? '-'}</div>
          <div><strong>Position:</strong> {r.position || '-'}</div>
          <div><strong>Experience:</strong> {r.experience || '-'}</div>
          <div><strong>Parent:</strong> {r.parentName || '-'}</div>
          <div><strong>Parent Phone:</strong> {r.parentPhone || '-'}</div>
          <div style={{ gridColumn: '1 / -1' }}><strong>Additional Info:</strong> {r.message || '-'}</div>
          <div style={{ gridColumn: '1 / -1', marginTop: '6px', fontSize: '0.9em', color: '#666' }}>
            <strong>Plan:</strong> {r.paymentPlan || '-'} &nbsp; • &nbsp; <strong>Registered:</strong> {r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}
          </div>
        </div>
      </div>
    ))
  }

  return (
    <div className="registration-page">
      <div className="page-header">
        <h1>Admin — Registrations</h1>
        <p>Manage player registrations (requires admin sign-in).</p>
      </div>

      <section className="registration-section">
        <div className="registration-container">
          {!user && (
            <div className="auth-card">
              <h2>{creating ? 'Create Admin Account' : 'Admin Sign In'}</h2>
              <form onSubmit={creating ? handleCreate : handleLogin}>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="form-row">
                  <button type="submit" className="submit-button">
                    {creating ? 'Create Account' : 'Sign In'}
                  </button>
                  <button
                    type="button"
                    className="submit-button"
                    onClick={() => setCreating((c) => !c)}
                  >
                    {creating ? 'Switch to Sign In' : 'Create Account'}
                  </button>
                </div>
              </form>
              {message && <div className="error-message">{message}</div>}
            </div>
          )}

          {user && (
            <div>
              <div style={{ display: 'flex', gap: '24px' }}>
                <div style={{ flex: '1 1 320px' }}>
                  <div className="form-row" style={{ alignItems: 'center', marginBottom: '1rem' }}>
                    <div>Signed in as <strong>{user.email}</strong></div>
                  </div>

                  <div className="form-row" style={{ gap: '8px', marginBottom: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Min age:
                      <input type="number" min="0" value={minAge} onChange={(e) => setMinAge(e.target.value)} />
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Max age:
                      <input type="number" min="0" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} />
                    </label>
                    <button className="submit-button" onClick={() => { setMinAge(''); setMaxAge('') }}>Clear</button>
                  </div>

                  {loading && <p>Loading registrations...</p>}
                </div>

                <div style={{ flex: '2 1 600px' }}>
                  <h3 style={{ marginTop: 0 }}>Registered Players</h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div>
                      <h4 style={{ margin: '6px 0' }}>Camp Registrations</h4>
                      <div style={{ display: 'grid', gap: '12px' }}>{renderCards(campRegs)}</div>
                    </div>

                    <div>
                      <h4 style={{ margin: '6px 0' }}>Travel Ball Registrations</h4>
                      <div style={{ display: 'grid', gap: '12px' }}>{renderCards(travelRegs)}</div>
                    </div>

                    <div>
                      <h4 style={{ margin: '6px 0' }}>Clinic Registrations</h4>
                      <div style={{ display: 'grid', gap: '12px' }}>{renderCards(clinicRegs)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button className="submit-button" onClick={fetchRegistrations}>Refresh</button>
                <button className="submit-button" onClick={handleLogout}>Sign Out</button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
