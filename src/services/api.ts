/* eslint-disable @typescript-eslint/no-explicit-any */
// api.ts (refatorado)

import { uploadToCloudinary } from "../utils/uploadToCloudinary";

const BASE_URL = "https://backendpicbmpe-production-d86d.up.railway.app";

/** -------------------------
 * Tipagens básicas (podem ampliar conforme a API)
 * ------------------------- */
export interface Usuario {
  id: number;
  nome?: string;
  matricula?: string;
  email?: string;
  patente?: string;
  funcao?: string;
  status?: boolean;
  [k: string]: any;
}

export interface Localizacao {
  id?: number;
  municipio?: string;
  bairro?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  pontoReferencia?: string;
  latitude?: string;
  longitude?: string;
  [k: string]: any;
}

export interface Viatura {
  id?: number;
  tipo?: string;
  numero?: string;
  placa?: string;
  [k: string]: any;
}

export interface NaturezaOcorrencia {
  id?: number;
  nome?: string;
  [k: string]: any;
}

export interface Anexo {
  id?: number;
  urlArquivo?: string;
  nomeArquivo?: string;
  extensaoArquivo?: string;
  tipoArquivo?: string;
  dataCriacao?: string;
  [k: string]: any;
}

export interface OcorrenciaAPI {
  id: number;
  numeroOcorrencia?: string;
  dataHoraChamada?: string;
  statusAtendimento?: string;
  descricao?: string;
  formaAcionamento?: string;
  dataSincronizacao?: string;
  createdAt?: string;
  updatedAt?: string;
  naturezaOcorrencia?: NaturezaOcorrencia | null;
  grupoOcorrencia?: any | null;
  subgrupoOcorrencia?: any | null;
  viatura?: Viatura | null;
  localizacao?: Localizacao | null;
  usuario?: Usuario | null;
  unidadeOperacional?: any | null;
  eventoEspecial?: any | null;
  anexos?: Anexo[];
  [k: string]: any;
}

/** -------------------------
 * Helpers
 * ------------------------- */

async function requestJson(url: string, options: RequestInit = {}, timeout = 30000): Promise<any> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    // build headers and inject Authorization if available
    const baseHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> || {}),
    };

    // if body is FormData, don't force Content-Type (browser will set the correct multipart boundary)
    if (options && (options.body as any) instanceof FormData) {
      delete baseHeaders["Content-Type"];
    }

    // try to read token from localStorage (same key used by AuthContext)
    try {
      // prefer a runtime token exposed at window (set by AuthProvider) to support non-persistent logins
      const runtimeToken = (window as any).__chama_token as string | undefined;
      if (runtimeToken) {
        baseHeaders["Authorization"] = `Bearer ${runtimeToken}`;
      } else {
        const raw = localStorage.getItem("chama_auth");
        if (raw) {
          const parsed = JSON.parse(raw) as { token?: string } | null;
          if (parsed && parsed.token && !baseHeaders["Authorization"]) {
            baseHeaders["Authorization"] = `Bearer ${parsed.token}`;
          }
        }
      }
    } catch (e) {
      console.warn("Não foi possível ler token de autenticação:", e);
    }

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: baseHeaders,
    });
    clearTimeout(id);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const err = new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
      // attach status for callers
      (err as any).status = res.status;
      throw err;
    }
    // tenta parsear json, se não for json, devolve texto
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return res.json();
    return res.text();
  } catch (err) {
    clearTimeout(id);
    // Re-lança o erro para o caller decidir
    throw err;
  }
}

/** -------------------------
 * Ocorrências
 * ------------------------- */

/** Faz login com matrícula/senha — rota: POST /auth/login/ */
export async function login(matricula: string, senha: string): Promise<any> {
  try {
    return await requestJson(`${BASE_URL}/auth/login/`, {
      method: 'POST',
      body: JSON.stringify({ matricula, senha }),
    });
  } catch (error) {
    console.error('Erro na API de login:', error);
    throw error;
  }
}

/** Buscar todas as ocorrências (sem filtros complexos) */
export async function fetchOcorrencias(): Promise<OcorrenciaAPI[]> {
  try {
    return await requestJson(`${BASE_URL}/ocorrencias`);
  } catch (error) {
    console.error("Erro na API de ocorrências:", error);
    return [];
  }
}

/** Buscar ocorrência por ID (rota: GET /ocorrencias/:id) */
export async function getOcorrenciaPorId(id: string | number): Promise<OcorrenciaAPI | null> {
  try {
    const raw = await requestJson(`${BASE_URL}/ocorrencias/${encodeURIComponent(String(id))}`);
    return raw as OcorrenciaAPI;
  } catch (error) {
    console.error(`Erro ao buscar ocorrência ${id}:`, error);
    return null;
  }
}

/** Buscar ocorrências do usuário (rota existente) */
export async function fetchOcorrenciasUsuario(usuarioId: number): Promise<OcorrenciaAPI[]> {
  try {
    return await requestJson(`${BASE_URL}/ocorrencias/usuario/${usuarioId}`);
  } catch (error) {
    console.error("Erro na API de ocorrências do usuário:", error);
    return [];
  }
}

/** Buscar ocorrências com filtro de período (dataInicio/dataFim) */
export async function fetchOcorrenciasComFiltro(periodo?: { inicio: string; fim: string }): Promise<OcorrenciaAPI[]> {
  try {
    let url = `${BASE_URL}/ocorrencias`;
    if (periodo?.inicio && periodo?.fim) {
      url += `?dataInicio=${encodeURIComponent(periodo.inicio)}&dataFim=${encodeURIComponent(periodo.fim)}`;
    }
    return await requestJson(url);
  } catch (error) {
    console.error("Erro na API de ocorrências com filtro:", error);
    return [];
  }
}

/** Buscar ocorrências por natureza (aceita naturezaId numérico) */
export async function fetchOcorrenciasPorNatureza(naturezaId: number, periodo?: { inicio: string; fim: string }): Promise<OcorrenciaAPI[]> {
  try {
    let url = `${BASE_URL}/ocorrencias?naturezaId=${encodeURIComponent(String(naturezaId))}`;
    if (periodo?.inicio && periodo?.fim) {
      url += `&dataInicio=${encodeURIComponent(periodo.inicio)}&dataFim=${encodeURIComponent(periodo.fim)}`;
    }
    return await requestJson(url);
  } catch (error) {
    console.error("Erro na API de ocorrências por natureza:", error);
    return [];
  }
}

/** Postar ocorrência (criação) */
export async function postOcorrencia(payload: any): Promise<any> {
  try {
    return await requestJson(`${BASE_URL}/ocorrencias`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Erro na API de post ocorrência:", error);
    throw error;
  }
}

/** Postar ocorrência com timeout configurável (útil para offline sync) */
export async function postOcorrenciaComTimeout(payload: any, timeout = 30000): Promise<any> {
  try {
    return await requestJson(`${BASE_URL}/ocorrencias`, {
      method: "POST",
      body: JSON.stringify(payload),
    }, timeout);
  } catch (error) {
    console.error("Erro na API de post ocorrência com timeout:", error);
    throw error;
  }
}

/** -------------------------
 * Vítimas
 * ------------------------- */

export async function postVitima(payload: any): Promise<any> {
  try {
    return await requestJson(`${BASE_URL}/vitimas/`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Erro na API de post vítima:", error);
    throw error;
  }
}

export async function postVitimaComTimeout(payload: any, timeout = 15000): Promise<any> {
  try {
    return await requestJson(`${BASE_URL}/vitimas/`, {
      method: "POST",
      body: JSON.stringify(payload),
    }, timeout);
  } catch (error) {
    console.error("Erro na API de post vítima com timeout:", error);
    throw error;
  }
}

// NOVA FUNÇÃO: associar usuário à ocorrência (POST /ocorrencia-user)
export async function postOcorrenciaUsuario(payload: { ocorrenciaId: number; userId: number }): Promise<any> {
  try {
    return await requestJson(`${BASE_URL}/ocorrencia-user`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Erro na API de post ocorrencia-user:", error);
    throw error;
  }
}

/** -------------------------
 * Usuários / Perfis / Unidades
 * ------------------------- */

export async function fetchUsuarios(): Promise<Usuario[]> {
  try {
    return await requestJson(`${BASE_URL}/users`);
  } catch (error) {
    console.error("Erro na API de usuários:", error);
    return [];
  }
}

export async function fetchUsuario(id: number): Promise<Usuario | null> {
  try {
    return await requestJson(`${BASE_URL}/users/id/${id}`);
  } catch (error) {
    console.error("Erro na API de usuário:", error);
    return null;
  }
}

export async function postUsuario(payload: any): Promise<any> {
  try {
    return await requestJson(`${BASE_URL}/users`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Erro na API de post usuário:", error);
    throw error;
  }
}

export async function fetchPerfis(): Promise<any[]> {
  try {
    return await requestJson(`${BASE_URL}/perfis`);
  } catch (error) {
    console.error("Erro na API de perfis:", error);
    return [];
  }
}

export async function fetchUnidadesOperacionais(): Promise<any[]> {
  try {
    return await requestJson(`${BASE_URL}/unidadesoperacionais`);
  } catch (error) {
    console.error("Erro na API de unidades operacionais:", error);
    return [];
  }
}

/** -------------------------
 * Naturezas / Grupos / Subgrupos / Viaturas
 * ------------------------- */

export async function fetchNaturezasOcorrencias(): Promise<NaturezaOcorrencia[]> {
  try {
    return await requestJson(`${BASE_URL}/naturezasocorrencias`);
  } catch (error) {
    console.error("Erro na API de naturezas:", error);
    return [];
  }
}

export async function fetchGruposOcorrencias(): Promise<any[]> {
  try {
    return await requestJson(`${BASE_URL}/gruposocorrencias`);
  } catch (error) {
    console.error("Erro na API de grupos de ocorrências:", error);
    return [];
  }
}

export async function fetchSubgruposOcorrencias(): Promise<any[]> {
  try {
    return await requestJson(`${BASE_URL}/subgruposocorrencias`);
  } catch (error) {
    console.error("Erro na API de subgrupos de ocorrências:", error);
    return [];
  }
}

export async function fetchViaturas(): Promise<Viatura[]> {
  try {
    return await requestJson(`${BASE_URL}/viaturas`);
  } catch (error) {
    console.error("Erro na API de viaturas:", error);
    return [];
  }
}

// -------------------------
// Simple in-memory cache + prefetch helpers
// -------------------------

type CacheKey =
  | "unidadesOperacionais"
  | "naturezasOcorrencias"
  | "gruposOcorrencias"
  | "subgruposOcorrencias"
  | "condicoesVitima"
  | "viaturas";

const cache = new Map<CacheKey, any>();

export function getCached(key: CacheKey) {
  return cache.has(key) ? cache.get(key) : null;
}

export function setCached(key: CacheKey, value: any) {
  cache.set(key, value);
}

export async function prefetchStaticData(): Promise<void> {
  try {
    const [unidades, naturezas, grupos, subgrupos, condicoes, viaturasData] = await Promise.all([
      fetchUnidadesOperacionais(),
      fetchNaturezasOcorrencias(),
      fetchGruposOcorrencias(),
      fetchSubgruposOcorrencias(),
      fetchLesoes(),
      fetchViaturas(),
    ]);

    setCached("unidadesOperacionais", unidades);
    setCached("naturezasOcorrencias", naturezas);
    setCached("gruposOcorrencias", grupos);
    setCached("subgruposOcorrencias", subgrupos);
    setCached("condicoesVitima", condicoes);
    setCached("viaturas", viaturasData);

    // small console hint for debugging
    if (typeof window !== "undefined") {
      console.info("API prefetch concluído: itens em cache carregados.");
    }
  } catch (err) {
    console.warn("Falha no prefetchStaticData:", err);
  }
}

// Wrappers that prefer cached values and fall back to network
export async function getUnidadesOperacionais(): Promise<any[]> {
  const k: CacheKey = "unidadesOperacionais";
  const cached = getCached(k);
  if (cached) return cached;
  const fresh = await fetchUnidadesOperacionais();
  setCached(k, fresh);
  return fresh;
}

export async function getNaturezasOcorrencias(): Promise<NaturezaOcorrencia[]> {
  const k: CacheKey = "naturezasOcorrencias";
  const cached = getCached(k);
  if (cached) return cached;
  const fresh = await fetchNaturezasOcorrencias();
  setCached(k, fresh);
  return fresh;
}

export async function getGruposOcorrencias(): Promise<any[]> {
  const k: CacheKey = "gruposOcorrencias";
  const cached = getCached(k);
  if (cached) return cached;
  const fresh = await fetchGruposOcorrencias();
  setCached(k, fresh);
  return fresh;
}

export async function getSubgruposOcorrencias(): Promise<any[]> {
  const k: CacheKey = "subgruposOcorrencias";
  const cached = getCached(k);
  if (cached) return cached;
  const fresh = await fetchSubgruposOcorrencias();
  setCached(k, fresh);
  return fresh;
}

export async function getCondicoesVitima(): Promise<any[]> {
  const k: CacheKey = "condicoesVitima";
  const cached = getCached(k);
  if (cached) return cached;
  const fresh = await fetchLesoes();
  setCached(k, fresh);
  return fresh;
}

export async function getViaturas(): Promise<Viatura[]> {
  const k: CacheKey = "viaturas";
  const cached = getCached(k);
  if (cached) return cached;
  const fresh = await fetchViaturas();
  setCached(k, fresh);
  return fresh;
}

/** -------------------------
 * Regiões / IBGE / OSM
 * ------------------------- */

export async function fetchRegioes(): Promise<any[]> {
  try {
    return await requestJson(`${BASE_URL}/regioes`);
  } catch (error) {
    console.error("Erro na API de regiões:", error);
    return [];
  }
}

export async function fetchMunicipiosPE(): Promise<any[]> {
  try {
    return await requestJson('https://servicodados.ibge.gov.br/api/v1/localidades/estados/26/municipios');
  } catch (error) {
    console.error("Erro na API de municípios de PE:", error);
    return [];
  }
}

export async function fetchBairrosFromOSM(municipio: string): Promise<any> {
  try {
    const q = encodeURIComponent(municipio);
    const url = `https://overpass-api.de/api/interpreter?data=[out:json];relation["boundary"="administrative"]["admin_level"="9"]["name"~"^${q}$",i](around:5000,-8.0475622,-34.8770043);out;>;out skel qt;`;
    return await requestJson(url);
  } catch (error) {
    console.error("Erro na API de bairros de OSM:", error);
    return [];
  }
}

/** -------------------------
 * Geocoding / Reverse
 * ------------------------- */

export async function fetchGeocode(query: string): Promise<any[]> {
  try {
    const url = `${BASE_URL}/api/geocode?q=${encodeURIComponent(query)}`;
    return await requestJson(url);
  } catch (error) {
    console.error("Erro no geocoding:", error);
    return [];
  }
}

export async function fetchGeocodeCompleto(query: string): Promise<any[]> {
  try {
    const data = await fetchGeocode(query);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Erro no geocoding completo:", err);
    return [];
  }
}

export async function fetchReverseGeocode(lat: number, lon: number): Promise<any> {
  try {
    return await requestJson(`${BASE_URL}/api/reverse-geocode?lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lon))}`);
  } catch (err) {
    console.warn("Backend reverse-geocode falhou, tentando Nominatim fallback:", err);
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lon))}&addressdetails=1`;
      // Nominatim exige um User-Agent; fetch in browser will send one, but be polite with a referer via headers if needed.
      const res = await fetch(url, { headers: { "Accept": "application/json" } });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Nominatim error ${res.status} ${res.statusText} - ${text}`);
      }
      const json = await res.json();
      return json;
    } catch (err2) {
      console.error("Fallback Nominatim reverse-geocode também falhou:", err2);
      throw err2;
    }
  }
}

/** -------------------------
 * Uploads & Anexos
 * ------------------------- */

export async function processarUploadsArquivos(arquivos: any[]): Promise<any[]> {
  const resultados = await Promise.all(
    arquivos.map(async (arquivo) => {
      try {
        if (arquivo.url) return { ...arquivo, url: arquivo.url };

        // Se for data URL, converter para Blob/File
        let file: File;
        if (arquivo.data && typeof arquivo.data === "string" && arquivo.data.startsWith("data:")) {
          const response = await fetch(arquivo.data);
          const blob = await response.blob();
          file = new File([blob], arquivo.name || `upload_${Date.now()}`, { type: arquivo.type || "application/octet-stream" });
        } else {
          file = arquivo;
        }

        const url = await uploadToCloudinary(file);
        return { ...arquivo, url };
      } catch (err) {
        console.error("Erro no upload de arquivo:", err);
        return { ...arquivo, url: undefined };
      }
    })
  );

  return resultados.filter(arquivo => arquivo.url);
}

export async function dataUrlParaFile(dataUrl: string, filename: string, type: string): Promise<File> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], filename, { type });
}

export function prepararAnexos(arquivos: any[], assinaturaDataUrl?: string, numeroOcorrencia?: string): any[] {
  const anexos = arquivos
    .filter(arquivo => arquivo.url)
    .map(arquivo => {
      const ext = (arquivo.name || "").split(".").pop()?.toLowerCase() || "";
      const tipoArquivo = ext === "pdf" ? "arquivo" : "imagem";
      return {
        tipoArquivo,
        urlArquivo: arquivo.url,
        nomeArquivo: arquivo.name,
        extensaoArquivo: ext,
        descricao: arquivo.descricao || "",
      };
    });

  if (assinaturaDataUrl) {
    anexos.push({
      tipoArquivo: "assinatura",
      urlArquivo: assinaturaDataUrl,
      nomeArquivo: `${numeroOcorrencia || 'ocorrencia'}_assinatura.png`,
      extensaoArquivo: "png",
      descricao: "Assinatura do responsável",
    });
  }

  return anexos;
}

/** -------------------------
 * Lesões (condições da vítima)
 * ------------------------- */
export async function fetchLesoes(): Promise<any[]> {
  try {
    return await requestJson(`${BASE_URL}/lesoes`);
  } catch (error) {
    console.error("Erro na API de lesões:", error);
    return [];
  }
}

/** -------------------------
 * Utilitários de mapeamento
 * ------------------------- */

export function mapearStatusOcorrencia(status: string): string {
  // normaliza entrada (remove diacríticos, lowercase)
  if (status === null || status === undefined) return "";
  const s = String(status).toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").trim();

  // diversas formas que podem aparecer no banco ou UI
  if (s.includes("pend")) return "pendente"; // pendente, pend
  if (s.includes("em andamento") || s.includes("em_andamento") || s.includes("andament") || s.includes("em-andamento") || s.includes("in_progress") || s.includes("andamento")) return "em_andamento";

  // atendida / concluida / finalizada -> mapear para "atendida"
  if (s.includes("atend") || s.includes("atendida") || s.includes("atendido") || s.includes("conclu") || s.includes("concluida") || s.includes("concluida")) return "atendida";

  // não atendida / nao atendido / nao_atendido -> mapear para nao_atendido
  if (s.includes("nao") && s.includes("atend")) return "nao_atendido";
  if (s.includes("nao_atend") || s.includes("nao_atendido") || s.includes("nao_atendida") || s.includes("nao-atendido") || s.includes("nao atendida")) return "nao_atendido";

  // fallback: transformar em snake_case sem diacríticos
  return s.replace(/\s+/g, "_");
}

/**
 * Normaliza um valor de status vindo do backend para um rótulo exibível na UI.
 * Retorna um dos: "Pendente", "Em andamento", "Atendida", "Não Atendida", ou "Desconhecido".
 */
export function normalizeStatusLabel(raw: any): string {
  if (raw === null || raw === undefined) return "Desconhecido";
  const s = String(raw).toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").trim();
  if (s.includes("pend")) return "Pendente";
  if (s.includes("em andamento") || s.includes("em_andamento") || s.includes("andament") || s.includes("in_progress")) return "Em andamento";
  if (s.includes("nao") && s.includes("atend")) return "Não Atendida";
  if (s.includes("nao_atend") || s.includes("nao_atendido") || s.includes("nao_atendida")) return "Não Atendida";
  if (s.includes("atend") || s.includes("conclu") || s.includes("finaliz") || s.includes("resolv")) return "Atendida";
  return "Desconhecido";
}

export function mapearSexo(sexo?: string): string | undefined {
  if (!sexo) return undefined;
  const low = sexo.toString().toLowerCase();
  if (low.startsWith("m")) return "M";
  if (low.startsWith("f")) return "F";
  return "O";
}

/** -------------------------
 * Heatmap helper (merge ocorrências + naturezas)
 * ------------------------- */
export async function fetchDadosHeatmap(periodo?: { inicio: string; fim: string }) {
  try {
    const [ocorrencias, naturezas] = await Promise.all([
      fetchOcorrenciasComFiltro(periodo),
      fetchNaturezasOcorrencias()
    ]);

    return {
      ocorrencias: Array.isArray(ocorrencias) ? ocorrencias.map((o: any) => ({
        id: o.id,
        dataHora: o.dataHoraChamada || o.dataHora || new Date().toISOString(),
        naturezaOcorrencia: o.naturezaOcorrencia,
        localizacao: o.localizacao,
      })) : [],
      naturezas
    };
  } catch (error) {
    console.error("Erro ao buscar dados do heatmap:", error);
    return { ocorrencias: [], naturezas: [] };
  }
}

/** -------------------------
 * Get log auditoria
 * ------------------------- */

export async function fetchLogAuditoria(): Promise<any[]> {
  try {
    return await requestJson(`${BASE_URL}/audit`);
  } catch (error) {
    console.error("Erro na API de log de auditoria:", error);
    return [];
  }
}

export async function fetchLogAuditoriaPorUsuario(usuarioId: number): Promise<any[]> {
  try {
    return await requestJson(`${BASE_URL}/audit/user/${usuarioId}`);
  } catch (error) {
    console.error("Erro na API de log de auditoria por usuário:", error);
    return [];
  }
}