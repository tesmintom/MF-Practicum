import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import FoodMenu from './components/FoodMenu'
import './index.css'

function App() {
  return (
    <>
<Header />

      <main>
        <Hero />
        <FoodMenu />
        {/* Add your Hero, Menu, OurStory and Reservations components here */}
      </main>
    </>
  )
}

export default App
