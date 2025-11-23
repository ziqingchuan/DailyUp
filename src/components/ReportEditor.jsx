import { useState, useEffect } from 'react'
import { PlusIcon, CloseIcon, CalendarIcon, ChartIcon } from './Icons'
import CustomSelect from './CustomSelect'
import './ReportEditor.css'

function ReportEditor({ report, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    type: 'daily',
    date: new Date().toISOString().split('T')[0],
    title: '',
    content: '',
    achievements: [''],
    plans: [''],
    issues: '',
    mood: ''
  })

  const typeOptions = [
    { value: 'daily', label: '日报', icon: <CalendarIcon size={16} /> },
    { value: 'weekly', label: '周报', icon: <ChartIcon size={16} /> }
  ]

  const moodOptions = [
    { value: 'excellent', emoji: '😄', label: '非常开心' },
    { value: 'good', emoji: '😊', label: '开心' },
    { value: 'normal', emoji: '😐', label: '一般' },
    { value: 'bad', emoji: '😔', label: '不太好' },
    { value: 'terrible', emoji: '😢', label: '很糟糕' }
  ]

  useEffect(() => {
    if (report) {
      setFormData(report)
    }
  }, [report])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData(prev => ({ ...prev, [field]: newArray }))
  }

  const addArrayItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }))
  }

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, [field]: newArray }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const cleanedData = {
      ...formData,
      achievements: formData.achievements.filter(a => a.trim()),
      plans: formData.plans.filter(p => p.trim())
    }
    onSave(cleanedData)
  }

  return (
    <div className="report-editor">
      <h2>{report ? '编辑报告' : '新建报告'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>类型</label>
            <CustomSelect
              value={formData.type}
              onChange={(value) => handleChange('type', value)}
              options={typeOptions}
            />
          </div>
          <div className="form-group">
            <label>日期</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>标题</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="输入报告标题..."
            required
          />
        </div>

        <div className="form-group">
          <label>工作内容</label>
          <textarea
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            placeholder="描述今天/本周的工作内容..."
            rows="6"
            required
          />
        </div>

        <div className="form-group">
          <label>收获与成果</label>
          {formData.achievements.map((achievement, index) => (
            <div key={index} className="array-item">
              <input
                type="text"
                value={achievement}
                onChange={(e) => handleArrayChange('achievements', index, e.target.value)}
                placeholder="记录你的收获..."
              />
              {formData.achievements.length > 1 && (
                <button type="button" onClick={() => removeArrayItem('achievements', index)} className="btn-remove">
                  <CloseIcon size={16} />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('achievements')} className="btn-add">
            <PlusIcon size={16} />
            <span>添加收获</span>
          </button>
        </div>

        <div className="form-group">
          <label>明天/下周计划</label>
          {formData.plans.map((plan, index) => (
            <div key={index} className="array-item">
              <input
                type="text"
                value={plan}
                onChange={(e) => handleArrayChange('plans', index, e.target.value)}
                placeholder="记录你的计划..."
              />
              {formData.plans.length > 1 && (
                <button type="button" onClick={() => removeArrayItem('plans', index)} className="btn-remove">
                  <CloseIcon size={16} />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('plans')} className="btn-add">
            <PlusIcon size={16} />
            <span>添加计划</span>
          </button>
        </div>

        <div className="form-group">
          <label>遇到的问题（可选）</label>
          <textarea
            value={formData.issues}
            onChange={(e) => handleChange('issues', e.target.value)}
            placeholder="记录遇到的问题或需要帮助的地方..."
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>今日心情</label>
          <div className="mood-selector">
            {moodOptions.map((mood) => (
              <button
                key={mood.value}
                type="button"
                className={`mood-btn ${formData.mood === mood.value ? 'selected' : ''}`}
                onClick={() => handleChange('mood', mood.value)}
                title={mood.label}
              >
                <span className="mood-emoji">{mood.emoji}</span>
                <span className="mood-label">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-cancel">取消</button>
          <button type="submit" className="btn-save">保存</button>
        </div>
      </form>
    </div>
  )
}

export default ReportEditor
