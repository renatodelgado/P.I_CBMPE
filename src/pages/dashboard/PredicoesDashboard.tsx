// src/pages/PredicoesDashboard.tsx
import { useEffect, useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Legend,
  AreaChart, Area,
  PieChart, Pie, Cell
} from "recharts";
import { fetchPrevisoes } from "../../services/api";
import { fetchMunicipiosPE as fetchMunicipiosPE_IBGE } from "../../services/municipio_bairro";
import type { Municipio } from "../../services/municipio_bairro";
import { PredicoesDashboardWrapper, ControlesSection, ControlsGrid, ControlField, ControlLabel, ControlInput, MunicipiosSelectedContainer, MunicipioTag, MunicipioTagButton, ChartsGrid, ChartCard, ChartTitle, NoDataContainer, ChartFooter, SuggestionsWrapper, SuggestionItem } from "./PredicoesDashboard.styles";
import { municipioColors } from "./Dashboard.styles";
import { Button } from "../../components/Button";
// ======================
// Tipos
// ======================

interface ClassificacaoResponse {
  label: string;
  valor: number;
}

interface ClusterResponse {
  x: number;
  y: number;
  municipio: string;
}

interface RegressaoResponse {
  timestamp: string;
  valor: number;
}

interface MunicipioPredicao {
  municipio: string;
  totalPrevisto: number;
}

interface PredicaoResponse {
  classificacao: ClassificacaoResponse[];
  clusters: ClusterResponse[];
  regressao: RegressaoResponse[];
  municipios: MunicipioPredicao[];
}

interface PrevisaoResponse {
  municipio: string;
  previsoes: { data: string; previsao: number }[];
}

// ======================
// Página
// ======================

export default function PredicoesDashboard() {
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [selectedMunicipios, setSelectedMunicipios] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dataInicio, setDataInicio] = useState("2025-12-14");
  const [dias, setDias] = useState(7);
  const [data, setData] = useState<PredicaoResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    fetchMunicipiosPE_IBGE().then(setMunicipios).catch(() => setMunicipios([]));
  }, []);

  const handlePrever = () => {
    setWarnings([]);
    if (selectedMunicipios.length === 0) {
      setData(null);
      return;
    }
    setLoading(true);
    Promise.all(selectedMunicipios.map((m) => fetchPrevisoes(m, dataInicio, dias)))
      .then((responses) => {
        const valid = responses.filter((r): r is PrevisaoResponse => !!r && Array.isArray((r as PrevisaoResponse).previsoes));
        if (valid.length === 0) {
          setData(null);
          setLoading(false);
          return;
        }
        const allPrevisoes: { data: string; previsao: number; municipio: string }[] = [];
        valid.forEach((r) => {
          r.previsoes.forEach((p) => {
            allPrevisoes.push({ ...p, municipio: r.municipio });
          });
        });
        const dateSums = new Map<string, number>();
        allPrevisoes.forEach((p) => {
          dateSums.set(p.data, (dateSums.get(p.data) || 0) + p.previsao);
        });
        const regressao: RegressaoResponse[] = Array.from(dateSums, ([timestamp, valor]) => ({ timestamp, valor })).sort(
          (a, b) => a.timestamp.localeCompare(b.timestamp)
        );
        const weekdaySums = new Map<number, number>();
        allPrevisoes.forEach((p) => {
          const d = new Date(p.data);
          const wd = d.getDay();
          weekdaySums.set(wd, (weekdaySums.get(wd) || 0) + p.previsao);
        });
        const labels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
        const classificacao: ClassificacaoResponse[] = labels.map((label, i) => ({
          label,
          valor: weekdaySums.get(i) || 0,
        }));
        const clusters: ClusterResponse[] = allPrevisoes.map((p, idx) => ({
          x: idx % dias,
          y: p.previsao,
          municipio: p.municipio,
        }));
        const munSums = new Map<string, number>();
        allPrevisoes.forEach((p) => {
          munSums.set(p.municipio, (munSums.get(p.municipio) || 0) + p.previsao);
        });
        const municipiosPred: MunicipioPredicao[] = Array.from(munSums, ([municipio, totalPrevisto]) => ({
          municipio,
          totalPrevisto,
        }));
        setData({ classificacao, clusters, regressao, municipios: municipiosPred });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const normalizeMunicipio = (raw: string) => {
    if (!raw) return "";
    const lower = raw.toLocaleLowerCase("pt-BR");
    const smallWords = new Set(["de", "da", "do", "das", "dos", "e"]);
    return lower
      .split(/\s+/)
      .map((w) => (smallWords.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
      .join(" ");
  };

  const tryAddMunicipio = async (nome: string) => {
    if (!nome || selectedMunicipios.includes(nome)) return;
    try {
      const resp = await fetchPrevisoes(nome, dataInicio, dias) as (PrevisaoResponse | { erro?: string } | null);
      if (!resp || !Array.isArray((resp as PrevisaoResponse)?.previsoes)) {
        const msg = typeof (resp as { erro?: string })?.erro === "string" ? (resp as { erro?: string }).erro! : "Sem histórico suficiente";
        setWarnings((prev) => [...prev, `Infelizmente, o município de ${normalizeMunicipio(nome)} não tem histórico suficiente para realizar esta predição.`]);
        console.log(`Previsão inválida para ${nome}: ${msg}`);
        setShowDialog(true);
        setSearchTerm("");
        return;
      }
      setSelectedMunicipios((prev) => [...prev, nome]);
      setSearchTerm("");
    } catch {
      setWarnings((prev) => [...prev, `Falha ao validar município: ${normalizeMunicipio(nome)}.`]);
      setShowDialog(true);
      setSearchTerm("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const term = searchTerm.trim();
      const found = municipios.find((m) => m.nome.toLocaleLowerCase("pt-BR") === term.toLocaleLowerCase("pt-BR"));
      if (found) {
        void tryAddMunicipio(found.nome);
      }
    }
  };

  const filteredSuggestions = useMemo(() => {
    const q = searchTerm.trim().toLocaleLowerCase("pt-BR");
    if (q.length < 2) return [] as Municipio[];
    return municipios
      .filter((m) => m.nome.toLocaleLowerCase("pt-BR").includes(q))
      .slice(0, 8);
  }, [municipios, searchTerm]);

  const renderPercentLabel = ({ percent }: { percent?: number }) => `${Math.round(((percent || 0) * 100))}%`;

  if (loading) return <p style={{ padding: 24, textAlign: "center" }}>Carregando predições...</p>;

  return (
    <PredicoesDashboardWrapper>
      {showDialog && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20, width: "min(520px, 92vw)", boxShadow: "0 10px 24px rgba(2,6,23,0.18)" }}>
            <h3 style={{ marginTop: 0, color: "#0b1220" }}>Aviso</h3>
            <div style={{ color: "#7c2d12", marginTop: 8 }}>
              {warnings.length === 0 ? (
                <div>Ocorreu um erro ao validar o município.</div>
              ) : (
                warnings.map((w, i) => (<div key={i} style={{ marginBottom: 6 }}>{w}</div>))
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
              <Button
                text="Fechar"
                variant="secondary"
                onClick={() => { setShowDialog(false); setWarnings([]); setSearchTerm(""); }}
              />
            </div>
          </div>
        </div>
      )}
      <ControlesSection>
        <h2 style={{ margin: "0 0 1.5rem 0", color: "#1F2937", fontSize: "1.1rem", fontWeight: 600 }}>
          Parâmetros de Previsão
        </h2>
        
        <ControlsGrid>
          <ControlField>
            <ControlLabel>Data de Início</ControlLabel>
            <ControlInput
              type="date"
              value={dataInicio}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDataInicio(e.target.value)}
            />
          </ControlField>

          <ControlField>
            <ControlLabel>Dias para Prever</ControlLabel>
            <ControlInput
              type="number"
              min={1}
              value={dias}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDias(Number(e.target.value))}
            />
          </ControlField>

          <ControlField style={{ gridColumn: "1 / -1" }}>
            <ControlLabel>Município</ControlLabel>
            <ControlInput
              type="text"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite o nome do município e pressione Enter"
            />
            {filteredSuggestions.length > 0 && (
              <SuggestionsWrapper>
                {filteredSuggestions.map((s) => (
                  <SuggestionItem key={s.id} onClick={() => void tryAddMunicipio(s.nome)}>
                    {normalizeMunicipio(s.nome)}
                  </SuggestionItem>
                ))}
              </SuggestionsWrapper>
            )}
          </ControlField>
          <ControlField style={{ gridColumn: "1 / -1" }}>

          {selectedMunicipios.length > 0 && (
          <MunicipiosSelectedContainer>
            <strong style={{ fontSize: "0.95rem", color: "#1F2937", marginBottom: "0.5rem", display: "block" }}>
              Municípios Selecionados ({selectedMunicipios.length}):
            </strong>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {selectedMunicipios.map((m) => (
                <MunicipioTag key={m}>
                  {m}
                  <MunicipioTagButton
                    onClick={() => setSelectedMunicipios(selectedMunicipios.filter((s) => s !== m))}
                    title="Remover município"
                  >
                    ✕
                  </MunicipioTagButton>
                </MunicipioTag>
              ))}
            </div>
          </MunicipiosSelectedContainer>
        )}
          
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                text={loading ? "Prevendo..." : "Prever"}
                onClick={handlePrever}
                variant="primary"
                style={{ minWidth: 120, opacity: loading ? 0.7 : 1 }}
              />
            </div>
          </ControlField>
        </ControlsGrid>

        
      </ControlesSection>

      {data ? (
        <ChartsGrid>
          {/* 1 - Classificação */}
          <ChartCard>
            <ChartTitle>Distribuição prevista por dia da semana</ChartTitle>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.classificacao} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <YAxis
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: 8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value) => [`${value} ocorrências`, "Previsão"]}
                />
                <Bar
                  dataKey="valor"
                  fill="#5d3bf6"
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={true}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* 2 - Cluster */}
          <ChartCard>
            <ChartTitle>Ocorrências previstas por município</ChartTitle>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                {(() => {
                  const total = data.municipios.reduce((acc, m) => acc + m.totalPrevisto, 0);
                  const pieData = data.municipios.map((m, idx) => ({
                    name: normalizeMunicipio(m.municipio),
                    value: m.totalPrevisto,
                    color: municipioColors[idx % municipioColors.length],
                  }));
                  return (
                    <>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        labelLine={false}
                        label={renderPercentLabel}
                        isAnimationActive={true}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip
                        formatter={(value, name) => [
                          `${value} ocorrências (${Math.round((Number(value) as number / (total || 1)) * 100)}%)`,
                          name as string,
                        ]}
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #E5E7EB",
                          borderRadius: 8,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                    </>
                  );
                })()}
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* 3 - Regressão (full width) */}
          <ChartCard style={{ gridColumn: "1 / -1" }}>
            <ChartTitle>Previsão de demanda consolidada</ChartTitle>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={data.regressao} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <XAxis
                  dataKey="timestamp"
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <YAxis
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: 8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value) => [`${value} ocorrências`, "Previsão"]}
                />
                <Area
                  type="monotone"
                  dataKey="valor"
                  stroke="#4C6EF5"
                  fill="#5d3bf6"
                  fillOpacity={0.15}
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </ChartsGrid>
      ) : (
        <NoDataContainer>
          <p style={{ margin: 0, color: "#6B7280", fontSize: "1rem" }}>
            Selecione pelo menos um município para visualizar as predições.
          </p>
        </NoDataContainer>
      )}

      <ChartFooter>
        <small style={{ color: "#6B7280" }}>
          * Valores estimados por um modelo preditivo treinado com dados históricos reais. As previsões indicam cenários prováveis, com taxa de acerto limitada e sujeita a variações, especialmente em municípios com poucos registros.
        </small>
      </ChartFooter>
    </PredicoesDashboardWrapper>
  );
}