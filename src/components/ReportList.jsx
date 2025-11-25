import { useState } from 'react'
import { exportToJSON, exportToMarkdown, importFromJSON } from '../utils/storage'
import { SearchIcon, DownloadIcon, UploadIcon, EditIcon, TrashIcon, CardIcon, CalendarIcon, ChartIcon, CheckIcon } from './Icons'
import CustomSelect from './CustomSelect'
import '../styles/ReportList.css'

function ReportList({ reports, onEdit, onDelete, onViewCard, onImport }) {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteModal, setDeleteModal] = useState(null)
  const [isExportMode, setIsExportMode] = useState(false)
  const [selectedReports, setSelectedReports] = useState(new Set())
  const [showExportModal, setShowExportModal] = useState(false)

  const filterOptions = [
    { value: 'all', label: '全部', icon: <ChartIcon size={16} /> },
    { value: 'daily', label: '日报', icon: <CalendarIcon size={16} /> },
    { value: 'weekly', label: '周报', icon: <ChartIcon size={16} /> }
  ]

  const filteredReports = reports.filter(report => {
    const matchesFilter = filter === 'all' || report.type === filter
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.content.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleExportClick = () => {
    setIsExportMode(true)
    setSelectedReports(new Set())
  }

  const handleCancelExport = () => {
    setIsExportMode(false)
    setSelectedReports(new Set())
  }

  const handleToggleSelect = (reportId) => {
    const newSelected = new Set(selectedReports)
    if (newSelected.has(reportId)) {
      newSelected.delete(reportId)
    } else {
      newSelected.add(reportId)
    }
    setSelectedReports(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedReports.size === filteredReports.length) {
      setSelectedReports(new Set())
    } else {
      setSelectedReports(new Set(filteredReports.map(r => r.id)))
    }
  }

  const handleConfirmExport = () => {
    if (selectedReports.size === 0) {
      alert('请至少选择一个报告')
      return
    }
    setShowExportModal(true)
  }

  const handleExportFormat = (format) => {
    const reportsToExport = reports.filter(r => selectedReports.has(r.id))
    if (format === 'json') {
      exportToJSON(reportsToExport)
    } else if (format === 'markdown') {
      exportToMarkdown(reportsToExport)
    }
    setShowExportModal(false)
    setIsExportMode(false)
    setSelectedReports(new Set())
  }

  const handleImport = (event) => {
    const file = event.target.files[0]
    if (file) {
      importFromJSON(file, (importedReports) => {
        onImport(importedReports)
        event.target.value = ''
      })
    }
  }

  const confirmDelete = (report) => {
    setDeleteModal(report)
  }

  const handleDelete = () => {
    if (deleteModal) {
      onDelete(deleteModal.id)
      setDeleteModal(null)
    }
  }

  return (
    <>
      <div className="report-list">
        <div className="list-header">
          <h2>我的报告</h2>
          <div className="list-controls">
            <div className="search-wrapper">
              <SearchIcon size={18} />
              <input
                type="text"
                placeholder="搜索报告..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <CustomSelect 
              value={filter} 
              onChange={setFilter}
              options={filterOptions}
            />
            <button className="import-btn">
              <UploadIcon size={18} />
              <span>导入</span>
              <input type="file" accept=".json" onChange={handleImport} />
            </button>
            {!isExportMode ? (
              <button onClick={handleExportClick} className="export-btn">
                <DownloadIcon size={18} />
                <span>导出</span>
              </button>
            ) : (
              <>
                <button onClick={handleSelectAll} className="select-all-btn">
                  <CheckIcon size={18} />
                  <span>{selectedReports.size === filteredReports.length ? '取消全选' : '全选'}</span>
                </button>
                <button onClick={handleConfirmExport} className="confirm-export-btn">
                  <DownloadIcon size={18} />
                  <span>确认导出 ({selectedReports.size})</span>
                </button>
                <button onClick={handleCancelExport} className="cancel-export-btn">
                  <span>取消</span>
                </button>
              </>
            )}
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="empty-state">
            <p>暂无报告，点击"新建报告"开始记录吧！</p>
          </div>
        ) : (
          <div className="reports-grid">
            {filteredReports.map(report => (
              <div key={report.id} className={`report-item ${isExportMode ? 'export-mode' : ''} ${selectedReports.has(report.id) ? 'selected' : ''}`}>
                {isExportMode && (
                  <div className="report-checkbox" onClick={() => handleToggleSelect(report.id)}>
                    <input 
                      type="checkbox" 
                      checked={selectedReports.has(report.id)}
                      onChange={() => {}}
                    />
                  </div>
                )}
                <div className="report-header">
                  <span className={`report-type ${report.type}`}>
                    {report.type === 'daily' ? <><CalendarIcon size={14} /> 日报</> : <><ChartIcon size={14} /> 周报</>}
                  </span>
                  {!isExportMode && (<span className="report-date">{new Date(report.date).toLocaleDateString()}</span>)}
                </div>
                <h3>{report.title}</h3>
                <p className="report-preview">{report.content.substring(0, 100)}...</p>
                {report.achievements && report.achievements.length > 0 && (
                  <div className="achievements-preview">
                    <strong>收获：</strong>
                    <span>{report.achievements[0]}</span>
                    {report.achievements.length > 1 && <span> +{report.achievements.length - 1}</span>}
                  </div>
                )}
                {!isExportMode && (
                  <div className="report-actions">
                    <button onClick={() => onViewCard(report)} className="btn-card">
                      <CardIcon size={16} />
                      <span>卡片</span>
                    </button>
                    <button onClick={() => onEdit(report)} className="btn-edit">
                      <EditIcon size={16} />
                      <span>编辑</span>
                    </button>
                    <button onClick={() => confirmDelete(report)} className="btn-delete">
                      <TrashIcon size={16} />
                      <span>删除</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>确认删除</h3>
            <p>确定要删除报告 "{deleteModal.title}" 吗？此操作无法撤销。</p>
            <div className="modal-actions">
              <button onClick={() => setDeleteModal(null)} className="modal-cancel">取消</button>
              <button onClick={handleDelete} className="modal-confirm">确认删除</button>
            </div>
          </div>
        </div>
      )}

      {showExportModal && (
        <div className="modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="modal export-format-modal" onClick={(e) => e.stopPropagation()}>
            <h3>选择导出格式</h3>
            <p>已选择 {selectedReports.size} 个报告</p>
            <div className="export-format-options">
              <button onClick={() => handleExportFormat('json')} className="format-btn json-btn">
                <DownloadIcon size={24} />
                <span>JSON 格式</span>
                <small>适合数据备份和导入</small>
              </button>
              <button onClick={() => handleExportFormat('markdown')} className="format-btn markdown-btn">
                <DownloadIcon size={24} />
                <span>Markdown 格式</span>
                <small>适合阅读和分享</small>
              </button>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowExportModal(false)} className="modal-cancel">取消</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ReportList
