// Cache only public app-shell assets. Never intercept private Runflare/Vercel audio APIs.
const CACHE_PREFIX='deutsch-trainer-pwa-';
const CACHE_NAME=CACHE_PREFIX+'20261107-v1';
const APP_SHELL=['/','/manifest.webmanifest','/icons/icon-192.png','/icons/icon-512.png'];
self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting())
  );
});
self.addEventListener('activate',event=>{
  event.waitUntil(Promise.all([
    caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE_NAME).map(key=>caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(url.pathname.startsWith('/api/')||url.pathname.startsWith('/audio/'))return;
  // Never cache auth, API, user-generated or streamed content.
  if(request.mode==='navigate'){
    event.respondWith(
      fetch(request).then(response=>{
        if(response.ok&&response.type==='basic'){
          const copy=response.clone();
          event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.put('/',copy)));
        }
        return response;
      }).catch(async()=>await caches.match('/')||Response.error())
    );
    return;
  }
  if(url.pathname.startsWith('/assets/')||url.pathname.startsWith('/icons/')
     ||url.pathname==='/manifest.webmanifest'||url.pathname==='/favicon.svg'){
    event.respondWith(
      caches.match(request).then(cached=>cached||fetch(request).then(response=>{
        if(response.ok&&response.type==='basic'){
          const copy=response.clone();
          event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.put(request,copy)));
        }
        return response;
      }))
    );
  }
});
