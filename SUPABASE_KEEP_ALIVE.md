# Supabase 数据库保活 - GitHub Actions 详细教程

为了防止 Supabase 免费版因7天无活动而暂停服务，使用 GitHub Actions 自动执行定时任务保持数据库活跃。

## 🎯 完整设置步骤

### 第一步：推送代码到 GitHub

1. **创建 GitHub 仓库**（如果还没有）
2. **推送你的项目代码**到 GitHub 仓库
3. **确保 `.github/workflows/keep-supabase-alive.yml` 文件已上传**

### 第二步：获取 Supabase 配置信息

1. **登录 Supabase Dashboard**
   - 访问：https://supabase.com/dashboard
   - 选择你的项目

2. **获取项目配置**
   - 点击左侧菜单 `Settings` → `API`
   - 复制以下信息：
     - **Project URL**（项目URL）
     - **anon public key**（匿名公钥）

### 第三步：在 GitHub 中添加 Secrets

1. **进入你的 GitHub 仓库页面**

2. **点击 `Settings` 选项卡**
   ![GitHub Settings](https://docs.github.com/assets/cb-27528/images/help/repository/repo-actions-settings.png)

3. **在左侧菜单中找到 `Secrets and variables`**
   - 点击 `Secrets and variables`
   - 选择 `Actions`

4. **添加第一个 Secret**
   - 点击 `New repository secret` 按钮
   - **Name**: `VITE_SUPABASE_URL`
   - **Secret**: 粘贴你的 Supabase Project URL
   - 点击 `Add secret`

5. **添加第二个 Secret**
   - 再次点击 `New repository secret` 按钮
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Secret**: 粘贴你的 Supabase anon public key
   - 点击 `Add secret`

### 第四步：启用 GitHub Actions

1. **进入 Actions 页面**
   - 在你的仓库中点击 `Actions` 选项卡

2. **启用 Workflows**
   - 如果看到 "Workflows aren't being run on this forked repository" 提示
   - 点击 `I understand my workflows, go ahead and enable them`

3. **查看工作流**
   - 你应该能看到 "Keep Supabase Database Alive" 工作流

### 第五步：测试运行

1. **手动触发测试**
   - 在 Actions 页面，点击 "Keep Supabase Database Alive" 工作流
   - 点击 `Run workflow` 按钮
   - 选择分支（通常是 main 或 master）
   - 点击绿色的 `Run workflow` 按钮

2. **查看执行结果**
   - 等待几分钟，刷新页面
   - 点击运行记录查看详细日志
   - 成功的话会显示：`✅ Supabase 保活成功! 当前 reports 表有 X 条记录`

## 📅 自动执行时间

- **执行频率**: 每天一次
- **执行时间**: 北京时间上午 10:00（UTC 02:00）
- **执行内容**: 查询数据库保持活跃

## 🔧 自定义配置

如果你的主数据表不是 `reports`，需要修改工作流文件：

1. **编辑 `.github/workflows/keep-supabase-alive.yml`**
2. **找到这一行**：
   ```javascript
   .from('reports')
   ```
3. **替换为你的表名**：
   ```javascript
   .from('your_table_name')
   ```

## 📊 监控和故障排除

### 查看执行日志
1. 进入 GitHub 仓库的 `Actions` 页面
2. 点击具体的运行记录
3. 展开 "Keep Supabase alive" 步骤查看详细日志

### 常见问题

**❌ 错误：缺少 Supabase 环境变量**
- 检查 Secrets 是否正确添加
- 确保 Secret 名称完全匹配：`VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`

**❌ 错误：查询失败**
- 检查表名是否正确（默认是 `reports`）
- 确保 Supabase 项目正常运行
- 检查 API 密钥是否有效

**❌ 工作流没有执行**
- 确保仓库启用了 Actions
- 检查 `.github/workflows/` 目录和文件是否存在
- 确认代码已推送到 GitHub

## ✅ 完成！

设置完成后，GitHub Actions 会：
- 每天自动执行保活任务
- 防止 Supabase 因无活动而暂停
- 在 Actions 页面提供详细的执行日志

无需任何手动操作，你的 Supabase 数据库将保持活跃状态！