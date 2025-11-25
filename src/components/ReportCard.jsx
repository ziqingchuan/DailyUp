import { useRef } from 'react'
import html2canvas from 'html2canvas'
import { ArrowLeftIcon, DownloadIcon, CalendarIcon, ChartIcon, FileTextIcon, SparklesIcon, ChecklistIcon, AlertIcon } from './Icons'
import '../styles/ReportCard.css'

function ReportCard({ report, onBack }) {
  const cardRef = useRef(null)

  const handleExportImage = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2
      })
      const link = document.createElement('a')
      link.download = `${report.title}_${new Date().toLocaleDateString()}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  return (
    <div className="report-card-container">
      <div className="card-actions-top">
        <button onClick={onBack} className="btn-back">
          <ArrowLeftIcon size={18} />
          <span>返回</span>
        </button>
        <button onClick={handleExportImage} className="btn-export-image">
          <DownloadIcon size={18} />
          <span>导出图片</span>
        </button>
      </div>

      <div ref={cardRef} className="report-card">
        <div className="card-header">
          <div className="card-type">
            {report.type === 'daily' ? <><CalendarIcon size={20} /> 日报</> : <><ChartIcon size={20} /> 周报</>}
          </div>
          <div className="card-date">{new Date(report.date).toLocaleDateString('zh-CN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
          })}</div>
        </div>

        <h2 className="card-title">{report.title}</h2>

        {report.mood && (
          <div className="card-mood">
            <span className="card-mood-label">今日心情：</span>
            <span className="card-mood-emoji">
              {report.mood === 'excellent' && '😄'}
              {report.mood === 'good' && '😊'}
              {report.mood === 'normal' && '😐'}
              {report.mood === 'bad' && '😔'}
              {report.mood === 'terrible' && '😢'}
            </span>
          </div>
        )}

        <div className="card-section">
          <h3><FileTextIcon size={20} /> 工作内容</h3>
          <p>{report.content}</p>
        </div>

        {report.achievements && report.achievements.length > 0 && (
          <div className="card-section achievements">
            <h3><SparklesIcon size={20} /> 收获与成果</h3>
            <ul>
              {report.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>
        )}

        {report.plans && report.plans.length > 0 && (
          <div className="card-section plans">
            <h3><ChecklistIcon size={20} /> 明天/下周计划</h3>
            <ul>
              {report.plans.map((plan, index) => (
                <li key={index}>{plan}</li>
              ))}
            </ul>
          </div>
        )}

        {report.issues && (
          <div className="card-section issues">
            <h3><AlertIcon size={20} /> 遇到的问题</h3>
            <p>{report.issues}</p>
          </div>
        )}

        <div className="card-footer">
          <div className="footer-decoration"></div>
          <p>每天进步一点点！</p>
        </div>
      </div>
    </div>
  )
}

export default ReportCard
