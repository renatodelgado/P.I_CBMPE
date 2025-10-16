import { useState } from "react";
import { 
  ContainerPrincipal, 
  CabecalhoTela,
  TituloTela,
  DescricaoTela,
  BotaoNovaOcorrencia,
  SecaoFiltros,
  LinhaFiltros,
  CampoFiltro,
  LabelCampo,
  InputData,
  SelectCampo,
  InputTexto,
  BotaoFiltro,
  BotaoLimpar,
  FiltersAplicados,
  TagFiltro,
  SecaoResultados,
  CabecalhoResultados,
  TituloResultados,
  BotoesAcoes,
  BotaoExportar,
  BotaoAtribuir,
  TabelaOcorrencias,
  CabecalhoTabela,
  ColunaTabela,
  LinhaTabela,
  CelulaTabela,
  StatusBadge,
  PaginacaoContainer,
  InfoPaginacao,
  BotoesPaginacao,
  BotaoPaginacao,
  PainelLateral,
  TituloSecao,
  CardEstatistica,
  NumeroEstatistica,
  LabelEstatistica
} from "./filterCard.styles";

export function FilterComponent() {
  const [periodoInicio, setPeriodoInicio] = useState("");
  const [periodoFim, setPeriodoFim] = useState("");
  const [tipoOcorrencia, setTipoOcorrencia] = useState("todos");
  const [regiao, setRegiao] = useState("todas");
  const [viatura, setViatura] = useState("");
  const [buscaLivre, setBuscaLivre] = useState("");
  const [statusPendente, setStatusPendente] = useState(false);
  const [statusConcluido, setStatusConcluido] = useState(false);
  const [statusAndamento, setStatusAndamento] = useState(false);

  const ocorrencias = [
    {
      id: "#OCR-2024-001",
      data: "25/09/2024",
      hora: "14:32",
      tipo: "Incêndio",
      localizacao: "Boa Viagem, Recife",
      viatura: "ABT-01",
      status: "Em andamento",
      responsavel: "Sgt. Carlos Silva"
    },
    {
      id: "#OCR-2024-002",
      data: "25/09/2024",
      hora: "13:15",
      tipo: "Resgate",
      localizacao: "Centro, Olinda",
      viatura: "USB-02",
      status: "Concluído",
      responsavel: "Cb. Ana Costa"
    },
    {
      id: "#OCR-2024-003",
      data: "25/09/2024",
      hora: "12:48",
      tipo: "APH",
      localizacao: "Piedade, Jaboatão",
      viatura: "USA-03",
      status: "Pendente",
      responsavel: ""
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em andamento": return "#3B82F6";
      case "Concluído": return "#10B981";
      case "Pendente": return "#EF4444";
      default: return "#6B7280";
    }
  };

  return (
    <ContainerPrincipal>
      {/* Cabeçalho da Tela */}
      <CabecalhoTela>
        <div>
          <TituloTela>Lista de Ocorrências</TituloTela>
          <DescricaoTela>Visualize e gerencie todas as ocorrências registradas com filtros avançados</DescricaoTela>
        </div>
        <BotaoNovaOcorrencia>+ Nova ocorrência</BotaoNovaOcorrencia>
      </CabecalhoTela>

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Área Principal */}
        <div style={{ flex: 1 }}>
          {/* Seção de Filtros */}
          <SecaoFiltros>
            <LinhaFiltros>
              <CampoFiltro>
                <LabelCampo>Período</LabelCampo>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <InputData 
                    type="date" 
                    value={periodoInicio}
                    onChange={(e) => setPeriodoInicio(e.target.value)}
                  />
                  <span>até</span>
                  <InputData 
                    type="date" 
                    value={periodoFim}
                    onChange={(e) => setPeriodoFim(e.target.value)}
                  />
                </div>
              </CampoFiltro>

              <CampoFiltro>
                <LabelCampo>Tipo de Ocorrência</LabelCampo>
                <SelectCampo 
                  value={tipoOcorrencia}
                  onChange={(e) => setTipoOcorrencia(e.target.value)}
                >
                  <option value="todos">Todos os tipos</option>
                  <option value="incendio">Incêndio</option>
                  <option value="resgate">Resgate</option>
                  <option value="aph">APH</option>
                </SelectCampo>
              </CampoFiltro>

              <CampoFiltro>
                <LabelCampo>Região / Setor</LabelCampo>
                <SelectCampo 
                  value={regiao}
                  onChange={(e) => setRegiao(e.target.value)}
                >
                  <option value="todas">Todas as regiões</option>
                  <option value="recife">Recife</option>
                  <option value="olinda">Olinda</option>
                  <option value="jaboatao">Jaboatão</option>
                </SelectCampo>
              </CampoFiltro>

              <CampoFiltro>
                <LabelCampo>Status</LabelCampo>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="checkbox" 
                      checked={statusPendente}
                      onChange={(e) => setStatusPendente(e.target.checked)}
                    />{' '}
                    Pendente
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="checkbox" 
                      checked={statusConcluido}
                      onChange={(e) => setStatusConcluido(e.target.checked)}
                    />{' '}
                    Concluído
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="checkbox" 
                      checked={statusAndamento}
                      onChange={(e) => setStatusAndamento(e.target.checked)}
                    />{' '}
                    Em andamento
                  </label>
                </div>
              </CampoFiltro>
            </LinhaFiltros>

            <LinhaFiltros>
              <CampoFiltro>
                <LabelCampo>Viatura / Equipe</LabelCampo>
                <InputTexto 
                  placeholder="Digite para buscar..."
                  value={viatura}
                  onChange={(e) => setViatura(e.target.value)}
                />
              </CampoFiltro>

              <CampoFiltro>
                <LabelCampo>Busca Livre</LabelCampo>
                <InputTexto 
                  placeholder="Pesquisar por descrição, nome da vítima, ID..."
                  value={buscaLivre}
                  onChange={(e) => setBuscaLivre(e.target.value)}
                />
              </CampoFiltro>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'end' }}>
                <BotaoFiltro>🔍 Filtro</BotaoFiltro>
                <BotaoLimpar>Limpar</BotaoLimpar>
              </div>
            </LinhaFiltros>

            {/* Filtros Aplicados */}
            <FiltersAplicados>
              <TagFiltro>Últimos 7 dias ✕</TagFiltro>
              <TagFiltro>Status: Em andamento ✕</TagFiltro>
            </FiltersAplicados>
          </SecaoFiltros>

          {/* Seção de Resultados */}
          <SecaoResultados>
            <CabecalhoResultados>
              <TituloResultados>Resultados (247 ocorrências)</TituloResultados>
              <BotoesAcoes>
                <BotaoExportar>📥 Exportar</BotaoExportar>
                <BotaoAtribuir>👤 Atribuir</BotaoAtribuir>
              </BotoesAcoes>
            </CabecalhoResultados>

            {/* Tabela de Ocorrências */}
            <TabelaOcorrencias>
              <CabecalhoTabela>
                <ColunaTabela width="50px">
                  <input type="checkbox" />
                </ColunaTabela>
                <ColunaTabela>ID</ColunaTabela>
                <ColunaTabela>DATA/HORA</ColunaTabela>
                <ColunaTabela>TIPO</ColunaTabela>
                <ColunaTabela>LOCALIZAÇÃO</ColunaTabela>
                <ColunaTabela>VIATURA</ColunaTabela>
                <ColunaTabela>STATUS</ColunaTabela>
                <ColunaTabela>RESPONSÁVEL</ColunaTabela>
                <ColunaTabela>AÇÕES</ColunaTabela>
              </CabecalhoTabela>

              {ocorrencias.map((ocorrencia) => (
                <LinhaTabela key={ocorrencia.id}>
                  <CelulaTabela>
                    <input type="checkbox" />
                  </CelulaTabela>
                  <CelulaTabela>{ocorrencia.id}</CelulaTabela>
                  <CelulaTabela>
                    {ocorrencia.data}<br />
                    <small>{ocorrencia.hora}</small>
                  </CelulaTabela>
                  <CelulaTabela>{ocorrencia.tipo}</CelulaTabela>
                  <CelulaTabela>{ocorrencia.localizacao}</CelulaTabela>
                  <CelulaTabela>{ocorrencia.viatura}</CelulaTabela>
                  <CelulaTabela>
                    <StatusBadge color={getStatusColor(ocorrencia.status)}>
                      {ocorrencia.status}
                    </StatusBadge>
                  </CelulaTabela>
                  <CelulaTabela>{ocorrencia.responsavel}</CelulaTabela>
                  <CelulaTabela>👁️ 👤 ℹ️</CelulaTabela>
                </LinhaTabela>
              ))}
            </TabelaOcorrencias>

            {/* Paginação */}
            <PaginacaoContainer>
              <InfoPaginacao>
                Mostrando 1-20 de 247 resultados
              </InfoPaginacao>
              <BotoesPaginacao>
                <BotaoPaginacao>Anterior</BotaoPaginacao>
                <BotaoPaginacao active>1</BotaoPaginacao>
                <BotaoPaginacao>2</BotaoPaginacao>
                <BotaoPaginacao>3</BotaoPaginacao>
                <BotaoPaginacao>Próxima</BotaoPaginacao>
              </BotoesPaginacao>
            </PaginacaoContainer>
          </SecaoResultados>
        </div>

        {/* Painel Lateral */}
        <PainelLateral>
          <TituloSecao>Filtros Salvos</TituloSecao>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '8px' }}>
              <div style={{ fontWeight: '600' }}>Ocorrências Pendentes</div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>Status: Pendente</div>
            </div>
            <div style={{ padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '8px' }}>
              <div style={{ fontWeight: '600' }}>Incêndios - Semanal</div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>Tipo: Incêndio, 7 dias</div>
            </div>
            <div style={{ padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '8px' }}>
              <div style={{ fontWeight: '600' }}>Minha Região</div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>Recife + 1º Batalhão</div>
            </div>
          </div>

          <button style={{ 
            width: '100%', 
            padding: '12px', 
            border: '2px solid #EF4444', 
            background: 'white', 
            color: '#EF4444',
            borderRadius: '8px',
            fontWeight: '600',
            marginBottom: '24px'
          }}>
            + Salvar Filtro Atual
          </button>

          <TituloSecao>Estatísticas Rápidas</TituloSecao>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <CardEstatistica>
              <NumeroEstatistica>247</NumeroEstatistica>
              <LabelEstatistica>Total de Ocorrências</LabelEstatistica>
            </CardEstatistica>
            <CardEstatistica>
              <NumeroEstatistica>23</NumeroEstatistica>
              <LabelEstatistica>Pendentes</LabelEstatistica>
            </CardEstatistica>
            <CardEstatistica>
              <NumeroEstatistica>45</NumeroEstatistica>
              <LabelEstatistica>Em Andamento</LabelEstatistica>
            </CardEstatistica>
            <CardEstatistica>
              <NumeroEstatistica>179</NumeroEstatistica>
              <LabelEstatistica>Concluídas</LabelEstatistica>
            </CardEstatistica>
          </div>
        </PainelLateral>
      </div>
    </ContainerPrincipal>
  );
}