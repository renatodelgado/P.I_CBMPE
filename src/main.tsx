import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
import { prefetchStaticData } from './services/api'

// Note: Do not clear localStorage on unload — keep persisted auth when 'remember' is used.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
    <App />
    </AuthProvider>
  </StrictMode>,
)

// Prefetch static/cached API data to speed up pages that depend on them
try {
  // fire-and-forget; failures are non-fatal
  prefetchStaticData().catch((e) => console.warn("prefetchStaticData falhou:", e));
} catch (e) {
  console.warn("prefetchStaticData falhou:", e);
}

// Desabilitar registro do service worker para evitar cache persistente
// e limpar quaisquer service workers/caches já registrados.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      // Unregister all service workers
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const reg of regs) {
        try {
          await reg.unregister();
          console.log("[Chama SW] Service worker desregistrado:", reg.scope);
        } catch (e) {
          console.warn("[Chama SW] Falha ao desregistrar:", e);
        }
      }

      // Clear all caches
      if (typeof caches !== "undefined") {
        const keys = await caches.keys();
        await Promise.all(
          keys.map(async (key) => {
            try {
              await caches.delete(key);
              console.log("[Chama SW] Cache removido:", key);
            } catch (e) {
              console.warn("[Chama SW] Falha ao remover cache:", key, e);
            }
          })
        );
      }

      // If there is a controlling service worker, request it to skip waiting then reload
      if (navigator.serviceWorker.controller) {
        try {
          navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
        } catch (e) {
          console.warn("[Chama SW] Falha ao enviar SKIP_WAITING:", e);
        }
        // reload to ensure fresh assets
        window.location.reload();
      }
    } catch (err) {
      console.error("[Chama SW] Erro ao limpar service workers/caches:", err);
    }
  });
}

