import { useState, useEffect } from 'react'
import ReportList from './components/ReportList'
import ReportEditor from './components/ReportEditor'
import ReportCard from './components/ReportCard'
import Summary from './components/Summary'
import Header from './components/Header'
import Footer from './components/Footer'
import { saveReport, getReports, deleteReport } from './utils/storage'
import './App.css'

function App() {
  const [reports, setReports] = useState([])
  const [currentView, setCurrentView] = useState('list')
  const [editingReport, setEditingReport] = useState(null)
  const [selectedReport, setSelectedReport] = useState(null)

  useEffect(() => {
    setReports(getReports())
  }, [])

  const handleSaveReport = (report) => {
    saveReport(report)
    setReports(getReports())
    setCurrentView('list')
    setEditingReport(null)
  }

  const handleDeleteReport = (id) => {
    deleteReport(id)
    setReports(getReports())
  }

  const handleImportReports = () => {
    setReports(getReports())
  }

  const handleEditReport = (report) => {
    setEditingReport(report)
    setCurrentView('editor')
  }

  const handleViewCard = (report) => {
    setSelectedReport(report)
    setCurrentView('card')
  }

  const handleNavigate = (view) => {
    if (view === 'editor') {
      setEditingReport(null)
    }
    setCurrentView(view)
  }

  return (
    <div className="app">
      <Header currentView={currentView} onNavigate={handleNavigate} />

      <main className="app-main">
        <div className="app-container">
          {currentView === 'list' && (
            <ReportList 
              reports={reports}
              onEdit={handleEditReport}
              onDelete={handleDeleteReport}
              onViewCard={handleViewCard}
              onImport={handleImportReports}
            />
          )}
          {currentView === 'editor' && (
            <ReportEditor 
              report={editingReport}
              onSave={handleSaveReport}
              onCancel={() => { setEditingReport(null); setCurrentView('list'); }}
            />
          )}
          {currentView === 'card' && selectedReport && (
            <ReportCard 
              report={selectedReport}
              onBack={() => setCurrentView('list')}
            />
          )}
          {currentView === 'summary' && (
            <Summary reports={reports} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
