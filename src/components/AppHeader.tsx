import type { TabId } from '../types'

type AppHeaderProps = {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export function AppHeader({ activeTab, onTabChange }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="brand" onClick={() => onTabChange('forge')}>
        <span className="brand-mark">FM</span>
        <div className="brand-text">
          <span className="brand-title">포지마스터 27TH 클랜용 계산기</span>
          <span className="brand-subtitle">27TH Clan · Forge Master Companion Tools</span>
        </div>
      </div>
      <nav className="nav nav-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'forge'}
          className={`nav-link ${activeTab === 'forge' ? 'active' : ''}`}
          onClick={() => onTabChange('forge')}
        >
          대장간 업그레이드 계산기
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'heal'}
          className={`nav-link ${activeTab === 'heal' ? 'active' : ''}`}
          onClick={() => onTabChange('heal')}
        >
          초당 회복력 계산기
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'league'}
          className={`nav-link ${activeTab === 'league' ? 'active' : ''}`}
          onClick={() => onTabChange('league')}
        >
          리그전 시뮬레이션
        </button>
      </nav>
    </header>
  )
}
