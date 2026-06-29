import { useEffect, useState } from 'react'
import { auth, db, hasRequiredConfig } from '../firebase'
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { collection, getDocs, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import './Registration.css'

export default function Admin() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [adminName, setAdminName] = useState('')
  const [accessCode, setAccessCode] = useState('')
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState('')
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(false)
  const [minAge, setMinAge] = useState('')
  const [maxAge, setMaxAge] = useState('')
  const [campQuery, setCampQuery] = useState('')
  const [campAge, setCampAge] = useState('')
  const [travelQuery, setTravelQuery] = useState('')
  const [travelAge, setTravelAge] = useState('')
  const [clinicQuery, setClinicQuery] = useState('')
  const [clinicAge, setClinicAge] = useState('')
  const ACCESS_CODE = 'Manny24'
  const PAGE_SIZE = 5
  const [campPage, setCampPage] = useState(0)
  const [travelPage, setTravelPage] = useState(0)
  const [clinicPage, setClinicPage] = useState(0)

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
              paymentStatus: data.paymentStatus || '',
              paymentAmount: data.paymentAmount ?? null,
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
          paymentStatus: data.paymentStatus || '',
          paymentAmount: data.paymentAmount ?? null,
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

    if (accessCode !== ACCESS_CODE) {
      setMessage('Invalid access code. Enter Manny24 to create an account.')
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      // If a name was provided, save it to the user's profile
      if (adminName && userCredential?.user) {
        try {
          await updateProfile(userCredential.user, { displayName: adminName })
        } catch (upErr) {
          console.error('Failed to update profile name', upErr)
        }
      }
      setMessage('Account created — you are now signed in.')
      setEmail('')
      setPassword('')
      setAdminName('')
      setAccessCode('')
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
      setAdminName('')
    } catch (err) {
      console.error(err)
      setMessage(err.message || 'Could not sign in.')
    }
  }

  const handlePasswordReset = async () => {
    setMessage('')
    if (!hasRequiredConfig || !auth) {
      setMessage('Firebase Auth is not configured. Add Firebase keys to .env and restart the app.')
      return
    }

    if (!email) {
      setMessage('Enter your email address to receive a reset link.')
      return
    }

    try {
      await sendPasswordResetEmail(auth, email)
      setMessage('Password reset email sent. Check your inbox.')
    } catch (err) {
      console.error(err)
      setMessage(err.message || 'Could not send password reset email.')
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

  const togglePaid = async (regId, currentStatus) => {
    const nextStatus = currentStatus === 'paid' ? 'unpaid' : 'paid'
    // Optimistic update
    setRegistrations((prev) => prev.map((r) => (r.id === regId ? { ...r, paymentStatus: nextStatus } : r)))

    if (!db) {
      setMessage('Database not configured.')
      return
    }

    try {
      await updateDoc(doc(db, 'campRegistrations', regId), { paymentStatus: nextStatus })
      setMessage('')
    } catch (err) {
      console.error('Failed to update payment status', err)
      setMessage('Could not update payment status.')
      // Revert on failure
      setRegistrations((prev) => prev.map((r) => (r.id === regId ? { ...r, paymentStatus: currentStatus } : r)))
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

  // Reset pages when filters/search change or when lists update
  useEffect(() => setCampPage(0), [campQuery, campAge, campRegs])
  useEffect(() => setTravelPage(0), [travelQuery, travelAge, travelRegs])
  useEffect(() => setClinicPage(0), [clinicQuery, clinicAge, clinicRegs])

  const renderCards = (items) => {
    if (!items || items.length === 0) return <div className="info-card">No registrations found.</div>

    return items.map((r) => (
      <div key={r.id} className="info-card" style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <strong>{r.firstName} {r.lastName}</strong>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{r.camp || '-'}</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem' }}>
              <input
                type="checkbox"
                checked={r.paymentStatus === 'paid'}
                onChange={() => togglePaid(r.id, r.paymentStatus)}
              />
              Paid
            </label>
          </div>
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
                {creating && (
                  <>
                    <div className="form-group">
                      <label>Name</label>
                      <input type="text" value={adminName} onChange={(e) => setAdminName(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Access Code</label>
                      <input
                        type="text"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        required
                        placeholder="Enter access code"
                      />
                    </div>
                  </>
                )}
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
                  {!creating && (
                    <button
                      type="button"
                      className="submit-button"
                      onClick={handlePasswordReset}
                    >
                      Forgot Password
                    </button>
                  )}
                  <button
                    type="button"
                    className="submit-button"
                    onClick={() => setCreating((c) => { const next = !c; if (!next) { setAdminName(''); setAccessCode('') }; return next })}
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
                    <div>
                      Signed in as <strong>{user.email}</strong>
                      {user.displayName && <span> — {user.displayName}</span>}
                    </div>
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
                    <button className="submit-button inline" onClick={() => { setMinAge(''); setMaxAge('') }}>Clear</button>
                  </div>

                  {loading && <p>Loading registrations...</p>}
                </div>

                <div style={{ flex: '2 1 600px' }}>
                  <h3 style={{ marginTop: 0 }}>Registered Players</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                    <div>
                        <h4 style={{ margin: '6px 0' }}>Camp Registrations</h4>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                          <input
                            placeholder="Search name"
                            value={campQuery}
                            onChange={(e) => setCampQuery(e.target.value)}
                            style={{ padding: '6px', flex: '1 1 160px' }}
                          />
                          <input
                            type="number"
                            placeholder="Age"
                            value={campAge}
                            onChange={(e) => setCampAge(e.target.value)}
                            style={{ width: '80px', padding: '6px' }}
                          />
                          <button className="submit-button inline" onClick={() => { setCampQuery(''); setCampAge('') }}>Clear</button>
                        </div>
                        {
                          (() => {
                            const list = campRegs.filter((r) => {
                              const q = campQuery.trim().toLowerCase()
                              const full = `${r.firstName} ${r.lastName}`.toLowerCase()
                              const nameMatch = !q || full.includes(q)
                              const ageMatch = !campAge || (typeof r.age === 'number' && r.age === Number(campAge))
                              return nameMatch && ageMatch
                            })
                            const total = list.length
                            const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
                            const start = campPage * PAGE_SIZE
                            const pageItems = list.slice(start, start + PAGE_SIZE)
                            return (
                              <div>
                                <div style={{ display: 'grid', gap: '12px' }}>{renderCards(pageItems)}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                  <div style={{ fontSize: '0.9rem', color: '#666' }}>Showing {Math.min(start+1, total)}-{Math.min(start+pageItems.length, total)} of {total}</div>
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <button className="submit-button inline" disabled={campPage === 0} onClick={() => setCampPage((p) => Math.max(0, p-1))}>Prev</button>
                                    <button className="submit-button inline" disabled={campPage >= pages-1} onClick={() => setCampPage((p) => Math.min(p+1, pages-1))}>Next</button>
                                  </div>
                                </div>
                              </div>
                            )
                          })()
                        }
                    </div>

                    <div>
                      <h4 style={{ margin: '6px 0' }}>Travel Ball Registrations</h4>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                        <input
                          placeholder="Search name"
                          value={travelQuery}
                          onChange={(e) => setTravelQuery(e.target.value)}
                          style={{ padding: '6px', flex: '1 1 160px' }}
                        />
                        <input
                          type="number"
                          placeholder="Age"
                          value={travelAge}
                          onChange={(e) => setTravelAge(e.target.value)}
                          style={{ width: '80px', padding: '6px' }}
                        />
                        <button className="submit-button inline" onClick={() => { setTravelQuery(''); setTravelAge('') }}>Clear</button>
                      </div>
                      {
                        (() => {
                          const list = travelRegs.filter((r) => {
                            const q = travelQuery.trim().toLowerCase()
                            const full = `${r.firstName} ${r.lastName}`.toLowerCase()
                            const nameMatch = !q || full.includes(q)
                            const ageMatch = !travelAge || (typeof r.age === 'number' && r.age === Number(travelAge))
                            return nameMatch && ageMatch
                          })
                          const total = list.length
                          const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
                          const start = travelPage * PAGE_SIZE
                          const pageItems = list.slice(start, start + PAGE_SIZE)
                          return (
                            <div>
                              <div style={{ display: 'grid', gap: '12px' }}>{renderCards(pageItems)}</div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>Showing {Math.min(start+1, total)}-{Math.min(start+pageItems.length, total)} of {total}</div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button className="submit-button inline" disabled={travelPage === 0} onClick={() => setTravelPage((p) => Math.max(0, p-1))}>Prev</button>
                                  <button className="submit-button inline" disabled={travelPage >= pages-1} onClick={() => setTravelPage((p) => Math.min(p+1, pages-1))}>Next</button>
                                </div>
                              </div>
                            </div>
                          )
                        })()
                      }
                    </div>

                    <div>
                      <h4 style={{ margin: '6px 0' }}>Clinic Registrations</h4>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                        <input
                          placeholder="Search name"
                          value={clinicQuery}
                          onChange={(e) => setClinicQuery(e.target.value)}
                          style={{ padding: '6px', flex: '1 1 160px' }}
                        />
                        <input
                          type="number"
                          placeholder="Age"
                          value={clinicAge}
                          onChange={(e) => setClinicAge(e.target.value)}
                          style={{ width: '80px', padding: '6px' }}
                        />
                        <button className="submit-button inline" onClick={() => { setClinicQuery(''); setClinicAge('') }}>Clear</button>
                      </div>
                      {
                        (() => {
                          const list = clinicRegs.filter((r) => {
                            const q = clinicQuery.trim().toLowerCase()
                            const full = `${r.firstName} ${r.lastName}`.toLowerCase()
                            const nameMatch = !q || full.includes(q)
                            const ageMatch = !clinicAge || (typeof r.age === 'number' && r.age === Number(clinicAge))
                            return nameMatch && ageMatch
                          })
                          const total = list.length
                          const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
                          const start = clinicPage * PAGE_SIZE
                          const pageItems = list.slice(start, start + PAGE_SIZE)
                          return (
                            <div>
                              <div style={{ display: 'grid', gap: '12px' }}>{renderCards(pageItems)}</div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>Showing {Math.min(start+1, total)}-{Math.min(start+pageItems.length, total)} of {total}</div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button className="submit-button inline" disabled={clinicPage === 0} onClick={() => setClinicPage((p) => Math.max(0, p-1))}>Prev</button>
                                  <button className="submit-button inline" disabled={clinicPage >= pages-1} onClick={() => setClinicPage((p) => Math.min(p+1, pages-1))}>Next</button>
                                </div>
                              </div>
                            </div>
                          )
                        })()
                      }
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
