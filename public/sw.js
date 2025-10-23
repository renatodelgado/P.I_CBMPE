// public/service-worker.js
// CHAMA - Sistema de Gestão de Ocorrências | CBMPE
// Desenvolvido por alunos da Faculdade Senac Pernambuco
// Professor orientador: Geraldo Gomes

const CACHE_NAME = "chama-cache-v2";
const OFFLINE_URL = "/offline.html";

// Recursos essenciais para funcionamento offline inicial
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "icons/android/android-launchericon-192-192.png",
  "icons/android/android-launchericon-512-512.png",
];

// Instalação do Service Worker
self.addEventListener("install", (event) => {
  console.log("[Chama SW] Instalando...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener("activate", (event) => {
  console.log("[Chama SW] Ativando...");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Chama SW] Removendo cache antigo:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Intercepta requisições (fetch)
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Evita interferir em requisições de escrita (POST, PUT, DELETE)
  if (request.method !== "GET") return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Se o recurso está no cache, retorna imediatamente
      if (cachedResponse) {
        return cachedResponse;
      }

      // Tenta buscar da rede e adiciona ao cache
      return fetch(request)
        .then((networkResponse) => {
          // Evita cachear requisições inválidas ou do chrome-extension
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          const clonedResponse = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clonedResponse);
          });

          return networkResponse;
        })
        .catch(() => {
          // Se offline e sem cache, mostra a página offline
          if (request.mode === "navigate") {
            return caches.match(OFFLINE_URL);
          }
        });
    })
  );
});

// Detecta quando há nova versão e atualiza automaticamente
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
