// src/pages/PredicoesDashboard.tsx
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter,
  AreaChart, Area
} from "recharts";
import { fetchMunicipiosPE, fetchPrevisoes } from "../../services/api";
import type { Municipio } from "../../services/municipio_bairro";
import { PredicoesDashboardWrapper, ControlesSection, ControlsGrid, ControlField, ControlLabel, ControlInput, MunicipiosSelectedContainer, MunicipioTag, MunicipioTagButton, ChartsGrid, ChartCard, ChartTitle, NoDataContainer, ChartFooter } from "./PredicoesDashboard.styles";
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
  clusterId: number;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMunicipiosPE().then(setMunicipios);
  }, []);

  useEffect(() => {
    if (selectedMunicipios.length === 0) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all(
      selectedMunicipios.map((m) => fetchPrevisoes(m, dataInicio, dias))
    )
      .then((responses) => {
        const valid = responses.filter((r) => r !== null) as PrevisaoResponse[];

        if (valid.length === 0) {
          setData(null);
          setLoading(false);
          return;
        }

        // Coletar todas as previsões
        const allPrevisoes: { data: string; previsao: number; municipio: string }[] = [];
        valid.forEach((r) => {
          r.previsoes.forEach((p) => {
            allPrevisoes.push({ ...p, municipio: r.municipio });
          });
        });

        // Regressão: soma por data
        const dateSums = new Map<string, number>();
        allPrevisoes.forEach((p) => {
          dateSums.set(p.data, (dateSums.get(p.data) || 0) + p.previsao);
        });
        const regressao: RegressaoResponse[] = Array.from(dateSums, ([timestamp, valor]) => ({ timestamp, valor })).sort(
          (a, b) => a.timestamp.localeCompare(b.timestamp)
        );

        // Classificação: soma por dia da semana
        const weekdaySums = new Map<number, number>();
        allPrevisoes.forEach((p) => {
          const d = new Date(p.data);
          const wd = d.getDay(); // 0=Dom, 1=Seg, ...
          weekdaySums.set(wd, (weekdaySums.get(wd) || 0) + p.previsao);
        });
        const labels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
        const classificacao: ClassificacaoResponse[] = labels.map((label, i) => ({
          label,
          valor: weekdaySums.get(i) || 0,
        }));

        // Clusters: pontos baseados nos dados, clusterId por município
        const munMap = new Map<string, number>();
        let cid = 0;
        valid.forEach((r) => {
          if (!munMap.has(r.municipio)) munMap.set(r.municipio, cid++);
        });
        const clusters: ClusterResponse[] = allPrevisoes.map((p, idx) => ({
          x: idx % dias,
          y: p.previsao,
          clusterId: munMap.get(p.municipio)!,
        }));

        // Municípios: soma total por município
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
  }, [selectedMunicipios, dataInicio, dias]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const term = searchTerm.trim().toLowerCase();
      const found = municipios.find((m) => m.nome.toLowerCase() === term);
      if (found && !selectedMunicipios.includes(found.nome)) {
        setSelectedMunicipios([...selectedMunicipios, found.nome]);
        setSearchTerm("");
      }
    }
  };

  if (loading) return <p style={{ padding: 24, textAlign: "center" }}>Carregando predições...</p>;

  return (
    <PredicoesDashboardWrapper>
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
          </ControlField>
        </ControlsGrid>

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
            <ChartTitle>Agrupamento de padrões por município</ChartTitle>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <XAxis
                  dataKey="x"
                  name="Dia"
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <YAxis
                  dataKey="y"
                  name="Previsão"
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
                  formatter={(value) => `${value}`}
                />
                <Scatter
                  data={data.clusters}
                  fill="#37B24D"
                  fillOpacity={0.7}
                  isAnimationActive={true}
                />
              </ScatterChart>
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

          {/* 4 - Municípios */}
          <ChartCard style={{ gridColumn: "1 / -1" }}>
            <ChartTitle>Ocorrências previstas por município</ChartTitle>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={data.municipios}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 200, bottom: 10 }}
              >
                <XAxis type="number" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={{ stroke: "#E5E7EB" }} />
                <YAxis
                  type="category"
                  dataKey="municipio"
                  tick={{ fill: "#6B7280", fontSize: 11 }}
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: 8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value) => `${value} ocorrências`}
                />
                <Bar
                  dataKey="totalPrevisto"
                  fill="#2F9E44"
                  radius={[0, 8, 8, 0]}
                  isAnimationActive={true}
                />
              </BarChart>
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
          * Valores gerados por modelos preditivos com base em dados históricos.
        </small>
      </ChartFooter>
    </PredicoesDashboardWrapper>
  );
}