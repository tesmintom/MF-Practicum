import { useEffect, useState } from 'react'
import { apiRequest } from './api'
import Header from './components/Header'
import Hero from './components/Hero'
import FoodMenu from './components/FoodMenu'
import OurStory from './components/OurStory'
import Reservation from './components/Reservation'
import Footer from './components/Footer'
import './index.css'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    let active = true
    apiRequest('/api/auth/session')
      .then(({ user: sessionUser }) => {
        if (active) setUser(sessionUser)
      })
      .catch((error) => {
        console.error('Could not load the current session:', error)
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <>
      <Header user={user} onSessionChange={setUser} />
        <main>
          <Hero />
          <FoodMenu />
          <OurStory />
          <Reservation />
        </main>
      <Footer />
    </>
  )
}

export default App
