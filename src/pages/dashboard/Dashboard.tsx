/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import {
  ContainerPainel,
  PageTopHeaderRow,
  PageTitle,
  PageSubtitle,
  ActionsRow,
  ResponsiveRow,
  GridColumn,
  MiniGrid,
  BoxInfo,
  SectionTitle,
} from "../../components/EstilosPainel.styles";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

import {
  DashboardAlert,
  AlertContent,
  AlertIndicator,
  AlertText,
  MetricCardWrapper,
  MetricIconBox,
  MetricCardContent,
  MetricTitle,
  MetricValue,
  MetricMeta,
  MetricTrend,
  ChartHeader,
  StatsGrid,
  StatItem,
  MetricHeaderRow,
  CardDetailsLink,
  NoDataMessage,
  PeriodSelect,
  AlertStrong,
  AlertRegionInfo,
  StatValue,
  StatLabel,
  ModalOverlay,
  ModalInner,
  CloseButton,
  ModalTitle,
  ModalList,
  ModalListItem,
  barColors,
  MetricContentLeft,
  MetricContentRight, // added
  MasonryGrid,
  LeftColumn,
  RightColumn
} from "./Dashboard.styles";

import { HeatmapOcorrenciasNatureza } from "../../components/Dashboard/HeatmapOcorrenciasNatureza";
import { BellSimpleIcon, ChartBarIcon, FireIcon, XIcon } from "@phosphor-icons/react";
import { fetchNaturezasOcorrencias, fetchOcorrencias } from "../../services/api";

// Import das funções de API do novo arquivo

// Section: Types
type NaturezaOcorrencia = {
  id: string;
  nome: string;
};

type Ocorrencia = {
  naturezaOcorrencia: NaturezaOcorrencia;
  id: string;
  dataTimestamp: number;
  localizacao?: {
    latitude: string;
    longitude: string;
    municipio: string;
    bairro?: string;
  };
  latitude?: string;
  longitude?: string;
  viatura: string;
  tipo: string;
  status: string;
  responsavel: string;
  municipio?: string;
  bairro?: string;
};

type Trend = "up" | "down" | "neutral";

type ModalType = "total" | "pendentes" | "topNatureza" | null;

// Section: Component Definition
export function DashboardOperacional() {
  // Section: State and Hooks
  const [filtroPeriodo, setFiltroPeriodo] = useState<
    "dia" | "semana" | "mes" | "bimestre" | "trimestre" | "semestre" | "ano"
  >("semana");
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [naturezas, setNaturezas] = useState<NaturezaOcorrencia[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);

  // Section: Utility Functions
  function getPeriodoAnterior(periodo: typeof filtroPeriodo, dataFimAtual: Date) {
    const fimAtual = new Date(dataFimAtual);
    const inicioAnterior = new Date(fimAtual);
    const fimAnterior = new Date(fimAtual);

    switch (periodo) {
      case "dia":
        inicioAnterior.setDate(fimAtual.getDate() - 1);
        fimAnterior.setDate(fimAtual.getDate() - 1);
        break;
      case "semana":
        inicioAnterior.setDate(fimAtual.getDate() - 13);
        fimAnterior.setDate(fimAtual.getDate() - 7);
        break;
      case "mes":
        inicioAnterior.setMonth(fimAtual.getMonth() - 1);
        fimAnterior.setMonth(fimAtual.getMonth() - 1);
        fimAnterior.setDate(new Date(fimAnterior.getFullYear(), fimAnterior.getMonth() + 1, 0).getDate());
        break;
      case "bimestre":
        inicioAnterior.setMonth(fimAtual.getMonth() - 2);
        fimAnterior.setMonth(fimAtual.getMonth() - 2);
        fimAnterior.setDate(new Date(fimAnterior.getFullYear(), fimAnterior.getMonth() + 1, 0).getDate());
        break;
      case "trimestre":
        inicioAnterior.setMonth(fimAtual.getMonth() - 3);
        fimAnterior.setMonth(fimAtual.getMonth() - 3);
        fimAnterior.setDate(new Date(fimAnterior.getFullYear(), fimAnterior.getMonth() + 1, 0).getDate());
        break;
      case "semestre":
        inicioAnterior.setMonth(fimAtual.getMonth() - 6);
        fimAnterior.setMonth(fimAtual.getMonth() - 6);
        fimAnterior.setDate(new Date(fimAnterior.getFullYear(), fimAnterior.getMonth() + 1, 0).getDate());
        break;
      case "ano":
        inicioAnterior.setFullYear(fimAtual.getFullYear() - 1);
        fimAnterior.setFullYear(fimAtual.getFullYear() - 1);
        fimAnterior.setMonth(11);
        fimAnterior.setDate(31);
        break;
      default:
        inicioAnterior.setDate(fimAtual.getDate() - 7);
        fimAnterior.setDate(fimAtual.getDate() - 1);
    }

    inicioAnterior.setHours(0, 0, 0, 0);
    fimAnterior.setHours(23, 59, 59, 999);

    return [inicioAnterior, fimAnterior] as [Date, Date];
  }

  function calcularDiferencaAtualAnterior(totalAtual: number, totalAnterior: number): { diff: number; percentual: number; sinal: Trend } {
    const diff = totalAtual - totalAnterior;
    let percentual = 0;

    if (totalAnterior > 0) {
      percentual = (diff / totalAnterior) * 100;
    } else if (totalAtual > 0) {
      percentual = 100;
    }

    const sinal: Trend = diff > 0 ? "up" : diff < 0 ? "down" : "neutral";

    return { diff, percentual, sinal };
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  const formatDateCompact = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;

  // Section: Data Fetching
  useEffect(() => {
    async function fetchData() {
      try {
        // Usando as funções importadas do api.ts
        const [ocorrenciasData, naturezasData] = await Promise.all([
          fetchOcorrencias(),
          fetchNaturezasOcorrencias(),
        ]);

        setNaturezas(naturezasData);

        const mapped: Ocorrencia[] = Array.isArray(ocorrenciasData)
          ? ocorrenciasData.map((o: any) => {
            const dt = new Date(o.dataHoraChamada || o.dataHora || Date.now());
            return {
              id: o.numeroOcorrencia || `#OCR-${o.id}`,
              dataTimestamp: dt.getTime(),
              naturezaOcorrencia: o.naturezaOcorrencia ? { id: o.naturezaOcorrencia.id, nome: o.naturezaOcorrencia.nome } : { id: "0", nome: "N/A" },
              localizacao: o.localizacao
                ? {
                  latitude: o.localizacao.latitude,
                  longitude: o.localizacao.longitude,
                  municipio: o.localizacao.municipio,
                  bairro: o.localizacao.bairro,
                }
                : undefined,
              latitude: o.localizacao?.latitude,
              longitude: o.localizacao?.longitude,
              viatura: o.viatura ? `${o.viatura.tipo}-${o.viatura.numero}` : "Sem viatura",
              tipo: o.tipo?.nome || o.tipo || "N/A",
              status:
                o.statusAtendimento === "pendente"
                  ? "Pendente"
                  : o.statusAtendimento === "em_andamento"
                    ? "Em andamento"
                    : o.statusAtendimento === "concluida"
                      ? "Concluída"
                      : o.statusAtendimento === "nao_atendido"
                        ? "Não Atendida"
                        : "Desconhecido",
              responsavel: o.usuario?.nome || "N/A",
              municipio: o.localizacao?.municipio || undefined,
            };
          })
          : [];

        setOcorrencias(mapped);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    }
    fetchData();
  }, []);

  // Section: Memoized Computations
  const [dataInicio, dataFim] = useMemo(() => {
    const hoje = new Date();
    const inicio = new Date(hoje);
    const fim = new Date(hoje);

    switch (filtroPeriodo) {
      case "dia":
        break;
      case "semana":
        inicio.setDate(hoje.getDate() - 6);
        break;
      case "mes":
        inicio.setMonth(hoje.getMonth() - 1);
        break;
      case "bimestre":
        inicio.setMonth(hoje.getMonth() - 2);
        break;
      case "trimestre":
        inicio.setMonth(hoje.getMonth() - 3);
        break;
      case "semestre":
        inicio.setMonth(hoje.getMonth() - 6);
        break;
      case "ano":
        inicio.setFullYear(hoje.getFullYear() - 1);
        break;
      default:
        inicio.setDate(hoje.getDate() - 6);
    }
    inicio.setHours(0, 0, 0, 0);
    fim.setHours(23, 59, 59, 999);
    return [inicio, fim];
  }, [filtroPeriodo]);

  const dadosGraficoPeriodo = useMemo(() => {
    const ocorrenciasNoPeriodo = ocorrencias.filter((o) => o.dataTimestamp >= dataInicio.getTime() && o.dataTimestamp <= dataFim.getTime());

    let binType: 'hour' | 'day' | 'month' = 'day';
    if (filtroPeriodo === 'dia') {
      binType = 'hour';
    } else if (['semestre', 'ano'].includes(filtroPeriodo)) {
      binType = 'month';
    }

    const bins: string[] = [];
    const counts: Record<string, number> = {};

    if (binType === 'hour') {
      // Hourly bins for 'dia'
      for (let hour = 0; hour < 24; hour++) {
        const label = `${pad(hour)}:00`;
        bins.push(label);
        counts[label] = 0;
      }
      ocorrenciasNoPeriodo.forEach((o) => {
        const dt = new Date(o.dataTimestamp);
        const label = `${pad(dt.getHours())}:00`;
        counts[label] = (counts[label] || 0) + 1;
      });
    } else if (binType === 'day') {
      // Daily bins
      const current = new Date(dataInicio);
      while (current <= dataFim) {
        const label = formatDateCompact(current);
        bins.push(label);
        counts[label] = 0;
        current.setDate(current.getDate() + 1);
      }
      ocorrenciasNoPeriodo.forEach((o) => {
        const dt = new Date(o.dataTimestamp);
        const label = formatDateCompact(dt);
        counts[label] = (counts[label] || 0) + 1;
      });
    } else {
      // Monthly bins
      const current = new Date(dataInicio.getFullYear(), dataInicio.getMonth(), 1);
      const endMonth = new Date(dataFim.getFullYear(), dataFim.getMonth(), 1);
      while (current <= endMonth) {
        const label = `${pad(current.getMonth() + 1)}/${current.getFullYear()}`;
        bins.push(label);
        counts[label] = 0;
        current.setMonth(current.getMonth() + 1);
      }
      ocorrenciasNoPeriodo.forEach((o) => {
        const dt = new Date(o.dataTimestamp);
        const label = `${pad(dt.getMonth() + 1)}/${dt.getFullYear()}`;
        counts[label] = (counts[label] || 0) + 1;
      });
    }

    const dados = bins.map((label) => ({ data: label, ocorrencias: counts[label] || 0 }));
    return { dados };
  }, [filtroPeriodo, ocorrencias, dataInicio, dataFim]);

  const metricasPeriodo = useMemo(() => {
    const [inicioAnterior, fimAnterior] = getPeriodoAnterior(filtroPeriodo, dataFim);

    const totalAtual = ocorrencias.filter((o) => o.dataTimestamp >= dataInicio.getTime() && o.dataTimestamp <= dataFim.getTime()).length;

    const totalAnterior = ocorrencias.filter((o) => o.dataTimestamp >= inicioAnterior.getTime() && o.dataTimestamp <= fimAnterior.getTime()).length;

    const pendentesAtual = ocorrencias.filter((o) => o.dataTimestamp >= dataInicio.getTime() && o.dataTimestamp <= dataFim.getTime() && o.status === "Pendente").length;

    const pendentesAnterior = ocorrencias.filter((o) => o.dataTimestamp >= inicioAnterior.getTime() && o.dataTimestamp <= fimAnterior.getTime() && o.status === "Pendente").length;

    return {
      total: calcularDiferencaAtualAnterior(totalAtual, totalAnterior),
      pendentes: calcularDiferencaAtualAnterior(pendentesAtual, pendentesAnterior),
    };
  }, [ocorrencias, dataInicio, dataFim, filtroPeriodo]);

  const alertaPeriodo = useMemo(() => {
    const [inicioAnterior, fimAnterior] = getPeriodoAnterior(filtroPeriodo, dataFim);

    const totalAtual = ocorrencias.filter((o) => o.dataTimestamp >= dataInicio.getTime() && o.dataTimestamp <= dataFim.getTime()).length;

    const totalAnterior = ocorrencias.filter((o) => o.dataTimestamp >= inicioAnterior.getTime() && o.dataTimestamp <= fimAnterior.getTime()).length;

    const aumento = totalAtual - totalAnterior;
    if (aumento <= 0) return null;

    const contagemAtual: Record<string, number> = {};
    const contagemAnterior: Record<string, number> = {};

    ocorrencias.forEach((o) => {
      if (!o.localizacao) return;
      const chave = o.localizacao.municipio + (o.localizacao.bairro ? ` - ${o.localizacao.bairro}` : "");
      if (o.dataTimestamp >= dataInicio.getTime() && o.dataTimestamp <= dataFim.getTime()) {
        contagemAtual[chave] = (contagemAtual[chave] || 0) + 1;
      } else if (o.dataTimestamp >= inicioAnterior.getTime() && o.dataTimestamp <= fimAnterior.getTime()) {
        contagemAnterior[chave] = (contagemAnterior[chave] || 0) + 1;
      }
    });

    let maiorRegiao = "";
    let maiorCrescimento = 0;

    Object.keys(contagemAtual).forEach((regiao) => {
      const diff = (contagemAtual[regiao] || 0) - (contagemAnterior[regiao] || 0);
      if (diff > 0 && diff > maiorCrescimento) {
        maiorCrescimento = diff;
        maiorRegiao = regiao;
      }
    });

    return { aumento, maiorRegiao, aumentoRegiao: maiorCrescimento };
  }, [ocorrencias, filtroPeriodo, dataInicio, dataFim]);

  const estatisticasRapidas = useMemo(() => {
    const ocorrenciasNoPeriodo = ocorrencias.filter((o) => o.dataTimestamp >= dataInicio.getTime() && o.dataTimestamp <= dataFim.getTime());

    const counts = {
      pendente: 0,
      em_andamento: 0,
      concluida: 0,
      nao_atendida: 0,
    };

    ocorrenciasNoPeriodo.forEach((o) => {
      if (o.status === "Pendente") counts.pendente++;
      else if (o.status === "Em andamento") counts.em_andamento++;
      else if (o.status === "Concluída") counts.concluida++;
      else if (o.status === "Não Atendida") counts.nao_atendida++;
    });

    return counts;
  }, [ocorrencias, dataInicio, dataFim]);

  const dadosPorNatureza = useMemo(() => {
    const ocorrenciasNoPeriodo = ocorrencias.filter((o) => o.dataTimestamp >= dataInicio.getTime() && o.dataTimestamp <= dataFim.getTime());

    const counts: Record<string, number> = {};

    naturezas.forEach((n) => {
      counts[n.nome] = 0;
    });

    ocorrenciasNoPeriodo.forEach((o) => {
      const nome = o.naturezaOcorrencia?.nome;
      if (nome) counts[nome] = (counts[nome] || 0) + 1;
    });

    const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a);
    const topNatureza = sorted.length > 0 ? sorted[0][0] : "N/A";

    return { counts, sorted, topNatureza };
  }, [ocorrencias, naturezas, dataInicio, dataFim]);

  const dadosPorMunicipio = useMemo(() => {
    const ocorrenciasNoPeriodo = ocorrencias.filter((o) => o.dataTimestamp >= dataInicio.getTime() && o.dataTimestamp <= dataFim.getTime());

    const counts: Record<string, number> = {};

    ocorrenciasNoPeriodo.forEach((o) => {
      if (!o.municipio) return;
      const chave = o.bairro ? `${o.municipio} - ${o.bairro}` : o.municipio;
      counts[chave] = (counts[chave] || 0) + 1;
    });

    const sortedTop5 = Object.entries(counts).sort(([, a], [, b]) => b - a).slice(0, 5);

    return Object.fromEntries(sortedTop5);
  }, [ocorrencias, dataInicio, dataFim]);

  const ocorrenciasNoPeriodo = useMemo(
    () => ocorrencias.filter((o) => o.dataTimestamp >= dataInicio.getTime() && o.dataTimestamp <= dataFim.getTime()),
    [ocorrencias, dataInicio, dataFim]
  );

  const pendentesNoPeriodo = useMemo(
    () => ocorrenciasNoPeriodo.filter((o) => o.status === "Pendente"),
    [ocorrenciasNoPeriodo]
  );

  const topNaturezaNoPeriodo = useMemo(
    () =>
      ocorrenciasNoPeriodo.filter((o) => o.naturezaOcorrencia?.nome === dadosPorNatureza.topNatureza),
    [ocorrenciasNoPeriodo, dadosPorNatureza.topNatureza]
  );

  // Section: Small Reusable Components
  const MetricCard = ({
    title,
    value,
    meta,
    icon,
    trend,
    type,
  }: {
    title: string;
    value: string | number;
    meta?: string;
    icon: React.ReactNode;
    trend?: { type: Trend; text: string } | null;
    type: ModalType;
  }) => {
    return (
      <MetricCardWrapper tabIndex={0}>
        <MetricHeaderRow>
          <MetricIconBox>{icon}</MetricIconBox>
          <CardDetailsLink
            onClick={(e) => {
              e.preventDefault();
              setModalType(type);
              setShowModal(true);
            }}
          >
            Ver detalhes
          </CardDetailsLink>
        </MetricHeaderRow>

        <MetricCardContent>
          <MetricContentLeft>
            <MetricValue>{value}</MetricValue>
            <MetricTitle>{title}</MetricTitle>
            {meta && <MetricMeta>{meta}</MetricMeta>}
          </MetricContentLeft>

          <MetricContentRight>
            {trend && <MetricTrend trend={trend.type}>{trend.text}</MetricTrend>}
          </MetricContentRight>
        </MetricCardContent>
      </MetricCardWrapper>
    );
  };

  const GraficoLinha = ({
    dados,
  }: {
    dados: { data: string; ocorrencias: number }[];
  }) => {
    if (!dados || dados.length === 0) {
      return <NoDataMessage>Nenhuma ocorrência no período selecionado</NoDataMessage>;
    }

    return (
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={dados} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="data" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
          <YAxis dataKey="ocorrencias" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="ocorrencias"
            stroke="#ff0000"
            fill="#ffe6e6"
            fillOpacity={1}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const GraficoPorTipo = ({
    dados,
  }: {
    dados: [string, number][];
  }) => {
    if (!dados || dados.length === 0) {
      return <NoDataMessage>Nenhuma informação</NoDataMessage>;
    }

    const max = Math.max(...dados.map(([, v]) => v), 1);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {dados.map(([label, value], i) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {/* Label em uma linha */}
            <div style={{ fontSize: 13, fontWeight: 600, color: "#222", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {label}
            </div>

            {/* Barra horizontal com número à direita */}
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <div style={{ flex: 1, height: 14, background: "#f0f0f0", borderRadius: 8, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${(value / max) * 100}%`,
                    height: "100%",
                    background: barColors[i % barColors.length],
                  }}
                />

              </div>
              <div style={{ minWidth: 20, textAlign: "right", fontWeight: 700 }}>{value}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const GraficoPorMunicipio = ({
    dados,
  }: {
    dados: Record<string, number>;
  }) => {
    const entries = Object.entries(dados).sort(([, a], [, b]) => b - a);
    if (entries.length === 0) {
      return <NoDataMessage>Nenhuma ocorrência no período</NoDataMessage>;
    }

    // Abreviação que preserva o início e o fim do label (ex.: "São Paulo - Centro" -> "São P...entro")
    const abbreviateLabel = (label: string, maxLength: number = 19) => {
      if (!label || label.length <= maxLength) return label;
      const keep = maxLength - 3; // espaço para "..."
      const front = Math.ceil(keep / 2);
      return `${label.slice(0, front)}...`;
    };

    // Formata dados para Recharts com label abreviado, mantendo o nome completo em municipioFull
    const chartData = entries.map(([municipio, quantidade]) => ({
      municipioFull: municipio,
      municipio: abbreviateLabel(municipio),
      quantidade,
    }));

    // Custom tick renderer para rotacionar sem cortar o início (usa label abreviado)
    const CustomizedTick = ({ x, y, payload }: any) => {
      return (
        <g transform={`translate(${x},${y})`}>
          <text x={0} y={0} dy={16} textAnchor="end" transform="rotate(-45)" fontSize={12}>
            {payload.value}
          </text>
        </g>
      );
    };

    // Tooltip customizado que mostra o nome completo
    const CustomTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        const entry = payload[0].payload;
        return (
          <div style={{ background: "#fff", padding: 8, border: "1px solid #ccc", borderRadius: 4 }}>
            <div style={{ fontWeight: 700 }}>{entry.municipioFull}</div>
            <div>Quantidade: {entry.quantidade}</div>
          </div>
        );
      }
      return null;
    };

    return (
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="municipio" tick={<CustomizedTick />} interval={0} height={60} />
          <YAxis dataKey="quantidade" tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="quantidade" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={`cell-${entry.municipioFull}-${i}`} fill={barColors[i % barColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };


  const renderModalContent = () => {
    let title = "";
    let list: Ocorrencia[] = [];
    switch (modalType) {
      case "total":
        title = "Total de Ocorrências no Período";
        list = ocorrenciasNoPeriodo;
        break;
      case "pendentes":
        title = "Ocorrências Pendentes no Período";
        list = pendentesNoPeriodo;
        break;
      case "topNatureza":
        title = `Ocorrências de ${dadosPorNatureza.topNatureza} no Período`;
        list = topNaturezaNoPeriodo;
        break;
      default:
        return null;
    }

    return (
      <>
        <ModalTitle>{title}</ModalTitle>
        {list.length === 0 ? (
          <p>Nenhuma ocorrência encontrada.</p>
        ) : (
          <ModalList>
            {list.map((o) => (
              <ModalListItem key={o.id}>
                <strong>{o.id}</strong> - {new Date(o.dataTimestamp).toLocaleString()} - {o.naturezaOcorrencia.nome} - {o.status} - {o.municipio || "N/A"}
              </ModalListItem>
            ))}
          </ModalList>
        )}
      </>
    );
  };

  // Section: Main Render
  return (
    <ContainerPainel>
      <PageTopHeaderRow>
        <div>
          <PageTitle>Dashboard Operacional</PageTitle>
          <PageSubtitle>Visão geral das métricas e indicadores operacionais</PageSubtitle>
        </div>
        <ActionsRow>
          <div>
            <PeriodSelect
              value={filtroPeriodo}
              onChange={(e) => setFiltroPeriodo(e.target.value as any)}
            >
              <option value="dia">Hoje</option>
              <option value="semana">Última Semana</option>
              <option value="mes">Último Mês</option>
              <option value="bimestre">Último Bimestre</option>
              <option value="trimestre">Último Trimestre</option>
              <option value="semestre">Último Semestre</option>
              <option value="ano">Último Ano</option>
            </PeriodSelect>
          </div>
        </ActionsRow>
      </PageTopHeaderRow>

      {alertaPeriodo && (
        <DashboardAlert>
          <AlertContent>
            <AlertIndicator />
            <AlertText>
              <AlertStrong>
                Alerta: Aumento de {alertaPeriodo.aumento} ocorrência(s) em relação{" "}
                {filtroPeriodo === "dia"
                  ? "a ontem"
                  : filtroPeriodo === "semana"
                    ? "à semana passada"
                    : filtroPeriodo === "mes"
                      ? "ao mês passado"
                      : filtroPeriodo === "bimestre"
                        ? "ao bimestre anterior"
                        : filtroPeriodo === "trimestre"
                          ? "ao trimestre anterior"
                          : filtroPeriodo === "semestre"
                            ? "ao semestre anterior"
                            : "ao ano passado"}
              </AlertStrong>
              {alertaPeriodo.maiorRegiao && alertaPeriodo.aumentoRegiao > 0 && (
                <AlertRegionInfo>
                  Região com maior crescimento: {alertaPeriodo.maiorRegiao} ({alertaPeriodo.aumentoRegiao} ocorrência(s) a mais)
                </AlertRegionInfo>
              )}
            </AlertText>
          </AlertContent>
        </DashboardAlert>
      )}

      <ResponsiveRow>
        <HeatmapOcorrenciasNatureza periodo={{ inicio: dataInicio.toISOString(), fim: dataFim.toISOString() }} />
      </ResponsiveRow>

      <ResponsiveRow>
        <GridColumn weight={2}>
          <MiniGrid>
            <MetricCard
              title="Total de Ocorrências"
              value={ocorrenciasNoPeriodo.length}
              meta={`${filtroPeriodo === "semana" ? "Última semana" : filtroPeriodo}`}
              icon={<ChartBarIcon size={20} weight="fill" color={barColors[0]} />}
              trend={metricasPeriodo.total.sinal !== "neutral" ? { type: metricasPeriodo.total.sinal, text: `${metricasPeriodo.total.sinal === "up" ? "▲" : "▼"} ${Math.abs(metricasPeriodo.total.percentual).toFixed(1)}%` } : null}
              type="total"
            />

            <MetricCard
              title="Ocorrências Pendentes"
              value={pendentesNoPeriodo.length}
              meta="status"
              icon={<BellSimpleIcon size={20} weight="fill" color={barColors[1]} />}
              trend={metricasPeriodo.pendentes.sinal !== "neutral" ? { type: metricasPeriodo.pendentes.sinal, text: `${metricasPeriodo.pendentes.sinal === "up" ? "+" : "—"} ${Math.abs(metricasPeriodo.pendentes.diff)}` } : null}
              type="pendentes"
            />

            <MetricCard
              title={`${dadosPorNatureza.topNatureza} (Top 1)`}
              value={dadosPorNatureza.sorted.length > 0 ? dadosPorNatureza.sorted[0][1] : 0}
              meta="Natureza mais comum"
              icon={<FireIcon size={20} weight="fill" color={barColors[2]} />}
              trend={null}
              type="topNatureza"
            />
          </MiniGrid>
        </GridColumn>
      </ResponsiveRow>

      <ResponsiveRow>
        <MasonryGrid>
          <LeftColumn>
            <BoxInfo>
              <ChartHeader>
                <SectionTitle>Ocorrência por Período</SectionTitle>
                <div>
                  {filtroPeriodo === "dia" && "Último dia"}
                  {filtroPeriodo === "semana" && "Última semana"}
                  {filtroPeriodo === "mes" && "Último mês"}
                  {filtroPeriodo === "bimestre" && "Último bimestre"}
                  {filtroPeriodo === "trimestre" && "Último trimestre"}
                  {filtroPeriodo === "semestre" && "Último semestre"}
                  {filtroPeriodo === "ano" && "Último ano"}
                </div>
              </ChartHeader>

              <GraficoLinha dados={dadosGraficoPeriodo.dados} />
            </BoxInfo>

            <BoxInfo>
              <SectionTitle>Ocorrência por Município</SectionTitle>
              <GraficoPorMunicipio dados={dadosPorMunicipio} />
            </BoxInfo>
          </LeftColumn>

          <RightColumn>
            <BoxInfo>
              <SectionTitle>Ocorrência por Tipo</SectionTitle>
              <GraficoPorTipo dados={dadosPorNatureza.sorted} />
            </BoxInfo>

            <BoxInfo>
              <SectionTitle>Estatísticas Rápidas</SectionTitle>
              <StatsGrid>
                <StatItem colorType="primaryGreen">
                  <StatValue>{estatisticasRapidas.pendente}</StatValue>
                  <StatLabel>Pendentes</StatLabel>
                </StatItem>

                <StatItem colorType="primaryBlue">
                  <StatValue>{estatisticasRapidas.em_andamento}</StatValue>
                  <StatLabel>Em andamento</StatLabel>
                </StatItem>

                <StatItem colorType="successGreen">
                  <StatValue>{estatisticasRapidas.concluida}</StatValue>
                  <StatLabel>Concluídas</StatLabel>
                </StatItem>

                <StatItem colorType="warningOrange">
                  <StatValue>{estatisticasRapidas.nao_atendida}</StatValue>
                  <StatLabel>Não atendidas</StatLabel>
                </StatItem>
              </StatsGrid>
            </BoxInfo>
          </RightColumn>
        </MasonryGrid>
      </ResponsiveRow>

      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalInner onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setShowModal(false)}>
              <XIcon size={24} />
            </CloseButton>
            {renderModalContent()}
          </ModalInner>
        </ModalOverlay>
      )}
    </ContainerPainel>
  );
}