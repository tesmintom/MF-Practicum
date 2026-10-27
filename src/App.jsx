import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import FoodMenu from './components/FoodMenu'
import OurStory from './components/OurStory'
import Reservation from './components/Reservation'
import Footer from './components/Footer'
import './index.css'

function App() {
  return (
    <>
      <Header />
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
