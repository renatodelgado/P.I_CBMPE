import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ContainerPainel,
  PageTopHeaderRow,
  PageTitle,
  PageSubtitle,
  BoxInfo,
  SectionTitle,
  Grid,
  Field,
  DateRange,
  ActionsRow,
  TableWrapper,
  Table,
  ResponsiveRow,
  GridColumn,
  AuditStatCard,
  SavedFilterCard,
  MiniGrid
} from "../../components/EstilosPainel.styles";

import {
  PlusIcon,
  EyeIcon,
  UserIcon,
  InfoIcon,
} from "@phosphor-icons/react";
import { Button } from "../../components/Button";

interface FiltroSalvo {
  id: string;
  name: string;
  values: typeof defaultFilters;
}

const defaultFilters = {
  periodoInicio: "",
  periodoFim: "",
  tipo: "todos",
  regiao: "todas",
  viatura: "",
  buscaLivre: "",
};

export function ListaOcorrencias() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState(defaultFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const [savedFilters, setSavedFilters] = useState<FiltroSalvo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newFilterName, setNewFilterName] = useState("");

  const ocorrencias = useMemo(
    () => [
      {
        id: "#OCR-2025-001",
        data: "20/10/2025",
        hora: "08:30",
        tipo: "Incêndio",
        localizacao: "Recife - Boa Viagem",
        viatura: "ABT-01",
        status: "Em andamento",
        responsavel: "Sgt. Carlos Silva",
      },
      {
        id: "#OCR-2025-002",
        data: "19/10/2025",
        hora: "14:15",
        tipo: "Resgate",
        localizacao: "Olinda - Bairro Novo",
        viatura: "USB-02",
        status: "Concluído",
        responsavel: "Cb. Ana Costa",
      },
      {
        id: "#OCR-2025-003",
        data: "18/10/2025",
        hora: "10:45",
        tipo: "APH",
        localizacao: "Jaboatão - Prazeres",
        viatura: "USA-03",
        status: "Pendente",
        responsavel: "Sd. Pedro Lima",
      },
      {
        id: "#OCR-2025-004",
        data: "21/10/2025",
        hora: "16:10",
        tipo: "Incêndio",
        localizacao: "Recife - Boa Vista",
        viatura: "ABT-04",
        status: "Concluído",
        responsavel: "Sgt. Maria Oliveira",
      },
      {
        id: "#OCR-2025-005",
        data: "22/10/2025",
        hora: "09:20",
        tipo: "Resgate",
        localizacao: "Olinda - Varadouro",
        viatura: "USB-05",
        status: "Em andamento",
        responsavel: "Cb. João Santos",
      },
      {
        id: "#OCR-2025-006",
        data: "23/10/2025",
        hora: "07:50",
        tipo: "APH",
        localizacao: "Recife - Pina",
        viatura: "USA-03",
        status: "Pendente",
        responsavel: "Sgt. Carlos Silva",
      },
      {
        id: "#OCR-2025-007",
        data: "24/10/2025",
        hora: "13:25",
        tipo: "Incêndio",
        localizacao: "Jaboatão - Curado",
        viatura: "ABT-01",
        status: "Concluído",
        responsavel: "Cb. Ana Costa",
      },
      {
        id: "#OCR-2025-008",
        data: "24/10/2025",
        hora: "11:00",
        tipo: "Resgate",
        localizacao: "Recife - Casa Forte",
        viatura: "USB-02",
        status: "Em andamento",
        responsavel: "Sd. Pedro Lima",
      },
    ],
    []
  );


  // filtragem
  const filteredOcorrencias = useMemo(() => {
    return ocorrencias.filter(o => {
      const { periodoInicio, periodoFim, tipo, regiao, viatura, buscaLivre } = filters;

      const matchTipo = tipo === "todos" || o.tipo.toLowerCase() === tipo.toLowerCase();
      const matchRegiao = regiao === "todas" || o.localizacao.toLowerCase().includes(regiao.toLowerCase());
      const matchViatura = !viatura || o.viatura.toLowerCase().includes(viatura.toLowerCase());
      const matchBusca = !buscaLivre ||
        o.id.toLowerCase().includes(buscaLivre.toLowerCase()) ||
        o.responsavel.toLowerCase().includes(buscaLivre.toLowerCase()) ||
        o.localizacao.toLowerCase().includes(buscaLivre.toLowerCase());

      let matchPeriodo = true;
      if (periodoInicio) matchPeriodo = o.data >= periodoInicio;
      if (periodoFim) matchPeriodo = matchPeriodo && o.data <= periodoFim;

      return matchTipo && matchRegiao && matchViatura && matchBusca && matchPeriodo;
    });
  }, [ocorrencias, filters]);

  // paginação
  const totalPages = Math.ceil(filteredOcorrencias.length / pageSize);
  const paginatedOcorrencias = filteredOcorrencias.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => setCurrentPage(1), [filters]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em andamento": return "#3B82F6";
      case "Concluído": return "#10B981";
      case "Pendente": return "#EF4444";
      default: return "#6B7280";
    }
  };

  const handleNovaOcorrencia = () => navigate("/ocorrencias/cadastrar");

  const handleSalvarFiltro = () => setShowModal(true);

  const handleConfirmSave = () => {
    if (!newFilterName.trim()) return alert("Informe um nome para o filtro!");
    setSavedFilters([
      ...savedFilters,
      { id: String(Date.now()), name: newFilterName, values: { ...filters } },
    ]);
    setNewFilterName("");
    setShowModal(false);
  };

  const handleApplySavedFilter = (filtro: FiltroSalvo) => setFilters(filtro.values);

  return (
    <ContainerPainel>
      <PageTopHeaderRow>
        <div>
          <PageTitle>Lista de Ocorrências</PageTitle>
          <PageSubtitle>Visualize e gerencie todas as ocorrências registradas com filtros avançados.</PageSubtitle>
        </div>
        <ActionsRow>
          <Button variant="danger" text={<><PlusIcon size={16} style={{ marginRight: 8 }} color="#fff" />Nova Ocorrência</>} onClick={handleNovaOcorrencia} />
        </ActionsRow>
      </PageTopHeaderRow>

      <ResponsiveRow>

        <GridColumn weight={1}>

          <MiniGrid>

            <AuditStatCard>
              <h3>{ocorrencias.length}</h3>
              <span>Total de Ocorrências</span>
            </AuditStatCard>

            <AuditStatCard>
              <h3>{ocorrencias.filter(o => o.status === "Pendente").length}</h3>
              <span>Pendentes</span>
            </AuditStatCard>

            <AuditStatCard>
              <h3>{ocorrencias.filter(o => o.status === "Em andamento").length}</h3>
              <span>Em Andamento</span>
            </AuditStatCard>

            <AuditStatCard>
              <h3>{ocorrencias.filter(o => o.status === "Concluído").length}</h3>
              <span>Concluídas</span>
            </AuditStatCard>

          </MiniGrid>

        </GridColumn>
        
      </ResponsiveRow>

      <ResponsiveRow>
        {/* Coluna Filtros */}
        <GridColumn weight={3}>
          <BoxInfo>
            <Grid>
              <Field>
                <label>Período</label>
                <DateRange>
                  <input type="date" value={filters.periodoInicio} onChange={e => setFilters(f => ({ ...f, periodoInicio: e.target.value }))} />
                  <input type="date" value={filters.periodoFim} onChange={e => setFilters(f => ({ ...f, periodoFim: e.target.value }))} />
                </DateRange>
              </Field>
              <Field>
                <label>Tipo de Ocorrência</label>
                <select value={filters.tipo} onChange={e => setFilters(f => ({ ...f, tipo: e.target.value }))}>
                  <option value="todos">Todos</option>
                  <option value="Incêndio">Incêndio</option>
                  <option value="Resgate">Resgate</option>
                  <option value="APH">APH</option>
                </select>
              </Field>
              <Field>
                <label>Região / Setor</label>
                <select value={filters.regiao} onChange={e => setFilters(f => ({ ...f, regiao: e.target.value }))}>
                  <option value="todas">Todas</option>
                  <option value="Recife">Recife</option>
                  <option value="Olinda">Olinda</option>
                  <option value="Jaboatão">Jaboatão</option>
                </select>
              </Field>
              <Field>
                <label>Viatura / Equipe</label>
                <input type="text" placeholder="Digite para buscar..." value={filters.viatura} onChange={e => setFilters(f => ({ ...f, viatura: e.target.value }))} />
              </Field>
              <Field>
                <label>Busca Livre</label>
                <input type="text" placeholder="Pesquisar por ID, responsável, local..." value={filters.buscaLivre} onChange={e => setFilters(f => ({ ...f, buscaLivre: e.target.value }))} />
              </Field>
            </Grid>

            <ActionsRow>
              <Button text="Filtrar" onClick={() => { }} variant="primary" />
              <Button text="Limpar" onClick={() => setFilters(defaultFilters)} variant="secondary" />
              <Button text="Salvar Filtro" onClick={handleSalvarFiltro} variant="secondary" />
            </ActionsRow>
          </BoxInfo>
        </GridColumn>

        {/* Coluna Filtros Salvos */}
        <GridColumn weight={1}>
          <BoxInfo>
            <SectionTitle>Filtros Salvos</SectionTitle>
            <Grid>
              {savedFilters.length === 0 && <p style={{ fontSize: '13px', color: '#6b7280' }}>Nenhum filtro salvo.</p>}

              {savedFilters.map(f => {
                const { tipo, regiao, viatura, periodoInicio, periodoFim, buscaLivre } = f.values;

                // montar descrição automaticamente conforme os filtros
                const descricaoParts: string[] = [];

                if (tipo && tipo !== "todos") descricaoParts.push(`Tipo: ${tipo}`);
                if (regiao && regiao !== "todas") descricaoParts.push(`Região: ${regiao}`);
                if (viatura) descricaoParts.push(`Viatura: ${viatura}`);
                if (buscaLivre) descricaoParts.push(`Busca: ${buscaLivre}`);
                if (periodoInicio || periodoFim) {
                  descricaoParts.push(
                    `Período: ${periodoInicio || "..."} até ${periodoFim || "..."}`
                  );
                }

                const descricao =
                  descricaoParts.length > 0 ? descricaoParts.join(", ") : "Todos os registros";

                return (
                  <SavedFilterCard key={f.id} onClick={() => handleApplySavedFilter(f)}>
                    <div className="filter-name">{f.name}</div>
                    <div className="filter-description">{descricao}</div>
                  </SavedFilterCard>
                );
              })}
            </Grid>

          </BoxInfo>
        </GridColumn>
      </ResponsiveRow>

      {/* Modal simples */}
      {
        showModal && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center",
            zIndex: 9999
          }}>
            <BoxInfo style={{ width: 300, padding: "1rem" }}>
              <h3>Salvar Filtro</h3>
              <input
                type="text"
                placeholder="Nome do filtro"
                value={newFilterName}
                onChange={e => setNewFilterName(e.target.value)}
                style={{ width: "100%", marginBottom: "1rem", padding: "4px 8px" }}
              />
              <ActionsRow>
                <Button text="Cancelar" onClick={() => setShowModal(false)} variant="secondary" />
                <Button text="Salvar" onClick={handleConfirmSave} variant="primary" />
              </ActionsRow>
            </BoxInfo>
          </div>
        )
      }
      <ResponsiveRow>
        <GridColumn weight={3}>
          <BoxInfo>
            <SectionTitle>Resultados</SectionTitle>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <th></th>
                    <th>ID</th>
                    <th>Data/Hora</th>
                    <th>Tipo</th>
                    <th>Localização</th>
                    <th>Viatura</th>
                    <th>Status</th>
                    <th>Responsável</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOcorrencias.map(o => (
                    <tr key={o.id}>
                      <td><input type="checkbox" /></td>
                      <td>{o.id}</td>
                      <td>{o.data}<br /><small>{o.hora}</small></td>
                      <td>{o.tipo}</td>
                      <td>{o.localizacao}</td>
                      <td>{o.viatura}</td>
                      <td style={{ color: getStatusColor(o.status), fontWeight: 600 }}>{o.status}</td>
                      <td>{o.responsavel}</td>
                      <td>
                        <button style={{ border: "none", paddingRight: "0.5rem", background: "transparent", cursor: "pointer" }}>
                          <EyeIcon size={18} />
                        </button>
                        <button style={{ border: "none", paddingRight: "0.5rem", background: "transparent", cursor: "pointer" }}>
                          <UserIcon size={18} />
                        </button>
                        <button style={{ border: "none", background: "transparent", cursor: "pointer" }}>
                          <InfoIcon size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>

            {/* Paginação */}
            <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1rem" }}>
              <Button text="Anterior" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} variant="secondary" />
              <span style={{ alignSelf: "center" }}>{currentPage} / {totalPages || 1}</span>
              <Button text="Próximo" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} variant="secondary" />
            </div>

            <div style={{ textAlign: "center", marginTop: "1rem", color: "#64748b" }}>
              Mostrando {paginatedOcorrencias.length} de {filteredOcorrencias.length} ocorrências filtradas
            </div>
          </BoxInfo>
        </GridColumn>
      </ResponsiveRow>

    </ContainerPainel >
  );
}
