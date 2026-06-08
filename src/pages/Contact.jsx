import { useState } from 'react'
import './Contact.css'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, you'd send this data to a server
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className="contact-page">
      <div className="page-header">
        <h1>Contact Us</h1>
        <p>Get in touch with The Coastal Surf</p>
      </div>

      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">📧</div>
              <h3>Email</h3>
              <p><a href="mailto:info@coastalsurfbaseball.com">info@coastalsurfbaseball.com</a></p>
            </div>
            <div className="info-card">
              <div className="info-icon">📱</div>
              <h3>Phone</h3>
              <p><a href="tel:+8432950010">(843) 295-0010</a></p>
            </div>
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3>Address</h3>
              <p>209 Horsetail Moss CT<br />Myrtle Beach, SC 29588</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🕐</div>
              <h3>Hours</h3>
              <p>Mon-Fri: 9:00 AM - 6:00 PM<br />Sat-Sun: 10:00 AM - 4:00 PM</p>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <h2>Send us a Message</h2>
            
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-button">Send Message</button>
            
            {submitted && (
              <div className="success-message">
                ✓ Message sent successfully! We'll get back to you soon.
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  )
}
