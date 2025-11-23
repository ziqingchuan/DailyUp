import { useState, useEffect } from 'react'
import ReportList from './components/ReportList'
import ReportEditor from './components/ReportEditor'
import ReportCard from './components/ReportCard'
import Summary from './components/Summary'
import Header from './components/Header'
import Footer from './components/Footer'
import { getReports, createReport, updateReport, deleteReport as deleteReportService } from './services/reportService'
import './App.css'

function App() {
  const [reports, setReports] = useState([])
  const [currentView, setCurrentView] = useState('list')
  const [editingReport, setEditingReport] = useState(null)
  const [selectedReport, setSelectedReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    setLoading(true)
    try {
      const data = await getReports()
      setReports(data)
    } catch (error) {
      console.error('加载报告失败:', error)
      alert('加载报告失败，请检查网络连接')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveReport = async (report) => {
    try {
      if (report.id) {
        await updateReport(report.id, report)
      } else {
        await createReport(report)
      }
      await loadReports()
      setCurrentView('list')
      setEditingReport(null)
    } catch (error) {
      console.error('保存报告失败:', error)
      alert('保存报告失败，请重试')
    }
  }

  const handleDeleteReport = async (id) => {
    try {
      await deleteReportService(id)
      await loadReports()
    } catch (error) {
      console.error('删除报告失败:', error)
      alert('删除报告失败，请重试')
    }
  }

  const handleImportReports = async () => {
    await loadReports()
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
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>加载中...</p>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
