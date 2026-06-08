import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import Home from './pages/Home'
import TravelBall from './pages/TravelBall'
import CampRegistration from './pages/CampRegistration'
import TravelBallRegistration from './pages/TravelBallRegistration'
import ClinicRegistration from './pages/ClinicRegistration'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/camp-registration" element={<CampRegistration />} />
            <Route path="/travel-ball-registration" element={<TravelBallRegistration />} />
            <Route path="/clinic-registration" element={<ClinicRegistration />} />
            <Route path="/travel-ball" element={<TravelBall />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
