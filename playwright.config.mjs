import {defineConfig,devices} from '@playwright/test';

// Uses Vite's local dev server: no production account, test data or API keys.
export default defineConfig({
 testDir:'./e2e',
 testMatch:'**/*.spec.js',
 timeout:240_000,
 expect:{timeout:12_000},
 fullyParallel:false,
 forbidOnly:!!process.env.CI,
 retries:process.env.CI?1:0,
 workers:process.env.CI?1:undefined,
 reporter:process.env.CI?[['list'],['html',{open:'never',outputFolder:'playwright-report'}]]:'list',
 use:{
   baseURL:'http://127.0.0.1:5173',
   trace:'retain-on-failure',
   screenshot:'only-on-failure',
   reducedMotion:'reduce',
   locale:'fa-IR'
 },
 projects:[{name:'chromium',use:{...devices['Desktop Chrome']}}],
 webServer:{
   command:'npm run dev -- --host 127.0.0.1 --port 5173 --strictPort',
   url:'http://127.0.0.1:5173',
   reuseExistingServer:!process.env.CI,
   timeout:90_000
 }
});
