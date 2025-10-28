import styled from "styled-components";

export const PageTopHeader = styled.header`
  margin-top: 6rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 420px) {
    margin-top: 3.5rem;
    padding: 0 0.75rem;
  }
`;


export const PageTopHeaderRow = styled(PageTopHeader)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

export const PageTopHeaderColumn = styled(PageTopHeaderRow)`
margin-top:0;
  flex-direction: column;
`;

export const PageTitle = styled.h1`
  font-size: clamp(1.25rem, 2.2vw, 1.6rem);
  margin: 0;
  color: #0b1220;
  align-self: flex-start;
`;

export const PageSubtitle = styled.p`
  color: #64748b;
  margin-top: 0.35rem;
  align-self: flex-start;
`;

export const RequiredNotice = styled.p`
  font-size: 0.9rem;
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
  max-width: 1200px;
  padding-top: 1rem;

  @media (max-width: 1200px) {
    padding: 2rem 2rem;
  }
`;

export const BoxInfo = styled.section`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 2rem;
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
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;

  @media (min-width: 1280px) {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
`;

export const MiniGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  @media (min-width: 1280px) {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
`;

interface GridColumnProps {
  weight?: number;
}

export const GridColumn = styled.div<GridColumnProps>`
  /* permitir que seja usado dentro de Grid ou em row responsiva */
  display: block;
  width: 100%;
  flex: ${(props) => props.weight || 1};
`;

export const ResponsiveRow = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;

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


export const MapFullBox = styled.div`
  background-color: #f1f5f9;
  border: 1px dashed #cbd5e1;
  min-height: 180px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 0;
  height: auto;
  padding: 1rem;

  @media (max-width: 520px) {
    min-height: 140px;
    padding: 0.75rem;
  }
`;

export const MapPlaceholder = styled.div`
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
  max-height: 200px;
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
  min-height: 70px;
  max-height: 180px;
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
    width: auto;
  }

  @media (max-width: 420px) {
    padding: 1rem;
    input {
      width: 100%;
    }
  }
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

export const AuditStatCard = styled.div`
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  h3 {
    font-size: 1.5rem;
    margin: 0;
    color: #0f172a;
    font-weight: 600;
  }

  span {
    font-size: 0.95rem;
    color: #64748b;
    margin-top: 0.25rem;
  }
`;



export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 8px;

  /* adiciona uma leve sombra e borda para destacar o scroll */
  border: 1px solid #e2e8f0;
  background: #fff;

  /* estiliza scrollbar no mobile e desktop */
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 8px;
  }

  @media (max-width: 600px) {
    /* ajuda a evitar colunas muito largas */
    table {
      font-size: 0.85rem;
    }
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px; /* força scroll horizontal em telas pequenas */

  thead {
    background-color: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }

  th {
    text-align: left;
    padding: 0.75rem;
    font-weight: 600;
    color: #475569;
    font-size: 0.9rem;
    text-transform: uppercase;
    white-space: nowrap; /* evita quebra de título */
  }

  td {
    padding: 0.75rem;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: top;
    color: #334155;
    font-size: 0.9rem;
  }

  tr:hover {
    background-color: #f9fafb;
  }
`;


export const AuditDetailsBox = styled.div`
  background: #f8fafc;
  border-left: 3px solid #2563eb;
  margin-top: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 6px;

  p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
    color: #334155;
  }

  .campo {
    font-weight: 600;
    color: #1e293b;
  }
`;

export const AuditFooterNotice = styled.div`
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  font-size: 0.9rem;
  color: #334155;

  strong {
    color: #2563eb;
  }

  a {
    color: #2563eb;
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const DateRange = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  /* cada input ocupa igualmente o espaço disponível */
  input {
    flex: 1;
    min-width: 0;
  }

  /* em telas pequenas empilha verticalmente */
  @media (max-width: 420px) {
    flex-direction: column;
  }
`;

/* Wrapper para ações/atalhos (botões) alinhados à direita */
export const ActionsRow = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;

  @media (max-width: 520px) {
    flex-direction: column;
    align-items: stretch;
    button {
      width: 100%;
    }
  }
`;

export const AuditActiveFiltersBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export const AuditFilterChip = styled.div`
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #334155;

  button {
    border: none;
    background: transparent;
    color: #64748b;
    cursor: pointer;
    font-weight: bold;
    line-height: 1;
    padding: 0;
    margin-left: 2px;

    &:hover {
      color: #ef4444;
    }
  }
`;

export const FilterChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export const FilterChip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background-color: #f1f3f5;
  color: #333;
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 0.85rem;
  button {
    background: none;
    border: none;
    font-weight: bold;
    cursor: pointer;
    color: #666;
    line-height: 1;
    font-size: 1rem;
    &:hover {
      color: #000;
    }
  }
`;

export const PreviewList = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #333;

  div {
    background: #f8f8f8;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    margin-bottom: 0.25rem;
  }
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
  margin: 1.25rem 0;
`;

export const SectionSubtitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #444;
`;

export const SignatureBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f9f9f9;
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 1rem;

  canvas {
    background: white;
    border: 1px solid #ccc;
    border-radius: 6px;
    touch-action: none;
  }

  @media (max-width: 420px) {
    padding: 1rem;
    input {
      width: 100%;
    }
  }
`;

export const SignatureActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.75rem;
`;

export const UploadButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.75rem;
  justify-content: center;

  button {
    min-width: 150px;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

export const ModalContent = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 1rem;
  max-width: 95%;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
`;

export const StatusAlert = styled.div<{ isOnline: boolean }>`
  background: ${(p) => (p.isOnline ? "#ecfdf5" : "#fef2f2")};
  border: 1px solid ${(p) => (p.isOnline ? "#86efac" : "#fecaca")};
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  color: ${(p) => (p.isOnline ? "#065f46" : "#7f1d1d")};
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  font-size: 0.95rem;

  .status-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: ${(p) => (p.isOnline ? "#16a34a" : "#dc2626")};
    }

    strong {
      font-weight: 600;
    }
  }

  .message {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    line-height: 1.4;

    svg {
      flex-shrink: 0;
      margin-top: 2px;
    }
  }
`;

export const SavedFilterCard = styled.div`
  padding: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 6px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background-color: #f9fafb;
  }

  .filter-name {
    font-weight: 600;
    font-size: 14px;
    color: #111827;
  }

  .filter-description {
    font-size: 11px;
    color: #6b7280;
    margin-top: 2px;
  }
`;

