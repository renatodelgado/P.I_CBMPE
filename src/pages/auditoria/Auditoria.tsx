import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "../../components/Button";
import { Fragment, useEffect, useMemo, useState } from "react";
import {
  ContainerPainel,
  PageTopHeader,
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
} from "../../components/EstilosPainel.styles";
import { fetchLogAuditoria } from "../../services/api";
import { formatDate } from "../../utils/formatDate";

type AuditLog = {
  id: number;
  timestamp: string;
  acao: string;
  recurso: string;
  detalhes: unknown;
  ip: string;
  userAgent?: string;
  justificativa?: string | null;
  usuarioId?: number | null;
  userName?: string | null;
};

const extractUserNameFromDetails = (detalhes: unknown): string | null => {
  try {
    if (!detalhes) return null;

    // ✅ Se vier como string, converter para objeto
    const parsed =
      typeof detalhes === "string" ? JSON.parse(detalhes) : detalhes;

    if (!parsed || typeof parsed !== "object") return null;

    const changes = (parsed as Record<string, unknown>).changes as Record<string, unknown>;
    const after = changes?.after as Record<string, unknown> | undefined;
    const usuario = after?.usuario as Record<string, unknown> | undefined;
    const nome = usuario?.nome;

    if (typeof nome === "string" && nome.trim()) {
      return nome.trim();
    }

    return null;
  } catch (e) {
    console.warn("Falha ao extrair nome do usuário do audit log", e);
    return null;
  }
};


const getUserFilterKey = (log: AuditLog): string => {
  if (log.userName) return `name:${log.userName}`;
  if (log.usuarioId != null) return `id:${log.usuarioId}`;
  return "unknown";
};

const buildUserDisplay = (log: AuditLog): string => {
  if (log.userName) return log.userName;
  if (log.usuarioId != null) return `Usuário #${log.usuarioId}`;
  return "Desconhecido";
};

const buildUserOptions = (logs: AuditLog[]) => {
  const map = new Map<string, string>();

  logs.forEach((log) => {
    if (log.userName) {
      map.set(`name:${log.userName}`, log.userName);
    } else if (log.usuarioId != null) {
      const key = `id:${log.usuarioId}`;
      map.set(key, `Usuário #${log.usuarioId}`);
    } else {
      map.set("unknown", "Desconhecido");
    }
  });

  return Array.from(map.entries())
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

const parseLogDate = (value: string): Date | null => {
  if (!value) return null;
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDateTime = (value: string) => {
  const dt = parseLogDate(value);
  if (!dt) return value || "-";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(dt);
};

const parseDetalhes = (detalhes: unknown) => {
  const raw = typeof detalhes === "string" ? detalhes : JSON.stringify(detalhes ?? "");
  try {
    const parsed = typeof detalhes === "string" ? JSON.parse(detalhes) : detalhes;
    return {
      parsed,
      pretty: JSON.stringify(parsed, null, 2),
      raw,
    };
  } catch {
    return { parsed: null, pretty: raw, raw };
  }
};

export function Auditoria() {
  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");
  const [user, setUser] = useState("");
  const [eventType, setEventType] = useState("");
  const [resource, setResource] = useState("");
  const [searchText, setSearchText] = useState("");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10;

 useEffect(() => {
  let active = true;
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLogAuditoria();
      if (!active) return;

      const processedLogs: AuditLog[] = (Array.isArray(data) ? data : []).map((log: Omit<AuditLog, 'userName'>) => ({
        ...log,
        userName: extractUserNameFromDetails(log.detalhes),
      }));

      setLogs(processedLogs);
    } catch (err) {
      if (!active) return;
      console.error("Erro ao carregar logs de auditoria:", err);
      setError("Não foi possível carregar os logs agora.");
      setLogs([]);
    } finally {
      if (active) setLoading(false);
    }
  };

  load();
  return () => {
    active = false;
  };
}, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [periodFrom, periodTo, user, eventType, resource, searchText]);

  const userOptions = useMemo(() => buildUserOptions(logs), [logs]);
  const uniqueActions = useMemo(
    () => Array.from(new Set(logs.map((l) => l.acao).filter(Boolean))),
    [logs]
  );
  const uniqueResources = useMemo(
    () => Array.from(new Set(logs.map((l) => l.recurso).filter(Boolean))),
    [logs]
  );

const filteredLogs = useMemo(() => {
  const fromDate = periodFrom ? new Date(`${periodFrom}T00:00:00`) : null;
  const toDate = periodTo ? new Date(`${periodTo}T23:59:59.999`) : null;

  return logs.filter((log) => {
    const logDate = parseLogDate(log.timestamp);
    if (fromDate && (!logDate || logDate < fromDate)) return false;
    if (toDate && (!logDate || logDate > toDate)) return false;

    // CORREÇÃO AQUI: usar a mesma chave do filtro
    if (user) {
      const currentKey = getUserFilterKey(log);
      if (currentKey !== user) return false;
    }

    if (eventType && log.acao !== eventType) return false;
    if (resource && log.recurso !== resource) return false;

    if (searchText) {
      const detailsRaw = typeof log.detalhes === "string" ? log.detalhes : JSON.stringify(log.detalhes ?? "");
      const searchable = [
        log.id,
        log.recurso,
        log.acao,
        log.ip,
        log.userAgent,
        log.justificativa,
        log.userName || "",
        detailsRaw,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!searchable.includes(searchText.toLowerCase())) return false;
    }

    return true;
  });
}, [logs, periodFrom, periodTo, user, eventType, resource, searchText]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedLogs = filteredLogs.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const stats = useMemo(() => {
    const uniqueUsersCount = new Set(logs.map((l) => (l.usuarioId != null ? String(l.usuarioId) : "desconhecido"))).size;
    const creations = logs.filter((l) => (l.acao || "").toLowerCase().includes("create")).length;
    const critical = logs.filter((l) => {
      const a = (l.acao || "").toLowerCase();
      return a.includes("delete") || a.includes("exclus") || a.includes("remove");
    }).length;

    return { total: logs.length, uniqueUsersCount, creations, critical };
  }, [logs]);

  const handleCancel = () => {
    setPeriodFrom("");
    setPeriodTo("");
    setUser("");
    setEventType("");
    setResource("");
    setSearchText("");
    setExpandedRow(null);
    setCurrentPage(1);
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
    user ? { label: `Usuário: ${userOptions.find((u) => u.value === user)?.label || `#${user}`}`, key: "user" } : null,
    eventType ? { label: `Evento: ${eventType}`, key: "eventType" } : null,
    resource ? { label: `Recurso: ${resource}`, key: "resource" } : null,
    searchText ? { label: `Busca: "${searchText}"`, key: "searchText" } : null,
  ].filter(Boolean) as { label: string; key: string }[];

  return (
    <ContainerPainel>
      <PageTopHeader>
        <PageTitle>Auditoria & Logs</PageTitle>
        <PageSubtitle>Trilha de auditoria completa para compliance e investigação.</PageSubtitle>
      </PageTopHeader>

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
                  {userOptions.map((u) => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
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
                text={<XIcon size={16} weight="bold" />}
                type="button"
                variant="secondary"
                onClick={handleCancel}
                style={{ padding: "8px 14px", borderRadius: 6 }}
              />
              <Button
                text={<MagnifyingGlassIcon size={16} weight="bold" />}
                type="button"
                variant="danger"
                onClick={() => setCurrentPage(1)} // reseta paginação ao filtrar
                style={{ borderRadius: 6 }}
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
                <h3>{loading ? "..." : stats.total}</h3>
                <span>Total de logs</span>
              </AuditStatCard>
              <AuditStatCard>
                <h3>{loading ? "..." : stats.uniqueUsersCount}</h3>
                <span>Usuários únicos</span>
              </AuditStatCard>
              <AuditStatCard>
                <h3>{loading ? "..." : stats.creations}</h3>
                <span>Criações/novos registros</span>
              </AuditStatCard>
              <AuditStatCard>
                <h3 style={{ color: "#dc2626" }}>{loading ? "..." : stats.critical}</h3>
                <span>Eventos críticos</span>
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
                {loading && (
                  <tr>
                    <td colSpan={6}>Carregando logs...</td>
                  </tr>
                )}
                {!loading && error && (
                  <tr>
                    <td colSpan={6}>{error}</td>
                  </tr>
                )}
                {!loading && !error && paginatedLogs.length === 0 && (
                  <tr>
                    <td colSpan={6}>Nenhum registro encontrado</td>
                  </tr>
                )}
                {!loading && !error && paginatedLogs.map((log) => {
  const displayName = buildUserDisplay(log);
  const detalhes = parseDetalhes(log.detalhes);

  return (
    <Fragment key={log.id}>
      <tr
        onClick={() => setExpandedRow(expandedRow === log.id ? null : log.id)}
        style={{ cursor: "pointer" }}
      >
        <td>{formatDateTime(log.timestamp)}</td>
        <td>
          <strong>{displayName}</strong>
          {log.usuarioId != null && !log.userName && <small style={{opacity: 0.7}}> (ID: {log.usuarioId})</small>}
        </td>
        <td>{log.acao}</td>
        <td>{log.recurso}</td>
        <td>{log.ip}</td>
        <td>{expandedRow === log.id ? "▲" : "▼"}</td>
      </tr>
                      {expandedRow === log.id && (
                        <tr>
                          <td colSpan={6}>
                            <AuditDetailsBox>
                              <p>
                                <span className="campo">User Agent:</span> {log.userAgent || "—"}
                              </p>
                              <p>
                                <span className="campo">Justificativa:</span> {log.justificativa || "—"}
                              </p>
                              <p>
                                <span className="campo">Usuário ID:</span> {log.usuarioId ?? "—"}
                              </p>
                              <p style={{ marginBottom: 6 }}>
                                <span className="campo">Detalhes (JSON):</span>
                              </p>
                              <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{detalhes.pretty}</pre>
                            </AuditDetailsBox>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </Table>
            </TableWrapper>

            {/* Paginação */}
            <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1rem" }}>
              <Button
                text="Anterior"
                onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
                variant="secondary"
              />
              <span style={{ alignSelf: "center" }}>
                {safePage} / {totalPages}
              </span>
              <Button
                text="Próximo"
                onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))}
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
