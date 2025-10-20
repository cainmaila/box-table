# GitHub Pages 部署指南

## 自動部署設定

本專案已配置 GitHub Actions 自動部署到 GitHub Pages。

### 部署流程

1. **推送代碼到 main 分支**
   ```bash
   git add .
   git commit -m "your commit message"
   git push origin main
   ```

2. **GitHub Actions 自動執行**
   - 檢出代碼
   - 安裝 pnpm 和 Node.js
   - 安裝依賴 (`pnpm install`)
   - 構建項目 (`pnpm build`)
   - 部署到 GitHub Pages

3. **啟用 GitHub Pages**
   - 前往你的 GitHub 倉庫設定頁面
   - 點擊 **Settings** > **Pages**
   - 在 **Source** 下拉選單選擇 **GitHub Actions**
   - 保存設定

### 配置說明

#### svelte.config.js
```javascript
adapter: adapter({
  pages: 'build',
  assets: 'build',
  fallback: 'index.html',
  precompress: false,
  strict: true
}),
paths: {
  base: process.env.NODE_ENV === 'production' ? '/box-table' : ''
}
```

- `base`: 設定為你的倉庫名稱（如 `/box-table`）
- 開發環境（`pnpm dev`）使用空路徑
- 生產環境（`pnpm build`）使用 `/box-table` 路徑

#### .github/workflows/deploy.yml
GitHub Actions workflow 配置，自動在推送到 main 分支時觸發部署。

### 本地測試

#### 開發模式（無 base path）
```bash
pnpm dev
```
訪問：http://localhost:5173/

#### 生產構建（含 base path）
```bash
NODE_ENV=production pnpm build
pnpm preview
```
訪問：http://localhost:4173/box-table/

### 部署後訪問

部署成功後，你的應用將可在以下網址訪問：
```
https://<username>.github.io/box-table/
```

將 `<username>` 替換為你的 GitHub 用戶名。

### 故障排除

#### 資源 404 錯誤
如果部署後資源無法加載，檢查：
1. `svelte.config.js` 中的 `base` 路徑是否正確
2. GitHub Pages 設定是否啟用
3. GitHub Actions workflow 是否成功執行

#### 更改倉庫名稱
如果倉庫名稱不是 `box-table`，需要修改：
1. `svelte.config.js` 中的 `paths.base`
2. 重新構建並推送

### 手動部署

如果需要手動部署：
```bash
# 構建
NODE_ENV=production pnpm build

# 使用 gh-pages 工具部署（需先安裝）
pnpm install -D gh-pages
pnpm gh-pages -d build
```

## 注意事項

- ✅ `.nojekyll` 文件已自動包含在構建中
- ✅ 所有資源路徑已正確設置 base path
- ✅ SPA fallback 已配置為 `index.html`
- ⚠️ 確保倉庫設定中啟用了 GitHub Pages
- ⚠️ 第一次部署可能需要幾分鐘才能生效
