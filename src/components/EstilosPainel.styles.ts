import styled from "styled-components";

export const PageTopHeader = styled.header`
  margin-top: 6rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const PageTitle = styled.h1`
  font-size: 1.6rem;
  margin: 0;
  color: #0b1220;
`;

export const PageSubtitle = styled.p`
  color: #64748b;
  margin-top: 0.35rem;
`;

export const RequiredNotice = styled.p`
  font-size: 0. ninerem;
  color: #334155;
  margin: 0.35rem 0 0;
  span {
    color: #dc2625;
    font-weight: 700;
    margin-right: 0.35rem;
  }
`;

export const ContainerPainel = styled.div`
  margin: 0 auto;
  color: #1e293b;
  width: 100%;
`;

export const BoxInfo = styled.section`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
`;

export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-top: 0;
  margin-bottom: 1.25rem;

  svg {
    color: #dc2625;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  @media (min-width: 1280px) {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
`;

interface GridColumnProps {
  weight?: number;
}

export const GridColumn = styled.div<GridColumnProps>`
  flex: ${(props) => props.weight || 1};
`;

export const ResponsiveRow = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  label {
    font-weight: 500;
    color: #334155;
  }

  label.required::after {
    content: " *";
    color: #dc2625;
    margin-left: 0.25rem;
  }

  input,
  select,
  textarea {
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 0.6rem;
    font-size: 0.95rem;
    background-color: #f8fafc;
    &:focus {
      outline: none;
      border-color: #2563eb;
      background-color: #ffffff;
    }
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }
`;

export const FullField = styled(Field)`
  grid-column: 1 / -1;
`;

export const MapBox = styled.div`
  background-color: #f1f5f9;
  border: 1px dashed #cbd5e1;
  min-height: 90px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 0;
`;

export const MapFullBox = styled(MapBox)`
  height: 100%;
  padding: 0;
`;

export const MapPlaceholder = styled(MapBox)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: #64748b;
  height: 100%;
  width: 100%;
`;

/* Small, reusable message inside map area (loading / not found) */
export const MapMessage = styled.div`
  padding: 12px;
  color: #64748b;
`;

/* Person / vítima card */
export const PersonCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  background: #fff;
`;

/* Header row for person card (title + remove) */
export const PersonCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

/* Remove button used inside person card */
export const PersonRemoveButton = styled.button`
  background: transparent;
  border: 1px solid #ef4444;
  color: #ef4444;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
`;

/* new: team / busca / chips */
export const TeamContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const TeamSearchWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;

  position: relative;
  z-index: 0;
`;

export const TeamSearchInput = styled.input`
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0.6rem;
  font-size: 0.95rem;
  background-color: #f8fafc;
  &:focus {
    outline: none;
    border-color: #2563eb;
    background-color: #ffffff;
  }
`;

export const TeamResults = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 100%;
  z-index: 999;
  border: 1px solid #ddd;
  border-radius: 6px;
  max-height: 6rem;
  overflow-y: auto;
  background: #fff;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.12);

  > div {
    padding: 8px;
    cursor: pointer;
    border-bottom: 1px solid #f3f4f6;
    &:hover {
      background: #f1f5f9;
    }
  }
`;

export const TeamBox = styled.div`
  width: 100%;
  box-sizing: border-box;
  height: 70px;
  overflow-y: auto;

  border: 1px solid #e6eef8;
  background: #f8fbff;
  padding: 8px;
  border-radius: 8px;

  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 8px;

  .placeholder {
    color: #64748b;
    font-size: 14px;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 8px;
  }
`;

export const TeamChip = styled.div`
  background: #eef2ff;
  padding: 4px 6px;
  border-radius: 6px;
  display: flex;
  gap: 6px;
  align-items: center;

  span {
    font-size: 0.8rem;
    line-height: 1;
  }

  button {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 13px;
    line-height: 1;
    padding: 0;
  }
`;

export const UploadArea = styled.div`
  border: 2px dashed #cbd5e1;
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  background: #f8fafc;
  cursor: pointer;
  input {
    margin-top: 1rem;
  }
`;

export const MapRow = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: nowrap;
  align-items: stretch; /* faz os filhos terem a mesma altura */

  /* garantir que o campo do mapa ocupe o espaço restante */
  > div {
    flex: 1 1 0;
    min-width: 0;
  }
`;

/* Coords column — largura fixa (um field "normal") */
export const CoordsColumn = styled.div`
  flex: 0 0 260px; /* largura fixa para latitude/longitude */
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

/* Adicionado: Toggle switch simples (estilo liga/desliga) */
export const ToggleSwitch = styled.button<{ active?: boolean }>`
  width: 52px;
  height: 28px;
  background: ${(p) => (p.active ? "#16a34a" : "#e5e7eb")};
  border: none;
  border-radius: 999px;
  position: relative;
  cursor: pointer;
  transition: background 0.18s ease;
  padding: 0;
  box-shadow: none;
  display: inline-block;
  vertical-align: middle;

  &:focus {
    outline: 3px solid rgba(37,99,235,0.18);
    outline-offset: 2px;
  }

  &::after {
    content: "";
    position: absolute;
    top: 3px;
    left: ${(p) => (p.active ? "calc(100% - 3px - 22px)" : "3px")};
    width: 22px;
    height: 22px;
    background: #ffffff;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
    transition: left 0.18s ease;
  }
`;

/* Pequeno contêiner para alinhar switch + texto */
export const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
