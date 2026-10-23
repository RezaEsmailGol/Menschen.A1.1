import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const src = name => readFileSync(new URL('../src/'+name,import.meta.url),'utf8');

test('home and practice components import required dashboard icons',()=>{
  const screens=src('LearningScreens.jsx');
  assert.match(screens,/import\s*\{[^}]*\bBookOpenCheck\b[^}]*\}\s*from\s*['"]lucide-react['"]/s);
  assert.match(screens,/Icon:BookOpenCheck/);
});
test('React root is protected by error boundary to prevent completely empty UI',()=>{
  const main=src('main.jsx');
  assert.match(main,/import AppErrorBoundary from ['"]\.\/AppErrorBoundary\.jsx['"]/);
  assert.match(main,/<AppErrorBoundary><App\/><\/AppErrorBoundary>/);
  const boundary=src('AppErrorBoundary.jsx');
  assert.match(boundary,/getDerivedStateFromError/);
  assert.match(boundary,/اطلاعات یادگیری و فلش‌کارت‌ها پاک نشده‌اند/);
});
test('unfinished bedtime review has accessible route to switch to slideshow',()=>{
  const night=src('NightShift.jsx');
  assert.match(night,/nightSwitchMode/);
  assert.match(night,/تغییر به نمایش تصویری/);
  assert.match(night,/active:null/);
});
