import { useMemo } from 'react'
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, format, eachDayOfInterval, subDays } from 'date-fns'
import ReactECharts from 'echarts-for-react'
import './Summary.css'

function Summary({ reports }) {
  const stats = useMemo(() => {
    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 })
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    const thisWeek = reports.filter(r => {
      const date = new Date(r.date)
      return date >= weekStart && date <= weekEnd
    })

    const thisMonth = reports.filter(r => {
      const date = new Date(r.date)
      return date >= monthStart && date <= monthEnd
    })

    const allAchievements = reports.flatMap(r => r.achievements || []).filter(a => a)

    return {
      total: reports.length,
      daily: reports.filter(r => r.type === 'daily').length,
      weekly: reports.filter(r => r.type === 'weekly').length,
      thisWeek: thisWeek.length,
      thisMonth: thisMonth.length,
      totalAchievements: allAchievements.length,
      recentAchievements: allAchievements.slice(0, 10)
    }
  }, [reports])

  const moodTrendChartOption = useMemo(() => {
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date()
    })

    const moodScores = {
      'excellent': 5,
      'good': 4,
      'normal': 3,
      'bad': 2,
      'terrible': 1
    }

    const dailyMoodScores = last30Days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd')
      const dayReports = reports.filter(r => r.date === dayStr && r.type === 'daily' && r.mood)
      
      if (dayReports.length === 0) return null
      
      const avgScore = dayReports.reduce((sum, r) => sum + (moodScores[r.mood] || 0), 0) / dayReports.length
      return avgScore
    })

    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        textStyle: { color: '#1f2937' },
        formatter: (params) => {
          const value = params[0].value
          if (value === null) return '无数据'
          
          let mood = '一般'
          if (value >= 4.5) mood = '非常开心 😄'
          else if (value >= 3.5) mood = '开心 😊'
          else if (value >= 2.5) mood = '一般 😐'
          else if (value >= 1.5) mood = '不太好 😔'
          else mood = '很糟糕 😢'
          
          return `${params[0].axisValue}<br/>心情分数: ${value.toFixed(1)}<br/>${mood}`
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: last30Days.map(d => format(d, 'MM/dd')),
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisLabel: { color: '#6b7280', interval: 4 }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 5,
        interval: 1,
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisLabel: { 
          color: '#6b7280',
          formatter: (value) => {
            const labels = ['', '😢', '😔', '😐', '😊', '😄']
            return labels[value] || value
          }
        },
        splitLine: { lineStyle: { color: '#f3f4f6' } }
      },
      series: [{
        name: '心情分数',
        type: 'line',
        smooth: true,
        data: dailyMoodScores,
        connectNulls: false,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(99, 102, 241, 0.3)' },
              { offset: 1, color: 'rgba(99, 102, 241, 0.05)' }
            ]
          }
        },
        lineStyle: { color: '#6366f1', width: 3 },
        itemStyle: { color: '#6366f1' }
      }]
    }
  }, [reports])

  const radarChartOption = useMemo(() => {
    const weeklyReports = reports.filter(r => r.type === 'weekly')
    const dailyReports = reports.filter(r => r.type === 'daily')
    
    const avgAchievements = reports.length > 0 
      ? reports.reduce((sum, r) => sum + (r.achievements?.length || 0), 0) / reports.length 
      : 0
    
    const avgPlans = reports.length > 0
      ? reports.reduce((sum, r) => sum + (r.plans?.length || 0), 0) / reports.length
      : 0

    const hasIssues = reports.filter(r => r.issues && r.issues.trim()).length

    return {
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        textStyle: { color: '#1f2937' }
      },
      radar: {
        indicator: [
          { name: '日报数量', max: Math.max(dailyReports.length, 10) },
          { name: '周报数量', max: Math.max(weeklyReports.length, 5) },
          { name: '平均收获', max: Math.max(avgAchievements * 2, 5) },
          { name: '平均计划', max: Math.max(avgPlans * 2, 5) },
          { name: '问题记录', max: Math.max(hasIssues, 5) }
        ],
        shape: 'polygon',
        splitNumber: 4,
        axisName: {
          color: '#6b7280',
          fontSize: 12
        },
        splitLine: {
          lineStyle: { color: '#e5e7eb' }
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(99, 102, 241, 0.05)', 'rgba(139, 92, 246, 0.05)']
          }
        }
      },
      series: [{
        type: 'radar',
        data: [{
          value: [dailyReports.length, weeklyReports.length, avgAchievements, avgPlans, hasIssues],
          name: '工作数据',
          areaStyle: {
            color: 'rgba(99, 102, 241, 0.3)'
          },
          lineStyle: { color: '#6366f1', width: 2 },
          itemStyle: { color: '#6366f1' }
        }]
      }]
    }
  }, [reports])



  return (
    <div className="summary">
      <h2>统计总结</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">总报告数</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.daily}</div>
          <div className="stat-label">日报</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.weekly}</div>
          <div className="stat-label">周报</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.thisWeek}</div>
          <div className="stat-label">本周</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.thisMonth}</div>
          <div className="stat-label">本月</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalAchievements}</div>
          <div className="stat-label">总收获</div>
        </div>
      </div>

      {reports.length > 0 && (
        <>
          <div className="charts-section">
            <div className="chart-container">
              <h3>工作数据雷达图</h3>
              <ReactECharts option={radarChartOption} style={{ height: '350px' }} />
            </div>
            <div className="chart-container">
              <h3>近30天心情趋势</h3>
              <ReactECharts option={moodTrendChartOption} style={{ height: '350px' }} />
            </div>
          </div>
        </>
      )}

      {stats.recentAchievements.length > 0 && (
        <div className="achievements-section">
          <h3>最近的收获</h3>
          <ul className="achievements-list">
            {stats.recentAchievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Summary
