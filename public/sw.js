const CACHE="ilama-bloom-v6";
const LEGACY_PREFIXES=["ilama-bloom-"];
const OFFLINE=["/","/offline.html","/manifest.webmanifest","/icon.svg","/ilama-bloom-logo.svg","/ilama-symbol.svg"];

self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CACHE).then(cache=>cache.addAll(OFFLINE)).then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE&&LEGACY_PREFIXES.some(prefix=>key.startsWith(prefix))).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("message",event=>{
  if(event.data?.type==="SKIP_WAITING") self.skipWaiting();
  if(event.data?.type==="CLEAR_OLD_CACHES"){
    event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE&&LEGACY_PREFIXES.some(prefix=>key.startsWith(prefix))).map(key=>caches.delete(key)))));
  }
});

self.addEventListener("fetch",event=>{
  const req=event.request;
  if(req.method!=="GET"||req.url.includes("/api/")) return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin) return;

  const isDocument=req.mode==="navigate"||req.destination==="document";
  if(isDocument){
    event.respondWith(
      fetch(req,{cache:"no-store"})
        .then(response=>response)
        .catch(()=>caches.match(req).then(cached=>cached||caches.match("/offline.html")||caches.match("/")))
    );
    return;
  }

  // Only public, versioned assets and the explicit offline shell may enter Cache Storage.
  // Authenticated or user-specific requests must never be cached by this worker.
  if(!url.pathname.startsWith("/_next/static/")&&!OFFLINE.includes(url.pathname)) return;

  if(url.pathname.startsWith("/_next/static/")){
    event.respondWith(
      caches.match(req).then(cached=>cached||fetch(req).then(response=>{
        if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));}
        return response;
      }))
    );
    return;
  }

  event.respondWith(
    fetch(req).then(response=>{
      if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));}
      return response;
    }).catch(()=>caches.match(req))
  );
});
