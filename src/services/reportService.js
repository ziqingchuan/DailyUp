import { supabase } from '../lib/supabase'

// 获取所有报告
export const getReports = async () => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('date', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('获取报告失败:', error)
    return []
  }
}

// 创建新报告
export const createReport = async (report) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .insert([{
        type: report.type,
        date: report.date,
        title: report.title,
        content: report.content,
        achievements: report.achievements,
        plans: report.plans,
        issues: report.issues,
        mood: report.mood
      }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('创建报告失败:', error)
    throw error
  }
}

// 更新报告
export const updateReport = async (id, report) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .update({
        type: report.type,
        date: report.date,
        title: report.title,
        content: report.content,
        achievements: report.achievements,
        plans: report.plans,
        issues: report.issues,
        mood: report.mood
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('更新报告失败:', error)
    throw error
  }
}

// 删除报告
export const deleteReport = async (id) => {
  try {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('删除报告失败:', error)
    throw error
  }
}

// 批量导入报告
export const importReports = async (reports) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .insert(reports.map(report => ({
        type: report.type,
        date: report.date,
        title: report.title,
        content: report.content,
        achievements: report.achievements,
        plans: report.plans,
        issues: report.issues,
        mood: report.mood
      })))
      .select()

    if (error) throw error
    return data
  } catch (error) {
    console.error('导入报告失败:', error)
    throw error
  }
}
