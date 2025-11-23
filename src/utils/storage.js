const STORAGE_KEY = 'work_reports'

export const getReports = () => {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export const saveReport = (report) => {
  const reports = getReports()
  if (report.id) {
    const index = reports.findIndex(r => r.id === report.id)
    if (index !== -1) {
      reports[index] = report
    }
  } else {
    report.id = Date.now().toString()
    report.createdAt = new Date().toISOString()
    reports.unshift(report)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
}

export const deleteReport = (id) => {
  const reports = getReports().filter(r => r.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
}

export const exportToJSON = (reports) => {
  const dataStr = JSON.stringify(reports, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `DailyUp_报告_${new Date().toLocaleDateString()}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export const exportToMarkdown = (reports) => {
  const moodMap = {
    excellent: '😄 非常开心',
    good: '😊 开心',
    normal: '😐 一般',
    bad: '😔 不太好',
    terrible: '😢 很糟糕'
  }

  let markdown = `# DailyUp 工作报告\n\n`
  markdown += `> 导出时间：${new Date().toLocaleString('zh-CN')}\n\n`
  markdown += `---\n\n`

  reports.forEach((report, index) => {
    const reportType = report.type === 'daily' ? '📅 日报' : '📊 周报'
    const reportDate = new Date(report.date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })

    markdown += `## ${index + 1}. ${reportType} - ${report.title}\n\n`
    markdown += `**日期：** ${reportDate}\n\n`

    if (report.mood) {
      markdown += `**心情：** ${moodMap[report.mood] || report.mood}\n\n`
    }

    markdown += `### 💼 工作内容\n\n`
    markdown += `${report.content}\n\n`

    if (report.achievements && report.achievements.length > 0) {
      markdown += `### ✨ 收获与成果\n\n`
      report.achievements.forEach(achievement => {
        if (achievement.trim()) {
          markdown += `- ${achievement}\n`
        }
      })
      markdown += `\n`
    }

    if (report.plans && report.plans.length > 0) {
      markdown += `### 📋 明天/下周计划\n\n`
      report.plans.forEach(plan => {
        if (plan.trim()) {
          markdown += `- ${plan}\n`
        }
      })
      markdown += `\n`
    }

    if (report.issues && report.issues.trim()) {
      markdown += `### ⚠️ 遇到的问题\n\n`
      markdown += `${report.issues}\n\n`
    }

    markdown += `---\n\n`
  })

  const dataBlob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `WorkFlow_报告_${new Date().toLocaleDateString()}.md`
  link.click()
  URL.revokeObjectURL(url)
}

export const importFromJSON = async (file, callback) => {
  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const importedData = JSON.parse(e.target.result)
      if (Array.isArray(importedData)) {
        const validReports = importedData.filter(report => {
          return report.title && report.content
        })
        
        if (validReports.length > 0) {
          // 移除 id 字段，让 Supabase 生成新的 UUID
          const reportsToImport = validReports.map(({ id, created_at, updated_at, ...report }) => report)
          
          // 导入到 Supabase
          const { importReports } = await import('../services/reportService')
          await importReports(reportsToImport)
          
          callback(reportsToImport)
          alert(`成功导入 ${reportsToImport.length} 条报告！`)
        } else {
          alert('没有有效的报告可导入。')
        }
      } else {
        alert('文件格式错误，请选择有效的 JSON 文件。')
      }
    } catch (error) {
      console.error('导入失败:', error)
      alert('文件解析或导入失败，请确保文件格式正确。')
    }
  }
  reader.readAsText(file)
}
