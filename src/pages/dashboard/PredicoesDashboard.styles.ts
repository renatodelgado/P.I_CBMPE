import styled from "styled-components";
import { BoxInfo } from "../../components/EstilosPainel.styles";

const bgCard = "#ffffff";
const borderCard = "#e6edf5";
const textPrimary = "#1F2937";
const textMuted = "#6B7280";
const subtleShadow = "rgba(15, 23, 42, 0.04)";
const bgLight = "#F3F4F6";

export const PredicoesDashboardWrapper = styled.div`
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const ControlesSection = styled(BoxInfo)`
  background: ${bgCard};
  border: 1px solid ${borderCard};
  box-shadow: 0 1px 0 ${subtleShadow};
  border-radius: 12px;
  padding: 2rem;
`;

export const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ControlField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ControlLabel = styled.label`
  font-weight: 600;
  color: ${textPrimary};
  font-size: 0.95rem;
`;

export const ControlInput = styled.input`
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.95rem;
  background-color: #f8fafc;
  color: ${textPrimary};
  transition: all 240ms ease;

  &:focus {
    outline: none;
    border-color: #5d3bf6;
    background-color: #ffffff;
    box-shadow: 0 0 0 3px rgba(93, 59, 246, 0.1);
  }

  &::placeholder {
    color: ${textMuted};
  }
`;

export const MunicipiosSelectedContainer = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${borderCard};
`;

export const MunicipioTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #EEF2FF;
  color: #5d3bf6;
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid #C7D2FE;
  transition: all 240ms ease;

  &:hover {
    background: #DDD6FE;
    border-color: #A78BFA;
  }
`;

export const MunicipioTagButton = styled.button`
  background: transparent;
  border: none;
  color: #5d3bf6;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 200ms ease;

  &:hover {
    color: #4C2D9F;
  }
`;

export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

export const ChartCard = styled(BoxInfo)`
  background: ${bgCard};
  border: 1px solid ${borderCard};
  box-shadow: 0 1px 0 ${subtleShadow};
  border-radius: 12px;
  padding: 1.5rem;
  transition: transform 240ms ease, box-shadow 240ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
  }
`;

export const ChartTitle = styled.h3`
  margin: 0 0 1.25rem 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: ${textPrimary};
  padding-bottom: 0.75rem;
  border-bottom: 2px solid ${bgLight};
`;

export const NoDataContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: ${bgCard};
  border: 2px dashed ${borderCard};
  border-radius: 12px;
  padding: 2rem;
`;

export const ChartFooter = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 1rem;
  border-top: 1px solid ${borderCard};
  text-align: center;
`;
