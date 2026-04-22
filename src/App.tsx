import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Welcome from './pages/Welcome'
import Chat from './pages/Chat'
import Onboarding from './pages/Onboarding'
import { LanguageProvider } from './lib/i18n'

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App

