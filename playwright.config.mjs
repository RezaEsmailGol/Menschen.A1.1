import {defineConfig,devices} from '@playwright/test';

// CI exercises the actual production build to avoid Vite dev HMR/dependency optimization races.
// Local development can still use the Vite dev server; no credentials are needed.
export default defineConfig({
 testDir:'./e2e',
 testMatch:'**/*.spec.js',
 timeout:240_000,
 expect:{timeout:12_000},
 fullyParallel:true,
 forbidOnly:!!process.env.CI,
 retries:process.env.CI?1:0,
 workers:process.env.CI?3:undefined,
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
   command:process.env.CI?'npm run preview -- --host 127.0.0.1 --port 5173 --strictPort':'npm run dev -- --host 127.0.0.1 --port 5173 --strictPort',
   url:'http://127.0.0.1:5173',
   reuseExistingServer:!process.env.CI,
   timeout:90_000
 }
});
