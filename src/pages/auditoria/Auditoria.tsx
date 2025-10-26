import { ExportIcon, ListDashesIcon, PencilSimpleIcon, SignInIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { Button } from "../../components/Button";
import { Fragment, useState } from "react";
import {
  ContainerPainel,
  PageTitle,
  PageSubtitle,
  ResponsiveRow,
  GridColumn,
  BoxInfo,
  MiniGrid,
  AuditDetailsBox,
  AuditFooterNotice,
  AuditStatCard,
  Table,
  Grid,
  Field,
  DateRange,
  ActionsRow,
  SectionTitle,
  FilterChip,
  FilterChipsContainer,
  TableWrapper,
  PageTopHeaderColumn,
  PageTopHeaderRow,
  StatIconWrapper,
} from "../../components/EstilosPainel.styles";
import { logs } from "../../assets/logs";
import { formatDate } from "../../utils/formatDate";

export function Auditoria() {
  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");
  const [user, setUser] = useState("");
  const [eventType, setEventType] = useState("");
  const [resource, setResource] = useState("");
  const [searchText, setSearchText] = useState("");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Gera opções únicas para selects
  const uniqueUsers = Array.from(new Set(logs.map((l) => l.user)));
  const uniqueActions = Array.from(new Set(logs.map((l) => l.action)));
  const uniqueResources = Array.from(new Set(logs.map((l) => l.resource)));

  // Funções de filtro
  const filteredLogs = logs.filter((log) => {
    // Período
    const logDate = new Date(log.timestamp.split(" ")[0].split("/").reverse().join("-"));
    const fromDate = periodFrom ? new Date(periodFrom) : null;
    const toDate = periodTo ? new Date(periodTo) : null;
    if (fromDate && logDate < fromDate) return false;
    if (toDate && logDate > toDate) return false;

    // Usuário
    if (user && log.user !== user) return false;

    // Tipo de evento
    if (eventType && log.action !== eventType) return false;

    // Recurso
    if (resource && log.resource !== resource) return false;

    // Busca livre
    if (
      searchText &&
      !(
        log.id.toString().includes(searchText) ||
        log.resource.toLowerCase().includes(searchText.toLowerCase()) ||
        log.details.campo.toLowerCase().includes(searchText.toLowerCase())
      )
    )
      return false;

    return true;
  });

  // Paginação
  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleCancel = () => {
    setPeriodFrom("");
    setPeriodTo("");
    setUser("");
    setEventType("");
    setResource("");
    setSearchText("");
  };

  const handleRemoveFilter = (key: string) => {
    switch (key) {
      case "period":
        setPeriodFrom("");
        setPeriodTo("");
        break;
      case "user":
        setUser("");
        break;
      case "eventType":
        setEventType("");
        break;
      case "resource":
        setResource("");
        break;
      case "searchText":
        setSearchText("");
        break;
    }
  };

  const activeFilters = [
    periodFrom && periodTo ? { label: `Período: ${formatDate(new Date(periodFrom))} a ${formatDate(new Date(periodTo))}`, key: "period" } : null,
    user ? { label: `Usuário: ${user}`, key: "user" } : null,
    eventType ? { label: `Evento: ${eventType}`, key: "eventType" } : null,
    resource ? { label: `Recurso: ${resource}`, key: "resource" } : null,
    searchText ? { label: `Busca: "${searchText}"`, key: "searchText" } : null,
  ].filter(Boolean) as { label: string; key: string }[];



  return (
    <ContainerPainel>
      <PageTopHeaderRow>
        <PageTopHeaderColumn>
          <PageTitle>Auditoria & Logs</PageTitle>
          <PageSubtitle>Trilha de auditoria completa para compliance e investigação.</PageSubtitle>
        </PageTopHeaderColumn>
        <PageTopHeaderColumn>
          <ActionsRow>
            <Button
              variant="danger"
              text={<><ExportIcon size={16} style={{ marginRight: 8 }} weight="bold" />Exportar logs</>}
              onClick={() => { }}
            />
          </ActionsRow>
        </PageTopHeaderColumn>
      </PageTopHeaderRow>

      {/* FILTROS */}
      <ResponsiveRow>
        <GridColumn weight={1}>
          <BoxInfo>
            <Grid>
              <Field>
                <label>Período</label>
                <DateRange>
                  <input
                    type="date"
                    aria-label="Data inicial"
                    value={periodFrom}
                    onChange={(e) => {
                      const v = e.target.value;
                      setPeriodFrom(v);
                      if (periodTo && v > periodTo) setPeriodTo("");
                    }}
                  />
                  <input
                    type="date"
                    aria-label="Data final"
                    value={periodTo}
                    min={periodFrom || undefined}
                    onChange={(e) => setPeriodTo(e.target.value)}
                  />
                </DateRange>
              </Field>

              <Field>
                <label>Usuário</label>
                <select value={user} onChange={(e) => setUser(e.target.value)}>
                  <option value="">Todos os usuários</option>
                  {uniqueUsers.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </Field>

              <Field>
                <label>Tipo de evento</label>
                <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
                  <option value="">Todos os tipos</option>
                  {uniqueActions.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </Field>

              <Field>
                <label>Recurso</label>
                <select value={resource} onChange={(e) => setResource(e.target.value)}>
                  <option value="">Todos os recursos</option>
                  {uniqueResources.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>

              <Field>
                <label>Busca Livre</label>
                <input
                  placeholder="ID, descrição..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </Field>
            </Grid>

            <ActionsRow>
              <Button
                text="Limpar filtro"
                type="button"
                variant="secondary"
                onClick={handleCancel}
                style={{ padding: "8px 14px", borderRadius: 6 }}
              />
              
            </ActionsRow>

            {activeFilters.length > 0 && (
              <FilterChipsContainer>
                {activeFilters.map((f) => (
                  <FilterChip key={f.key}>
                    {f.label}
                    <button onClick={() => handleRemoveFilter(f.key)}>×</button>
                  </FilterChip>
                ))}
              </FilterChipsContainer>
            )}
          </BoxInfo>
        </GridColumn>
      </ResponsiveRow>

      {/* CARDS DE MÉTRICAS */}
      <ResponsiveRow>
        <GridColumn weight={1}>
          <BoxInfo>
            <MiniGrid>
              <AuditStatCard>
                <StatIconWrapper bgColor="#e0f2fe" iconColor="#0284c7">
                  <div className="icon-box">
                    <ListDashesIcon size={20} weight="bold" />
                  </div>
                  <h3>{logs.length}</h3>
                </StatIconWrapper>
                <span>Total de Logs</span>
              </AuditStatCard>
              <AuditStatCard>
                <StatIconWrapper bgColor="#d1fae5" iconColor="#16a34a">
                  <div className="icon-box">
                    <SignInIcon size={20} weight="bold" />
                  </div>
                  <h3>{Array.from(new Set(logs.filter(l => l.action === "Login").map(l => l.user))).length}</h3>
                </StatIconWrapper>
                <span>Logins Únicos</span>
              </AuditStatCard>

              <AuditStatCard>
                <StatIconWrapper bgColor="#fef3c7" iconColor="#f59e0b">
                  <div className="icon-box">
                    <PencilSimpleIcon size={20} weight="bold" />
                  </div>
                  <h3>{logs.filter(l => l.action === "Edição").length}</h3>
                </StatIconWrapper>
                <span>Modificações</span>
              </AuditStatCard>

              <AuditStatCard>
                <StatIconWrapper bgColor="#fee2e2" iconColor="#dc2626">
                  <div className="icon-box">
                    <WarningCircleIcon size={20} weight="bold" />
                  </div>
                  <h3 style={{ color: "#dc2626" }}>{logs.filter(l => l.action === "Exclusão").length}</h3>
                </StatIconWrapper>
                <span>Eventos Críticos</span>
              </AuditStatCard>
            </MiniGrid>
          </BoxInfo>
        </GridColumn>
      </ResponsiveRow>

      {/* TABELA */}
      <ResponsiveRow>
        <GridColumn weight={1}>
          <BoxInfo>
            <SectionTitle>Registros de Auditoria</SectionTitle>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Usuário</th>
                    <th>Ação</th>
                    <th>Recurso</th>
                    <th>IP</th>
                    <th>Detalhes</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.map((log) => (
                    <Fragment key={log.id}>
                      <tr
                        onClick={() =>
                          setExpandedRow(expandedRow === log.id ? null : log.id)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <td>{log.timestamp}</td>
                        <td>{log.user}</td>
                        <td>{log.action}</td>
                        <td>{log.resource}</td>
                        <td>{log.ip}</td>
                        <td>{expandedRow === log.id ? "▲" : "▼"}</td>
                      </tr>
                      {expandedRow === log.id && (
                        <tr>
                          <td colSpan={6}>
                            <AuditDetailsBox>
                              <p>
                                <span className="campo">Campo alterado:</span>{" "}
                                {log.details.campo}
                              </p>
                              <p>
                                <span className="campo">Valor anterior:</span>{" "}
                                {log.details.anterior} → <strong>{log.details.atual}</strong>
                              </p>
                              <p>
                                <span className="campo">User Agent:</span> {log.details.userAgent}
                              </p>
                              <p>
                                <span className="campo">Justificativa:</span>{" "}
                                {log.details.justificativa}
                              </p>
                            </AuditDetailsBox>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>

            {/* Paginação */}
            <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1rem" }}>
              <Button
                text="Anterior"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                variant="secondary"
              />
              <span style={{ alignSelf: "center" }}>
                {currentPage} / {totalPages}
              </span>
              <Button
                text="Próximo"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                variant="secondary"
              />
            </div>

            <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
              <p style={{ color: "#64748b" }}>
                Mostrando {paginatedLogs.length} de {filteredLogs.length} registros filtrados
              </p>
            </div>
          </BoxInfo>
        </GridColumn>
      </ResponsiveRow>

      {/* AVISO DE COMPLIANCE */}
      <ResponsiveRow>
        <GridColumn weight={1}>
          <AuditFooterNotice>
            <strong>Compliance LGPD</strong>
            <br />
            Os logs de auditoria contêm apenas dados pessoais mínimos
            necessários para fins de segurança e compliance. Política de
            retenção: 12 meses. Para solicitações de exclusão ou anonimização,
            entre em contato com o DPO.
          </AuditFooterNotice>
        </GridColumn>
      </ResponsiveRow>
    </ContainerPainel>
  );
}
