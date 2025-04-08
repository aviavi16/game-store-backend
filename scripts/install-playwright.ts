import fs from 'fs'
import { execSync } from 'child_process'

const browserPath = '/opt/render/.cache/ms-playwright/chromium'

if (fs.existsSync(browserPath)) {
  console.log('✅ Playwright browser already installed, skipping installation.')
} else {
  console.log('⬇️ Installing Playwright browser...')
  execSync('npx playwright install --with-deps', { stdio: 'inherit' })
}
