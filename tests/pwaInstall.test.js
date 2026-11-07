import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inflateSync} from 'node:zlib';
import {Script} from 'node:vm';
import {createPwaIcon} from '../scripts/generate-pwa-icons.mjs';

const manifest=JSON.parse(readFileSync(new URL('../public/manifest.webmanifest',import.meta.url),'utf8'));
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const sw=readFileSync(new URL('../public/sw.js',import.meta.url),'utf8');
const pkg=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'));
const vercel=JSON.parse(readFileSync(new URL('../vercel.json',import.meta.url),'utf8'));

test('installable PWA manifest has launcher metadata and supported PNG icons',()=>{
  assert.equal(manifest.id,'/');
  assert.equal(manifest.start_url,'/');
  assert.equal(manifest.scope,'/');
  assert.equal(manifest.display,'standalone');
  assert.equal(manifest.lang,'fa');
  assert.ok(manifest.name&&manifest.short_name);
  for(const [size,purpose] of [['192x192','any'],['512x512','any'],['512x512','maskable']]){
    const icon=manifest.icons.find(x=>x.sizes===size&&x.purpose===purpose);
    assert.ok(icon,'missing '+size+' '+purpose);
    assert.equal(icon.type,'image/png');
    assert.match(icon.src,/^\/icons\/icon-[a-z0-9-]+\.png$/);
  }
  assert.match(html,/rel="manifest" href="\/manifest\.webmanifest"/);
  assert.match(html,/rel="apple-touch-icon"/);
  assert.match(html,/name="theme-color"/);
});

test('build-time PNG encoder emits valid RGBA icons for both Android dimensions',()=>{
  for(const size of [180,192,512]){
    const png=createPwaIcon(size,{maskable:size===512});
    assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
    assert.equal(png.readUInt32BE(16),size);
    assert.equal(png.readUInt32BE(20),size);
    assert.equal(png[24],8);
    assert.equal(png[25],6);
    const dataParts=[];
    let pos=8;
    while(pos<png.length){
      const len=png.readUInt32BE(pos);
      const type=png.toString('ascii',pos+4,pos+8);
      if(type==='IDAT')dataParts.push(png.subarray(pos+8,pos+8+len));
      pos+=len+12;
      if(type==='IEND')break;
    }
    const raw=inflateSync(Buffer.concat(dataParts));
    assert.equal(raw.length,(size*4+1)*size);
    assert.ok(png.length>100);
  }
});

test('service worker is valid and does not cache private audio/API requests',()=>{
  new Script(sw,{filename:'sw.js'});
  assert.match(sw,/startsWith\('\/api\/'\)/);
  assert.match(sw,/request\.mode==='navigate'/);
  assert.match(sw,/cache\.addAll\(APP_SHELL\)/);
  assert.match(sw,/caches\.match\('\/'\)/);
  assert.match(pkg.scripts.prebuild,/generate-pwa-icons/);
  assert.match(pkg.scripts.predev,/generate-pwa-icons/);
});

test('Vercel serves PWA static assets instead of rewriting them to SPA HTML',()=>{
  const source=vercel.rewrites[0].source;
  for(const path of ['/icons/icon-192.png','/sw.js','/manifest.webmanifest']){
    const regex=new RegExp('^'+source+'$');
    assert.equal(regex.test(path),false,'asset must bypass SPA rewrite: '+path);
  }
  assert.ok(vercel.headers.some(x=>x.source==='/manifest.webmanifest'));
  assert.ok(vercel.headers.some(x=>x.source==='/sw.js'));
});
