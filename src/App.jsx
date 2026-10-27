import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import FoodMenu from './components/FoodMenu'
import OurStory from './components/OurStory'
import './index.css'

function App() {
  return (
    <>
<Header />

      <main>
        <Hero />
        <FoodMenu />
        <OurStory />
        {/* Add your Hero, Menu, OurStory and Reservations components here */}
      </main>
    </>
  )
}

export default App
