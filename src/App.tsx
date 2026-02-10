import { useState } from 'react'
import './App.css'
import type { TabId } from './types'
import { AppHeader } from './components/AppHeader'
import { Hero } from './components/Hero'
import { ForgeSection } from './components/forge/ForgeSection'
import { HealSection } from './components/heal/HealSection'
import { LeagueSection } from './components/league/LeagueSection'

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('forge')

  return (
    <div className="app">
      <AppHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="app-main" id="top">
        <Hero />

        {activeTab === 'forge' && <ForgeSection />}
        {activeTab === 'heal' && <HealSection />}
        {activeTab === 'league' && <LeagueSection />}
      </main>

      <footer className="app-footer">
        <p>포지마스터 27TH 클랜용 계산기 · 개인 팬메이드 도구</p>
      </footer>
    </div>
  )
}

export default App
