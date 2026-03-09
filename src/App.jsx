import React, { useState } from 'react'
import { LayoutDashboard, CheckSquare, Target, BarChart2 } from 'lucide-react'
import MoscowBoard from './components/MoscowBoard'
import RiceTable from './components/RiceTable'
import WeightedMatrix from './components/WeightedMatrix'
import Sidebar from './components/Sidebar'

function App() {
    const [activeTab, setActiveTab] = useState('moscow')

    const renderContent = () => {
        switch (activeTab) {
            case 'moscow':
                return <MoscowBoard />
            case 'rice':
                return <RiceTable />
            case 'weighted':
                return <WeightedMatrix />
            default:
                return null
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <header className="app-header">
                <div className="app-title">
                    <Target className="app-title-icon" size={28} />
                    <h1><span className="text-gradient">Prioritize</span>App</h1>
                </div>
                <nav className="tabs-nav">
                    <button
                        className={`tab-btn ${activeTab === 'moscow' ? 'active' : ''}`}
                        onClick={() => setActiveTab('moscow')}
                    >
                        <CheckSquare size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
                        MoSCoW
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'rice' ? 'active' : ''}`}
                        onClick={() => setActiveTab('rice')}
                    >
                        <BarChart2 size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
                        RICE Score
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'weighted' ? 'active' : ''}`}
                        onClick={() => setActiveTab('weighted')}
                    >
                        <LayoutDashboard size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
                        Weighted List
                    </button>
                </nav>
            </header>

            <div className="app-container">
                <Sidebar activeFramework={activeTab} />
                <main className="main-content">
                    {renderContent()}
                </main>
            </div>
        </div>
    )
}

export default App
