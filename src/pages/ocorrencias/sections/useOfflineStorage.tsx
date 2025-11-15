/* eslint-disable @typescript-eslint/no-explicit-any */
// File: src/hooks/useOfflineStorage.tsx
// This file concentrates all localStorage logic. To disable offline storage, simply remove usages of this hook in NovaOcorrencia.tsx or comment out the logic inside.
import { useState } from "react";

const CACHE_KEY = "ocorrencias_offline";

export function useOfflineStorage() {
  const [offlineOccurrences, setOfflineOccurrences] = useState<any[]>([]);

  function saveOffline(ocorrencia: any) {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const timestamped = {
      id,
      ...ocorrencia,
      savedAt: new Date().toISOString(),
    };
    try {
      const existing = localStorage.getItem(CACHE_KEY);
      const list = existing ? JSON.parse(existing) : [];
      list.push(timestamped);
      localStorage.setItem(CACHE_KEY, JSON.stringify(list));
      console.debug("Ocorrência salva no localStorage:", timestamped);
      return timestamped;
    } catch (err) {
      console.error("Erro ao salvar no localStorage:", err);
      try {
        const existing = sessionStorage.getItem(CACHE_KEY);
        const list = existing ? JSON.parse(existing) : [];
        list.push(timestamped);
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(list));
        console.debug("Ocorrência salva no sessionStorage (fallback):", timestamped);
        return timestamped;
      } catch (err2) {
        console.error("Falha também no sessionStorage:", err2);
        alert("Não foi possível salvar localmente. Verifique as permissões do navegador.");
        return null;
      }
    }
  }

  function getOfflineOccurrences() {
    try {
      const existing = localStorage.getItem(CACHE_KEY);
      return existing ? JSON.parse(existing) : [];
    } catch (err) {
      console.error("Erro ao ler localStorage, tentando sessionStorage:", err);
      try {
        const existing = sessionStorage.getItem(CACHE_KEY);
        return existing ? JSON.parse(existing) : [];
      } catch (err2) {
        console.error("Falha ao ler sessionStorage:", err2);
        return [];
      }
    }
  }

  return { offlineOccurrences, setOfflineOccurrences, saveOffline, getOfflineOccurrences };
}