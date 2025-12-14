import { useState } from "react";
import {
  ContainerPainel,
  PageTopHeaderRow,
  PageTitle,
  PageSubtitle,
  ActionsRow,
  BoxInfo,
  SectionTitle,
} from "../../components/EstilosPainel.styles";
import { PeriodSelect } from "./Dashboard.styles";
import { DashboardHistorico, type FiltroPeriodo } from "./DashboardHistorico";
import PredicoesDashboard from "./PredicoesDashboard";

export function DashboardOperacional() {
  const [abaAtiva, setAbaAtiva] = useState<"operacional" | "previsoes">("operacional");
  const [filtroPeriodo, setFiltroPeriodo] = useState<FiltroPeriodo>("semana");

  return (
    <ContainerPainel>
      <PageTopHeaderRow>
        <div>
          <PageTitle>Dashboard</PageTitle>
          <PageSubtitle>Métricas históricas e indicadores operacionais</PageSubtitle>
        </div>
        <ActionsRow>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setAbaAtiva("operacional")}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
                background: abaAtiva === "operacional" ? "#4C6EF5" : "#E9ECEF",
                color: abaAtiva === "operacional" ? "#fff" : "#333",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Operacional
            </button>

            <button
              onClick={() => setAbaAtiva("previsoes")}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
                background: abaAtiva === "previsoes" ? "#4C6EF5" : "#E9ECEF",
                color: abaAtiva === "previsoes" ? "#fff" : "#333",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Previsões
            </button>
          </div>

          {abaAtiva === "operacional" && (
            <div>
              <PeriodSelect
                value={filtroPeriodo}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFiltroPeriodo(e.target.value as FiltroPeriodo)}
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
          )}

          {abaAtiva === "previsoes" && (
            <div>
              {/* Espaço reservado para futuros controles específicos da aba de Previsões */}
            </div>
          )}
        </ActionsRow>
      </PageTopHeaderRow>

      {abaAtiva === "operacional" ? (
        <DashboardHistorico filtroPeriodo={filtroPeriodo} />
      ) : (
        <BoxInfo>
          <SectionTitle>Previsões e Tendências</SectionTitle>
          <PredicoesDashboard />
        </BoxInfo>
      )}
    </ContainerPainel>
  );
}