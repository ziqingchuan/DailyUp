-- 创建 reports 表
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(10) NOT NULL CHECK (type IN ('daily', 'weekly')),
  date DATE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  achievements JSONB DEFAULT '[]'::jsonb,
  plans JSONB DEFAULT '[]'::jsonb,
  issues TEXT,
  mood VARCHAR(20) CHECK (mood IN ('excellent', 'good', 'normal', 'bad', 'terrible')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_reports_date ON reports(date DESC);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(type);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 启用行级安全策略 (RLS)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有人读取
CREATE POLICY "允许所有人查看报告" ON reports
  FOR SELECT USING (true);

-- 创建策略：允许所有人插入
CREATE POLICY "允许所有人创建报告" ON reports
  FOR INSERT WITH CHECK (true);

-- 创建策略：允许所有人更新
CREATE POLICY "允许所有人更新报告" ON reports
  FOR UPDATE USING (true);

-- 创建策略：允许所有人删除
CREATE POLICY "允许所有人删除报告" ON reports
  FOR DELETE USING (true);

-- 注意：以上策略允许所有人访问，适合个人使用或演示
-- 如果需要用户认证，请修改策略使用 auth.uid()
