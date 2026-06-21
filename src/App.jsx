import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import FirstJourneyPage from './pages/FirstJourneyPage'
import FirstJourneyDetailPage from './pages/FirstJourneyDetailPage'
import AboutPage from './pages/AboutPage'
import SkillsPage from './pages/SkillsPage'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : true
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <div className="min-h-screen bg-[#f0f4f8] dark:bg-[#07070e] page-bg text-zinc-900 dark:text-zinc-50 transition-colors duration-300 overflow-x-hidden font-sans">
      <Navbar dark={dark} setDark={setDark} />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/first-journey" element={<FirstJourneyPage />} />
          <Route path="/first-journey/:slug" element={<FirstJourneyDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/skills" element={<SkillsPage />} />
        </Routes>
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
