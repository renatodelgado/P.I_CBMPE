import styled from "styled-components";

// Container Principal
export const ContainerPrincipal = styled.div`
  width: 100%;
  max-width: 1440px;
  min-height: calc(100vh - 48px);
  background: #F9FAFB;
  padding: 16px;
  margin: 48px auto 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow-x: hidden;
  box-sizing: border-box;

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 12px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 8px;
    min-height: calc(100vh - 40px);
    margin-top: 40px;
    margin-left: auto;
    margin-right: auto;
  }

  /* Mobile Small */
  @media (max-width: 480px) {
    padding: 4px;
    min-height: calc(100vh - 36px);
    margin-top: 36px;
  }
`;

// Cabeçalho da Tela
export const CabecalhoTela = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;

  /* Mobile */
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
    margin-bottom: 16px;
  }
`;

export const TituloTela = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;

  /* Tablet */
  @media (max-width: 1024px) {
    font-size: 24px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 20px;
    margin-top: 8px;
  }

  /* Mobile Small */
  @media (max-width: 480px) {
    font-size: 18px;
    margin-top: 12px;
  }
`;

export const DescricaoTela = styled.p`
  font-size: 16px;
  color: #6B7280;
  margin: 0;

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 14px;
  }

  /* Mobile Small */
  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

export const BotaoNovaOcorrencia = styled.button`
  background: #EF4444;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  margin-right: 16px;
  
  &:hover {
    background: #DC2626;
  }

  /* Tablet */
  @media (max-width: 1024px) {
    margin-right: 12px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 12px 16px;
    margin-right: 0;
  }

  /* Mobile Small */
  @media (max-width: 480px) {
    font-size: 13px;
    padding: 10px 14px;
  }
`;

// Seção de Filtros
export const SecaoFiltros = styled.div`
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

export const LinhaFiltros = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  align-items: end;
  flex-wrap: wrap;
  
  &:last-child {
    margin-bottom: 0;
  }

  /* Tablet */
  @media (max-width: 1024px) {
    gap: 16px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  /* Mobile Small */
  @media (max-width: 480px) {
    gap: 8px;
  }
`;

export const CampoFiltro = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 200px;
  margin-right: 8px;

  /* Tablet */
  @media (max-width: 1024px) {
    min-width: 180px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    min-width: 100%;
    max-width: 100%;
    margin-right: 0;
    
    input, select {
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }
  }
`;

export const LabelCampo = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

export const InputData = styled.input`
  padding: 8px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #EF4444;
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
  }
`;

export const SelectCampo = styled.select`
  padding: 8px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  width: 100%;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #EF4444;
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
  }

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 13px;
    padding: 8px 10px;
  }

  /* Mobile Small */
  @media (max-width: 480px) {
    font-size: 12px;
    padding: 7px 8px;
  }
`;

export const InputTexto = styled.input`
  padding: 8px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #EF4444;
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
  }

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 13px;
    padding: 8px 10px;
  }

  /* Mobile Small */
  @media (max-width: 480px) {
    font-size: 12px;
    padding: 7px 8px;
  }
`;

export const BotaoFiltro = styled.button`
  background: #EF4444;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  min-width: 100px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #DC2626;
  }
`;

export const BotaoLimpar = styled.button`
  background: transparent;
  color: #6B7280;
  border: 1px solid #D1D5DB;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  min-width: 80px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #F9FAFB;
  }
`;

// Filtros Aplicados
export const FiltersAplicados = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const TagFiltro = styled.span`
  background: #EF4444;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: #DC2626;
  }
`;

// Seção de Resultados
export const SecaoResultados = styled.div`
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  overflow: hidden;
`;

export const CabecalhoResultados = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #E5E7EB;

  /* Mobile */
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
    padding: 16px;
  }
`;

export const TituloResultados = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

export const BotoesAcoes = styled.div`
  display: flex;
  gap: 12px;
`;

export const BotaoExportar = styled.button`
  background: transparent;
  color: #6B7280;
  border: 1px solid #D1D5DB;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background: #F9FAFB;
  }
`;

export const BotaoAtribuir = styled.button`
  background: transparent;
  color: #6B7280;
  border: 1px solid #D1D5DB;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background: #F9FAFB;
  }
`;

// Tabela
export const TabelaOcorrencias = styled.div`
  width: 100%;
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-top: 16px;

  /* Mobile */
  @media (max-width: 768px) {
    overflow-x: visible;
    background: transparent;
    box-shadow: none;
    border-radius: 0;
  }
`;

export const CabecalhoTabela = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr 1fr 1fr 2fr 1fr 1fr 1.5fr 1fr;
  gap: 16px;
  padding: 16px 24px;
  background: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
  font-size: 12px;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;

  /* Tablet */
  @media (max-width: 1024px) {
    grid-template-columns: 40px 1fr 1fr 1fr 1.5fr 1fr 1fr;
    gap: 12px;
    padding: 12px 16px;
    font-size: 11px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    display: none; /* Esconder cabeçalho em mobile, usar cards */
  }
`;

export const ColunaTabela = styled.div<{ width?: string }>`
  ${props => props.width && `width: ${props.width};`}
`;

export const LinhaTabela = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr 1fr 1fr 2fr 1fr 1fr 1.5fr 1fr;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #E5E7EB;
  align-items: center;
  
  &:hover {
    background: #F9FAFB;
  }

  /* Tablet */
  @media (max-width: 1024px) {
    grid-template-columns: 40px 1fr 1fr 1fr 1.5fr 1fr 1fr;
    gap: 12px;
    padding: 12px 16px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    display: block;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 8px;
    background: white;
    border: 1px solid #E5E7EB;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    
    &:hover {
      background: white;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    }
  }
`;

export const CelulaTabela = styled.div`
  font-size: 14px;
  color: #374151;
  
  small {
    color: #6B7280;
    font-size: 12px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    margin-bottom: 8px;
    position: relative;
    padding-left: 50%;
    min-height: 24px;
    
    &:before {
      content: attr(data-label);
      font-weight: 600;
      color: #6B7280;
      font-size: 12px;
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 45%;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }
`;

export const StatusBadge = styled.span<{ color: string }>`
  background: ${props => props.color}20;
  color: ${props => props.color};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

// Paginação
export const PaginacaoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid #E5E7EB;

  /* Mobile */
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    padding: 16px;
  }
`;

export const InfoPaginacao = styled.div`
  font-size: 14px;
  color: #6B7280;
`;

export const BotoesPaginacao = styled.div`
  display: flex;
  gap: 8px;
`;

export const BotaoPaginacao = styled.button<{ active?: boolean }>`
  padding: 8px 12px;
  border: 1px solid #D1D5DB;
  background: ${props => props.active ? '#EF4444' : 'white'};
  color: ${props => props.active ? 'white' : '#374151'};
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.active ? '#DC2626' : '#F9FAFB'};
  }
`;

// Painel Lateral
export const PainelLateral = styled.div`
  width: 280px;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 16px;
  height: fit-content;
  margin-right: 16px;

  /* Tablet */
  @media (max-width: 1024px) {
    width: 250px;
    margin-right: 12px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    width: 100%;
    margin-top: 16px;
    margin-right: 0;
    order: 2;
  }
`;

export const TituloSecao = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
`;

export const CardEstatistica = styled.div`
  text-align: center;
  padding: 12px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
`;

export const NumeroEstatistica = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 2px;
`;

export const LabelEstatistica = styled.div`
  font-size: 11px;
  color: #6B7280;
`;

// Layout Responsivo
export const LayoutResponsivo = styled.div`
  display: flex;
  gap: 16px;

  /* Mobile */
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

export const AreaPrincipal = styled.div`
  flex: 1;
  min-width: 0; /* Permite que o flex item encolha */

  /* Mobile */
  @media (max-width: 768px) {
    order: 1;
  }
`;

export const ContainerBotoesFiltro = styled.div`
  display: flex;
  gap: 12px;
  align-items: end;
  margin-left: 16px;

  /* Mobile */
  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 12px;
    gap: 8px;
    
    button {
      flex: 1;
    }
  }
`;

// Manter compatibilidade com código anterior
export const FilterCard = styled.div`
  /* Deprecated - usar ContainerPrincipal */
`;