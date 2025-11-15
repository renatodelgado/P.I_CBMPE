import styled, { keyframes } from "styled-components";
import { AuditStatCard, BoxInfo } from "../../components/EstilosPainel.styles";

/* Color Variables (expanded palette for more color variety, no gradients) */
const bgCard = "#ffffff";
const borderCard = "#e6edf5";
const textPrimary = "#1F2937";
const textMuted = "#6B7280";
const subtleShadow = "rgba(15, 23, 42, 0.04)";

const primaryBlue = "#5d3bf6";
const primaryGreen = "#0EA5E9";
const primaryPink = "#EC4899";
const successGreen = "#10B981";
const warningOrange = "#F59E0B";
const errorRed = "#EF4444";
const neutralGray = "#94A3B8";
const accentPurple = "#8B5CF6";
const bgLight = "#F3F4F6";
const bgHover = "#F1F8FF";

// eslint-disable-next-line react-refresh/only-export-components
export const barColors = [primaryGreen, accentPurple, primaryPink, errorRed, warningOrange, successGreen];

/* small hover float animation */
const floatUp = keyframes`
  from { transform: translateY(0px); box-shadow: 0 1px 0 rgba(0,0,0,0.02); }
  to { transform: translateY(-6px); box-shadow: 0 10px 20px rgba(2,6,23,0.06); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

export const DashboardAlert = styled(BoxInfo)`
  background-color: #fff7f6;
  border-color: #ffe6e3;
  margin-bottom: 1.5rem;
  border-left: 4px solid #fca5a5;
`;

export const AlertContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

export const AlertIndicator = styled.div`
  width: 4px;
  background-color: ${warningOrange};
  border-radius: 2px;
  align-self: stretch;
`;

export const AlertText = styled.div`
  flex: 1;
`;

export const AlertStrong = styled.strong`
  color: #7c2d12;
`;

export const AlertRegionInfo = styled.div`
  color: #7c2d12;
  font-size: 14px;
  margin-top: 6px;
`;

/* Metric card */
export const MetricCardWrapper = styled(AuditStatCard)`
  background: ${bgCard};
  border: 1px solid ${borderCard};
  box-shadow: 0 1px 0 ${subtleShadow};
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: transform 240ms ease, box-shadow 240ms ease;
  min-height: 116px;
  justify-content: space-between;

  &:hover,
  &:focus {
    animation: ${floatUp} 260ms forwards;
    cursor: pointer;
  }
`;

export const MetricHeaderRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const CardDetailsLink = styled.a`
  font-size: 13px;
  color: ${primaryBlue};
  text-decoration: none;
  padding: 6px 8px;
  border-radius: 8px;

  &:hover {
    background: ${bgHover};
  }
`;

export const MetricIconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${bgHover};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(2,6,23,0.04);
`;

export const MetricCardContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
`;

/* New left / right containers for metric card content */
export const MetricContentLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0; /* allow truncation inside flex */
`;

export const MetricContentRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 84px;
  padding-left: 8px;
`;

export const MetricValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${textPrimary};
  line-height: 1.05;
`;

export const MetricTitle = styled.div`
  font-size: 14px;
  color: ${textMuted};
`;

export const MetricMeta = styled.div`
  font-size: 12px;
  color: ${textMuted};
`;

/* adjust trend styling: larger and centered */
export const MetricTrend = styled.div<{ trend: "up" | "down" | "neutral" }>`
  font-size: 16px;
  font-weight: 700;
  color: ${(p) => (p.trend === "up" ? `${errorRed}` : p.trend === "down" ? `${successGreen}` : `${textMuted}`)};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

/* Chart header */
export const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;

  & > div:last-child {
    font-size: 14px;
    color: ${textMuted};
  }
`;

/* region chart */
export const GraficoRegiaoContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
  overflow-x: auto;
  padding: 1rem;
  position: relative;
  background: #fff;
  border-radius: 12px;
  border: 1px solid ${borderCard};

  & > div:last-child {
    display: flex;
    gap: 12px;
    align-items: flex-end;
    margin-left: 64px;
    overflow-x: auto;
    padding-bottom: 12px;
  }
`;

/* eixo Y */
export const EixoY = styled.div`
  position: absolute;
  left: 0;
  top: 12px;
  bottom: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 10px;
  border-right: 1px solid #eef2f7;
`;

export const ValorEixoY = styled.div`
  font-size: 11px;
  color: ${textMuted};
  transform: translateY(50%);
`;

/* barras regionais */
export const BarraRegiaoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 6px;
  flex: 1;
  min-width: 92px;
`;

export const BarraRegiao = styled.div<{ altura: number; color?: string }>`
  height: ${({ altura }) => altura}px;
  background: ${({ color }) => color || accentPurple};
  width: 70px;
  border-radius: 6px 6px 0 0;
  min-height: 6px;
  transition: height 700ms cubic-bezier(.2,.9,.2,1);
  box-shadow: 0 6px 12px rgba(59,130,246,0.08);
`;

export const ValorBarra = styled.div`
  font-size: 12px;
  color: ${textPrimary};
  margin-top: 8px;
  font-weight: 700;
`;

export const NomeRegiao = styled.div`
  font-size: 12px;
  color: ${textMuted};
  margin-top: 6px;
  text-align: center;
  max-width: 78px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/* mini bars (ranking / tipo) */
export const MiniBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 6px;
`;

export const MiniBarRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px 40px;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 96px 44px;
  }
`;

export const MiniBarLabel = styled.span`
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${textPrimary};
`;

export const MiniBarTrack = styled.div`
  width: 100%;
  height: 12px;
  border-radius: 8px;
  background: ${bgLight};
  overflow: hidden;
`;

export const MiniBarFill = styled.div<{ widthPct?: number; color?: string }>`
  height: 100%;
  border-radius: 8px;
  width: ${({ widthPct = 0 }) => widthPct}%;
  transition: width 650ms cubic-bezier(.2,.9,.2,1);
  background: ${({ color }) => color || primaryBlue};
`;

export const MiniBarValue = styled.span`
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  color: ${textPrimary};
`;

/* stats grid */
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 1rem;
`;

export const StatItem = styled.div<{ colorType: "primaryGreen" | "primaryBlue" | "successGreen" | "warningOrange" }>`
  background: #ffffff;
  border-radius: 10px;
  padding: 10px;
  border: 1px solid ${borderCard};
  text-align: center;
  color: ${({ colorType }) => {
    switch (colorType) {
      case "primaryGreen": return primaryGreen;
      case "primaryBlue": return primaryBlue;
      case "successGreen": return successGreen;
      case "warningOrange": return warningOrange;
      default: return textPrimary;
    }
  }};
`;

export const StatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${textPrimary};
`;

export const StatLabel = styled.div`
  font-size: 13px;
  color: ${textMuted};
`;

/* GraficoBarras styles */
export const NoDataMessage = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${textMuted};
`;

export const TotalOccurrencesContainer = styled.div`
  padding: 24px;
  text-align: center;
`;

export const TotalValue = styled.div`
  font-size: 36px;
  font-weight: 700;
`;

export const TotalLabel = styled.div`
  color: ${textMuted};
`;

export const HorizontalBarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const HorizontalDateLabel = styled.div`
  width: 120px;
  text-align: right;
  font-size: 12px;
  color: ${textPrimary};
`;

export const HorizontalBarTrack = styled.div`
  flex: 1;
  height: 12px;
  background: ${bgLight};
  border-radius: 8px;
  overflow: hidden;
`;

export const HorizontalBarFill = styled.div<{ widthPct: number; color?: string }>`
  width: ${({ widthPct }) => widthPct}%;
  height: 100%;
  transition: width 700ms cubic-bezier(.2,.9,.2,1);
  background: ${({ color }) => color || accentPurple};
`;

export const HorizontalValue = styled.div`
  width: 44px;
  text-align: right;
  font-weight: 600;
`;

export const VerticalBarContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

export const VerticalBar = styled.div<{ height: number; color?: string }>`
  height: ${({ height }) => height}px;
  width: 100%;
  max-width: 44px;
  border-radius: 6px;
  background: ${({ color }) => color || primaryBlue};
  transition: height 700ms cubic-bezier(.2,.9,.2,1);
  box-shadow: 0 2px 6px rgba(59,130,246,0.12);
`;

export const VerticalDateLabel = styled.div`
  font-size: 11px;
  color: ${textPrimary};
  text-align: center;
  white-space: nowrap;
`;

/* Additional styles */
export const PeriodSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: white;
  font-size: 14px;
`;

/* Natureza ranking styles */
export const NaturezaRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const NaturezaLabelContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 220px;
`;

export const NaturezaDot = styled.div<{ color?: string }>`
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background: ${({ color }) => color || neutralGray};
`;

export const NaturezaLabel = styled.div`
  font-size: 13px;
  color: ${textPrimary};
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
`;

export const NaturezaBarTrack = styled.div`
  flex: 1;
  height: 12px;
  background: ${bgLight};
  border-radius: 8px;
  overflow: hidden;
`;

export const NaturezaBarFill = styled.div<{ widthPct: number; color?: string }>`
  width: ${({ widthPct }) => widthPct}%;
  height: 100%;
  background: ${({ color }) => color || accentPurple};
  transition: width 650ms ease;
`;

export const NaturezaValue = styled.div`
  min-width: 44px;
  text-align: right;
  font-weight: 600;
`;

/* Modal styles */
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999; /* aumentado para garantir estar acima de mapas/heatmap */
  pointer-events: auto;
`;

export const ModalInner = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1000000; /* acima do overlay e de outros elementos que possam criar stacking context */
  animation: ${fadeIn} 200ms ease;
  max-height: 80vh;
  overflow-y: auto;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: 0;
  cursor: pointer;
  color: #666;
`;

export const ModalTitle = styled.h2`
  margin-top: 0;
  color: ${primaryBlue};
`;

export const ModalList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const ModalListItem = styled.li`
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  color: ${textPrimary};
`;

export const MasonryGrid = styled.div`
  display: flex;
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const LeftColumn = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const RightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;