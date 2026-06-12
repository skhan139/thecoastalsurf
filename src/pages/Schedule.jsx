import { useEffect, useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db, hasRequiredConfig } from '../firebase'
import './Registration.css'

const paymentsApiBaseUrl = import.meta.env.VITE_PAYMENTS_API_URL

const campOptions = [
  { value: 'travel-ball-2026', label: 'Travel Ball' },
  { value: 'summer-camp-2026', label: 'Summer Camp 2026' },
  { value: 'skills-clinic-2026', label: 'Skills Clinic 2026' },
]

const campPaymentPlans = [
  { value: 'deposit', label: 'Weekly Camp', amount: 200 },
  { value: 'full', label: 'All Session Participation', amount: 600 },
]

const travelBallPaymentPlans = [
  { value: 'tryout', label: 'Tryout Fee', amount: 0 },
  { value: 'seasonal', label: 'Seasonal Registration', amount: 0 },
]

const registrationConfig = {
  camp: {
    returnPath: '/camp-registration',
    preselectedCamp: 'summer-camp-2026',
  },
  travelBall: {
    returnPath: '/travel-ball-registration',
    preselectedCamp: 'travel-ball-2026',
  },
  clinic: {
    returnPath: '/clinic-registration',
    preselectedCamp: 'skills-clinic-2026',
  },
}

export default function Registration({ registrationType = 'camp' }) {
  const selectedRegistrationConfig = registrationConfig[registrationType] || registrationConfig.camp
  const [formData, setFormData] = useState({
    camp: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    position: '',
    experience: '',
    parentName: '',
    parentPhone: '',
    message: ''
  })
  const [calculatedAge, setCalculatedAge] = useState('')
  const [selectedPlan, setSelectedPlan] = useState(campPaymentPlans[0].value)

  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentBanner, setPaymentBanner] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    const paymentStatus = params.get('payment')
    const preselectedCampFromQuery = params.get('camp')
    const preselectedCamp = preselectedCampFromQuery || selectedRegistrationConfig.preselectedCamp

    if (preselectedCamp && campOptions.some((camp) => camp.value === preselectedCamp)) {
      setFormData((prev) => ({
        ...prev,
        camp: preselectedCamp,
      }))
    }

    if (paymentStatus === 'success') {
      setPaymentBanner('✅ Payment completed successfully. We received your registration and payment details.')
    } else if (paymentStatus === 'cancel') {
      setPaymentBanner('⚠️ Payment was canceled. You can submit the form again when ready.')
    }
  }, [selectedRegistrationConfig.preselectedCamp])

  const calculateAge = (dobString) => {
    if (!dobString) {
      setCalculatedAge('')
      return
    }

    const [month, day, year] = dobString.split('/').map(Number)
    if (!month || !day || !year) {
      setCalculatedAge('')
      return
    }

    const birthDate = new Date(year, month - 1, day)
    const today = new Date()

    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    if (age >= 0) {
      setCalculatedAge(age.toString())
    } else {
      setCalculatedAge('')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (name === 'dateOfBirth') {
      calculateAge(value)
    }

    if (name === 'camp') {
      const plans = value === 'travel-ball-2026' ? travelBallPaymentPlans : campPaymentPlans
      setSelectedPlan(plans[0].value)
    }
  }

  const resetForm = () => {
    setFormData({
      camp: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      position: '',
      experience: '',
      parentName: '',
      parentPhone: '',
      message: '',
    })
    setCalculatedAge('')
    setSelectedPlan(campPaymentPlans[0].value)
  }

  const isTravelBall = formData.camp === 'travel-ball-2026'
  const activePaymentPlans = isTravelBall ? travelBallPaymentPlans : campPaymentPlans
  const selectedPlanDetails = activePaymentPlans.find((plan) => plan.value === selectedPlan) ?? activePaymentPlans[0]
  const registrationImageSrc = formData.camp === 'travel-ball-2026' ? '/images/neworg.jpg' : '/images/flyer.jpg'
  const registrationImageAlt = formData.camp === 'travel-ball-2026' ? 'Travel Ball registration image' : 'Registration flyer'

  const getReturnUrl = (status) => {
    if (typeof window === 'undefined') return ''
    return `${window.location.origin}${selectedRegistrationConfig.returnPath}?payment=${status}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(false)
    setSubmitError('')

    if (!hasRequiredConfig || !db) {
      setSubmitError('Firebase is not configured yet. Add your Firebase keys to the .env file and restart the app.')
      return
    }

    if (!paymentsApiBaseUrl) {
      setSubmitError('Payments API is not configured. Add VITE_PAYMENTS_API_URL to .env and restart the app.')
      return
    }

    setIsSubmitting(true)

    try {
      const registrationRef = await addDoc(collection(db, 'campRegistrations'), {
        ...formData,
        paymentPlan: selectedPlan,
        paymentAmount: selectedPlanDetails?.amount ?? 0,
        paymentStatus: 'pending',
        age: calculatedAge ? Number(calculatedAge) : null,
        createdAt: serverTimestamp(),
        source: 'website',
      })

      console.log('Registration saved:', registrationRef.id)
      console.log('Calling payments API at:', `${paymentsApiBaseUrl}/create-checkout-session`)

      const checkoutController = new AbortController()
      const checkoutTimeoutId = window.setTimeout(() => {
        checkoutController.abort()
      }, 12000)

      let paymentResponse

      try {
        paymentResponse = await fetch(`${paymentsApiBaseUrl}/create-checkout-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: checkoutController.signal,
          body: JSON.stringify({
            registrationId: registrationRef.id,
            camp: formData.camp,
            athleteName: `${formData.firstName} ${formData.lastName}`,
            parentName: formData.parentName,
            parentEmail: formData.email,
            parentPhone: formData.parentPhone,
            paymentPlan: selectedPlan,
            amount: selectedPlanDetails?.amount ?? 0,
            successUrl: getReturnUrl('success'),
            cancelUrl: getReturnUrl('cancel'),
          }),
        })
      } finally {
        window.clearTimeout(checkoutTimeoutId)
      }

      console.log('Payment API response status:', paymentResponse.status)

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.text()
        console.error('Payment API error:', errorData)
        throw new Error('payment-session-failed')
      }

      const paymentData = await paymentResponse.json()
      console.log('Checkout URL received:', paymentData.checkoutUrl)

      if (!paymentData?.checkoutUrl) {
        console.error('No checkout URL in response:', paymentData)
        throw new Error('payment-session-invalid')
      }

      console.log('Redirecting to Stripe checkout...')
      window.location.assign(paymentData.checkoutUrl)

      setSubmitted(true)
      resetForm()
    } catch (error) {
      const errorCode = error?.code || error?.message
      const errorName = error?.name

      if (errorCode === 'permission-denied') {
        setSubmitError('Firebase is connected, but Firestore rules are blocking writes. Update rules to allow this form collection.')
      } else if (errorCode === 'unavailable' || errorCode === 'submission-timeout' || errorName === 'AbortError') {
        setSubmitError('Connection timed out. Please check your internet/firewall and try again.')
      } else if (errorName === 'TypeError') {
        setSubmitError('Could not reach the payments server. Start it with npm run payments:dev and confirm VITE_PAYMENTS_API_URL is correct.')
      } else if (errorCode === 'payment-session-failed' || errorCode === 'payment-session-invalid') {
        setSubmitError('Registration was saved, but we could not start secure card checkout. Please try again in a moment.')
      } else {
        setSubmitError('We could not submit your registration right now. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const positions = ['Pitcher', 'Catcher', 'Infielder', 'Outfielder', 'Utility']
  const experience = ['Beginner', 'Intermediate', 'Advanced', 'Elite']

  return (
    <div className="registration-page">
      <div className="page-header">
        <h1>Player Registration</h1>
        <p>Join The Coastal Surf Elite Travel Baseball Program</p>
      </div>

      <section className="registration-section">
        {paymentBanner && <div className="success-message payment-status-banner">{paymentBanner}</div>}

        <div className="registration-container">
          <div className="registration-info">
            <img src={registrationImageSrc} alt={registrationImageAlt} className="registration-flyer" />
            <div className="info-card">
              <div className="info-icon">⚾</div>
              <h3>Competitive Play</h3>
              <p>Compete against top teams in competitive tournaments and showcase your skills.</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🏆</div>
              <h3>Elite Coaching</h3>
              <p>Learn from experienced coaches dedicated to player development and success.</p>
            </div>
            <div className="info-card">
              <div className="info-icon">👥</div>
              <h3>Team Community</h3>
              <p>Build lasting friendships and brotherhood with talented athletes from the area.</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🎯</div>
              <h3>Development</h3>
              <p>Enhance your skills through personalized training and professional guidance.</p>
            </div>
          </div>

          <form className="registration-form" onSubmit={handleSubmit}>
            <h2>Register Now</h2>

            <div className="form-group">
              <label htmlFor="camp">Select Registration *</label>
              <select
                id="camp"
                name="camp"
                value={formData.camp || ''}
                onChange={handleChange}
                required
              >
                <option value="">Select registration type</option>
                {campOptions.map((camp) => (
                  <option key={camp.value} value={camp.value}>{camp.label}</option>
                ))}
              </select>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth (MM/DD/YYYY) *</label>
                <input
                  type="text"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  placeholder="MM/DD/YYYY"
                  value={formData.dateOfBirth || ''}
                  onChange={handleChange}
                  required
                />
                {calculatedAge && <p className="calculated-age">Age: {calculatedAge}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="position">Primary Position *</label>
                <select
                  id="position"
                  name="position"
                  value={formData.position || ''}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a position</option>
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="experience">Experience Level *</label>
              <select
                id="experience"
                name="experience"
                value={formData.experience || ''}
                onChange={handleChange}
                required
              >
                <option value="">Select experience level</option>
                {experience.map(exp => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </div>

            <div className="form-divider">
              <h3>Parent/Guardian Information</h3>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="parentName">Parent/Guardian Name *</label>
                <input
                  type="text"
                  id="parentName"
                  name="parentName"
                  value={formData.parentName || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="parentPhone">Parent/Guardian Phone *</label>
                <input
                  type="tel"
                  id="parentPhone"
                  name="parentPhone"
                  value={formData.parentPhone || ''}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Additional Information</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                placeholder="Tell us about your baseball goals and aspirations..."
                value={formData.message || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form-divider">
              <h3>Payment</h3>
            </div>

            <div className="payment-plan-grid" role="radiogroup" aria-label="Payment options">
              {activePaymentPlans.map((plan) => (
                <label key={plan.value} className={`payment-plan-card ${selectedPlan === plan.value ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentPlan"
                    value={plan.value}
                    checked={selectedPlan === plan.value}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                  />
                  <span className="payment-plan-label">{plan.label}</span>
                  <span className="payment-plan-amount">${plan.amount}</span>
                </label>
              ))}
            </div>

            <p className="payment-disclaimer">
              After clicking below, you will be redirected to secure card checkout to complete payment.
            </p>

            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Preparing Secure Checkout...' : 'Continue to Card Payment'}
            </button>
            
            {submitted && (
              <div className="success-message">
                ✓ Registration received! Redirecting to secure card checkout...
              </div>
            )}

            {submitError && <div className="error-message">{submitError}</div>}
          </form>
        </div>
      </section>
    </div>
  )
}
