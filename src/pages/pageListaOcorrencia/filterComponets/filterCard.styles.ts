import styled from "styled-components";

// Container Principal
export const ContainerPrincipal = styled.div`
  width: 100%;
  max-width: 1440px;
  min-height: 1066px;
  background: #F9FAFB;
  border: 1px solid #000000;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

// Cabeçalho da Tela
export const CabecalhoTela = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
`;

export const TituloTela = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
`;

export const DescricaoTela = styled.p`
  font-size: 16px;
  color: #6B7280;
  margin: 0;
`;

export const BotaoNovaOcorrencia = styled.button`
  background: #EF4444;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: #DC2626;
  }
`;

// Seção de Filtros
export const SecaoFiltros = styled.div`
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
`;

export const LinhaFiltros = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  align-items: end;
  flex-wrap: wrap;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const CampoFiltro = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
`;

export const LabelCampo = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

export const InputData = styled.input`
  padding: 12px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #EF4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
`;

export const SelectCampo = styled.select`
  padding: 12px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #EF4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
`;

export const InputTexto = styled.input`
  padding: 12px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: #EF4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
`;

export const BotaoFiltro = styled.button`
  background: #EF4444;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: #DC2626;
  }
`;

export const BotaoLimpar = styled.button`
  background: transparent;
  color: #6B7280;
  border: 1px solid #D1D5DB;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  
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
`;

export const CelulaTabela = styled.div`
  font-size: 14px;
  color: #374151;
  
  small {
    color: #6B7280;
    font-size: 12px;
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
  width: 300px;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 24px;
  height: fit-content;
`;

export const TituloSecao = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
`;

export const CardEstatistica = styled.div`
  text-align: center;
  padding: 16px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
`;

export const NumeroEstatistica = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
`;

export const LabelEstatistica = styled.div`
  font-size: 12px;
  color: #6B7280;
`;

// Manter compatibilidade com código anterior
export const FilterCard = styled.div`
  /* Deprecated - usar ContainerPrincipal */
`;