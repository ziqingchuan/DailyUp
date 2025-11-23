# Supabase 设置指南

## 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com)
2. 注册/登录账号
3. 点击 "New Project" 创建新项目
4. 填写项目信息：
   - Name: workflow-app
   - Database Password: 设置一个强密码
   - Region: 选择离你最近的区域
5. 等待项目创建完成（约2分钟）

## 2. 创建数据库表

1. 在 Supabase 项目中，点击左侧菜单的 "SQL Editor"
2. 点击 "New Query"
3. 复制 `supabase-schema.sql` 文件中的所有内容
4. 粘贴到 SQL 编辑器中
5. 点击 "Run" 执行 SQL

## 3. 获取 API 密钥

1. 点击左侧菜单的 "Settings" (齿轮图标)
2. 点击 "API"
3. 找到以下信息：
   - Project URL (例如: https://xxxxx.supabase.co)
   - anon public key (一长串字符)

## 4. 配置环境变量

1. 在项目根目录创建 `.env` 文件
2. 添加以下内容（替换为你的实际值）：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. 保存文件

## 5. 安装依赖并运行

```bash
# 安装依赖
npm install

# 运行开发服务器
npm run dev
```

## 6. 数据迁移（可选）

如果你之前使用 localStorage 存储了数据：

1. 在旧版本中导出所有报告为 JSON
2. 在新版本中使用导入功能
3. 数据会自动保存到 Supabase

## 7. 安全建议

当前配置允许所有人访问数据（适合个人使用）。如果需要用户认证：

1. 在 Supabase 中启用 Authentication
2. 修改 `supabase-schema.sql` 中的 RLS 策略
3. 在应用中添加登录功能

## 故障排除

### 连接失败
- 检查 `.env` 文件中的 URL 和 Key 是否正确
- 确保 Supabase 项目状态为 "Active"
- 检查网络连接

### 数据无法保存
- 检查浏览器控制台的错误信息
- 确认 SQL 表已正确创建
- 检查 RLS 策略是否正确配置

### 导入失败
- 确保 JSON 文件格式正确
- 检查数据字段是否完整
- 查看浏览器控制台的详细错误

## 数据库结构

```
reports 表字段：
- id: UUID (主键，自动生成)
- type: VARCHAR(10) - 'daily' 或 'weekly'
- date: DATE - 报告日期
- title: TEXT - 标题
- content: TEXT - 内容
- achievements: JSONB - 收获数组
- plans: JSONB - 计划数组
- issues: TEXT - 问题（可选）
- mood: VARCHAR(20) - 心情（可选）
- created_at: TIMESTAMP - 创建时间
- updated_at: TIMESTAMP - 更新时间
```
