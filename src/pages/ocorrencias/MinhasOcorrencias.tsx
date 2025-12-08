/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState, useContext } from "react";
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
    AuditStatCard,
    SavedFilterCard,
    MiniGrid,
    PageTopHeaderColumn,
    StatusBadge,
    CardLabel,
    CardValue,
    CardRow,
    CardActions,
    CardBody,
    CardDate,
    CardFooter,
    CardHeader,
    CardId,
    CardInfoRow,
    EnhancedOcorrenciaCard,
    ResponsiveRow,
    GridColumn,
} from "../../components/EstilosPainel.styles";

import { PlusIcon } from "@phosphor-icons/react";
import { Button } from "../../components/Button";
import { AuthContext } from "../../context/AuthContext";

// API refatorada (certifique que getOcorrenciaPorId exista no seu api.ts)
import {
    fetchOcorrenciasUsuario,
    fetchNaturezasOcorrencias,
    fetchUsuario,
    getOcorrenciaPorId,
} from "../../services/api";

type FiltroSalvo = {
    id: string;
    name: string;
    values: typeof defaultFilters;
};

const STATUS_OPTIONS = ["Pendente", "Em andamento", "Concluída", "Não Atendida"];

const defaultFilters = {
    periodoInicio: "",
    periodoFim: "",
    tipo: "todos",
    regiao: "todas",
    viatura: "",
    buscaLivre: "",
    status: [...STATUS_OPTIONS],
    natureza: "todos",
};

export function MinhasOcorrencias(): JSX.Element {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const usuarioLogadoId = auth?.user?.id as number | undefined;
    const [usuarioLogado, setUsuarioLogado] = useState<any>(null);

    const [filters, setFilters] = useState(defaultFilters);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 6;

    const [savedFilters, setSavedFilters] = useState<FiltroSalvo[]>([]);
    const [showModalSaveFilter, setShowModalSaveFilter] = useState(false);
    const [newFilterName, setNewFilterName] = useState("");

    const [rawOcorrencias, setRawOcorrencias] = useState<any[]>([]);
    const [ocorrencias, setOcorrencias] = useState<any[]>([]); // mapeadas / prontas para UI

    const [localizacoesDisponiveis, setLocalizacoesDisponiveis] = useState<string[]>([]);
    const [naturezasOcorrencias, setNaturezasOcorrencias] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Modal detalhe
    const [openDetailId, setOpenDetailId] = useState<number | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailData, setDetailData] = useState<any | null>(null);
    const [detailError, setDetailError] = useState<string | null>(null);

    // Carrega usuário logado
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                if (!usuarioLogadoId) return;
                const u = await fetchUsuario(usuarioLogadoId);
                if (mounted) setUsuarioLogado(u);
            } catch (err) {
                console.error("Erro ao buscar usuário:", err);
            }
        })();
        return () => { mounted = false; };
    }, [usuarioLogadoId]);

    // Carrega opções (naturezas)
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const natData = await fetchNaturezasOcorrencias();
                if (!mounted) return;
                setNaturezasOcorrencias(Array.isArray(natData) ? natData.map((n: any) => n.nome).filter(Boolean) : []);
            } catch (err) {
                console.error("Erro ao buscar opções:", err);
            }
        })();
        return () => { mounted = false; };
    }, []);

    // Carrega ocorrencias do usuário (raw)
    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError(null);

        (async () => {
            try {
                if (!usuarioLogadoId) return;
                const data = await fetchOcorrenciasUsuario(usuarioLogadoId);
                if (!mounted) return;
                setRawOcorrencias(Array.isArray(data) ? data : []);
            } catch (err: any) {
                console.error("Erro ao buscar ocorrências do usuário:", err);
                if (mounted) setError("Erro ao carregar ocorrências.");
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => { mounted = false; };
    }, [usuarioLogadoId]);

    // Mapeia rawOcorrencias -> ocorrencias para UI (adiciona origId, idLabel, datas, status legível)
    useEffect(() => {
        const mapped = rawOcorrencias.map((o: any) => {
            const dataObj = o?.dataHoraChamada ? new Date(o.dataHoraChamada) : null;

            let dataFormatada = "N/A";
            let horaFormatada = "";
            let dataTimestamp: number | undefined = undefined;
            let dataISO: string | undefined = undefined;

            if (dataObj && !isNaN(dataObj.getTime())) {
                dataFormatada = dataObj.toLocaleDateString("pt-BR");
                horaFormatada = dataObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
                dataTimestamp = dataObj.getTime();
                dataISO = dataObj.toISOString();
            }

            const statusReadable =
                o.statusAtendimento === "pendente" ? "Pendente"
                    : o.statusAtendimento === "em_andamento" ? "Em andamento"
                        : o.statusAtendimento === "concluida" ? "Concluída"
                            : o.statusAtendimento === "nao_atendido" ? "Não Atendida"
                                : String(o.statusAtendimento || "Desconhecido");

            return {
                origId: o.id, // id numérico usado para GET /ocorrencias/:id
                idLabel: o.numeroOcorrencia || `#OCR-${o.id}`,
                data: dataFormatada,
                hora: horaFormatada,
                dataTimestamp,
                dataISO,
                natureza: o.naturezaOcorrencia?.nome || "N/A",
                localizacao: o.localizacao ? `${o.localizacao.municipio} - ${o.localizacao.bairro}` : "Não informada",
                viatura: o.viatura ? `${o.viatura.tipo}-${o.viatura.numero}` : "Sem viatura",
                status: statusReadable,
                responsavel: o.usuario?.nome || "N/A",
                isConcluida: o.statusAtendimento === "concluida",
                raw: o,
            };
        });

        // Ordenar: pendentes primeiro, depois por timestamp (desc)
        mapped.sort((a: any, b: any) => {
            if (a.status === "Pendente" && b.status !== "Pendente") return -1;
            if (a.status !== "Pendente" && b.status === "Pendente") return 1;
            const ta = a.dataTimestamp || 0;
            const tb = b.dataTimestamp || 0;
            return tb - ta;
        });

        setOcorrencias(mapped);

        // popula localizacoesDisponiveis a partir das localizacoes únicas presentes
        const uniqueLocs: string[] = Array.from(new Set(
            mapped.map((m: any) => (m.localizacao || "")).filter((l: string) => l && l !== "Não informada")
        )).map(String).sort();
        setLocalizacoesDisponiveis(uniqueLocs);
    }, [rawOcorrencias]);

    // Filtragem (mesma lógica que tinha, mas com origId e idLabel)
    const filteredOcorrencias = useMemo(() => {
        return ocorrencias.filter(o => {
            const { periodoInicio, periodoFim, regiao, viatura, buscaLivre, status, natureza } = filters;
            const matchLocalizacao = regiao === "todas" || o.localizacao === regiao;
            const matchNatureza = natureza === "todos" || o.natureza.toLowerCase() === natureza.toLowerCase();
            const matchViatura = !viatura || o.viatura.toLowerCase().includes(viatura.toLowerCase());
            const matchBusca = !buscaLivre ||
                o.idLabel.toLowerCase().includes(buscaLivre.toLowerCase()) ||
                o.responsavel.toLowerCase().includes(buscaLivre.toLowerCase()) ||
                o.localizacao.toLowerCase().includes(buscaLivre.toLowerCase());

            const matchStatus = status.includes(o.status);

            let matchPeriodo = true;
            const ts = o.dataTimestamp ?? (new Date(o.data).getTime());
            if (periodoInicio) {
                const startTs = new Date(periodoInicio + "T00:00:00").getTime();
                matchPeriodo = ts >= startTs;
            }
            if (periodoFim) {
                const endTs = new Date(periodoFim + "T23:59:59.999").getTime();
                matchPeriodo = matchPeriodo && ts <= endTs;
            }

            return matchLocalizacao && matchNatureza && matchViatura && matchBusca && matchPeriodo && matchStatus;
        });
    }, [ocorrencias, filters]);

    // Paginação
    const totalPages = Math.max(1, Math.ceil(filteredOcorrencias.length / pageSize));
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
        if (currentPage < 1) setCurrentPage(1);
    }, [currentPage, totalPages]);

    const paginatedOcorrencias = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredOcorrencias.slice(start, start + pageSize);
    }, [filteredOcorrencias, currentPage]);

    useEffect(() => setCurrentPage(1), [filters]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Em andamento": return "#3B82F6";
            case "Concluída": return "#10B981";
            case "Pendente": return "#EF4444";
            case "Não Atendida": return "#F59E0B";
            default: return "#6B7280";
        }
    };

    // Ações
    const handleNovaOcorrencia = () => navigate("/ocorrencias/cadastrar");
    const handleSalvarFiltro = () => setShowModalSaveFilter(true);
    const handleConfirmSave = () => {
        if (!newFilterName.trim()) return alert("Informe um nome para o filtro!");
        setSavedFilters(prev => [...prev, { id: String(Date.now()), name: newFilterName, values: { ...filters } }]);
        setNewFilterName("");
        setShowModalSaveFilter(false);
    };
    const handleApplySavedFilter = (f: FiltroSalvo) => setFilters(f.values);

    // Detalhes: abre modal e busca via getOcorrenciaPorId
    const openDetalhes = async (origId: number) => {
        setOpenDetailId(origId);
        setDetailLoading(true);
        setDetailError(null);
        setDetailData(null);
        try {
            const data = await getOcorrenciaPorId(origId);
            setDetailData(data);
        } catch (err) {
            console.error("Erro ao buscar detalhe:", err);
            setDetailError("Não foi possível carregar detalhes.");
        } finally {
            setDetailLoading(false);
        }
    };

    const closeDetalhes = () => {
        setOpenDetailId(null);
        setDetailData(null);
        setDetailError(null);
    };

    return (
        <ContainerPainel>
            <PageTopHeaderRow>
                <PageTopHeaderColumn>
                    <PageTitle>Minhas Ocorrências</PageTitle>
                    <PageSubtitle>
                        {usuarioLogado ? `Ocorrências atribuídas a ${usuarioLogado.nome}` : "Carregando..."}
                    </PageSubtitle>
                </PageTopHeaderColumn>

                <ActionsRow>
                    <Button
                        variant="danger"
                        text={<><PlusIcon size={18} weight="bold" /> Nova Ocorrência</>}
                        onClick={handleNovaOcorrencia}
                    />
                </ActionsRow>
            </PageTopHeaderRow>

            {/* Estatísticas */}
            <MiniGrid style={{ marginBottom: '1.5rem' }}>
                {/*
                  Tornamos os cards clicáveis: Total / Pendente / Em andamento / Concluída
                  E aplicamos um estilo simples quando estiverem selecionados.
                */}
                {(() => {
                    const counts = {
                        total: ocorrencias.length,
                        pendente: ocorrencias.filter(o => o.status === "Pendente").length,
                        andamento: ocorrencias.filter(o => o.status === "Em andamento").length,
                        concluida: ocorrencias.filter(o => o.status === "Concluída").length,
                        naoAtendida: ocorrencias.filter(o => o.status === "Não Atendida").length,
                    };

                    const allSelected = filters.status.length === STATUS_OPTIONS.length;
                    const isSelectedStatus = (s: string) => !allSelected && filters.status.length === 1 && filters.status[0] === s;
                    const selectStatus = (s: string | 'Total') => {
                        if (s === 'Total') {
                            setFilters(f => ({ ...f, status: [...STATUS_OPTIONS] }));
                        } else {
                            setFilters(f => ({ ...f, status: [s] }));
                        }
                        setCurrentPage(1);
                    };

                    return (
                        <>
                            <AuditStatCard
                                onClick={() => selectStatus('Total')}
                                style={{ cursor: 'pointer', border: allSelected ? '2px solid #3B82F6' : undefined, boxShadow: allSelected ? '0 0 0 4px rgba(59,130,246,0.08)' : undefined }}
                            >
                                <h3>{counts.total}</h3><span>Total</span>
                            </AuditStatCard>

                            <AuditStatCard
                                onClick={() => selectStatus('Pendente')}
                                style={{ cursor: 'pointer', border: isSelectedStatus('Pendente') ? '2px solid #EF4444' : undefined, boxShadow: isSelectedStatus('Pendente') ? '0 0 0 4px rgba(239,68,68,0.08)' : undefined }}
                            >
                                <h3>{counts.pendente}</h3><span>Pendentes</span>
                            </AuditStatCard>

                            <AuditStatCard
                                onClick={() => selectStatus('Em andamento')}
                                style={{ cursor: 'pointer', border: isSelectedStatus('Em andamento') ? '2px solid #3B82F6' : undefined, boxShadow: isSelectedStatus('Em andamento') ? '0 0 0 4px rgba(59,130,246,0.08)' : undefined }}
                            >
                                <h3>{counts.andamento}</h3><span>Em Andamento</span>
                            </AuditStatCard>

                            <AuditStatCard
                                onClick={() => selectStatus('Concluída')}
                                style={{ cursor: 'pointer', border: isSelectedStatus('Concluída') ? '2px solid #10B981' : undefined, boxShadow: isSelectedStatus('Concluída') ? '0 0 0 4px rgba(16,185,129,0.08)' : undefined }}
                            >
                                <h3>{counts.concluida}</h3><span>Concluídas</span>
                            </AuditStatCard>

                            <AuditStatCard
                                onClick={() => selectStatus('Não Atendida')}
                                style={{ cursor: 'pointer', border: isSelectedStatus('Não Atendida') ? '2px solid #F59E0B' : undefined, boxShadow: isSelectedStatus('Não Atendida') ? '0 0 0 4px rgba(245,158,11,0.08)' : undefined }}
                            >
                                <h3>{counts.naoAtendida}</h3><span>Não Atendidas</span>
                            </AuditStatCard>
                        </>
                    );
                })()}
             </MiniGrid>

            <ResponsiveRow>
                <GridColumn weight={1}>
                    <BoxInfo>
                        <SectionTitle style={{ marginBottom: '1rem' }}>Filtros</SectionTitle>

                        <Grid style={{ gap: '1rem' }}>
                            <Field>
                                <label>Período</label>
                                <DateRange>
                                    <input type="date" value={filters.periodoInicio} onChange={e => setFilters(f => ({ ...f, periodoInicio: e.target.value }))} />
                                    <input type="date" value={filters.periodoFim} onChange={e => setFilters(f => ({ ...f, periodoFim: e.target.value }))} />
                                </DateRange>
                            </Field>

                            <Field>
                                <label>Natureza</label>
                                <select value={filters.natureza} onChange={e => setFilters(f => ({ ...f, natureza: e.target.value }))}>
                                    <option value="todos">Todas</option>
                                    {naturezasOcorrencias.map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </Field>

                            <Field>
                                <label>Localização (Município - Bairro)</label>
                                <select value={filters.regiao} onChange={e => setFilters(f => ({ ...f, regiao: e.target.value }))}>
                                    <option value="todas">Todas</option>
                                    {localizacoesDisponiveis.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </Field>

                            <Field>
                                <label>Viatura / Equipe</label>
                                <input type="text" placeholder="Buscar viatura..." value={filters.viatura} onChange={e => setFilters(f => ({ ...f, viatura: e.target.value }))} />
                            </Field>

                            <Field>
                                <label>Busca Livre</label>
                                <input type="text" placeholder="ID, local, responsável..." value={filters.buscaLivre} onChange={e => setFilters(f => ({ ...f, buscaLivre: e.target.value }))} />
                            </Field>

                            <Field>
                                <label>Status</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {STATUS_OPTIONS.map(s => (
                                        <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.95rem' }}>
                                            <input
                                                type="checkbox"
                                                checked={filters.status.includes(s)}
                                                onChange={e => setFilters(f => ({
                                                    ...f,
                                                    status: e.target.checked ? [...f.status, s] : f.status.filter(x => x !== s)
                                                }))}
                                            />
                                            {s}
                                        </label>
                                    ))}
                                </div>
                            </Field>
                        </Grid>

                        <ActionsRow style={{ marginTop: '1.5rem' }}>
                            <Button text="Limpar Tudo" variant="secondary" onClick={() => setFilters(defaultFilters)} />
                            <Button text="Salvar Filtro" variant="primary" onClick={handleSalvarFiltro} />
                        </ActionsRow>

                        {savedFilters.length > 0 && (
                            <>
                                <SectionTitle style={{ margin: '2rem 0 0.75rem' }}>Filtros Salvos</SectionTitle>
                                {savedFilters.map(f => (
                                    <SavedFilterCard key={f.id} onClick={() => handleApplySavedFilter(f)}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span className="filter-name">{f.name}</span>
                                            <button onClick={e => { e.stopPropagation(); setSavedFilters(p => p.filter(x => x.id !== f.id)); }}
                                                style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '1.2rem' }}>×</button>
                                        </div>
                                    </SavedFilterCard>
                                ))}
                            </>
                        )}
                    </BoxInfo>
                </GridColumn>

                {/* ==== CONTEÚDO PRINCIPAL - CARDS ==== */}
                <GridColumn weight={3}>
                    <BoxInfo>
                        <SectionTitle>
                            Ocorrências ({filteredOcorrencias.length})
                        </SectionTitle>

                        {loading && <p style={{ color: '#64748b', textAlign: 'center', padding: '3rem 0' }}>Carregando ocorrências...</p>}
                        {error && <p style={{ color: '#dc2626', textAlign: 'center' }}>{error}</p>}

                        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
                            {paginatedOcorrencias.map(o => (
                                <EnhancedOcorrenciaCard key={o.origId} color={getStatusColor(o.status)}>
                                    <CardHeader>
                                        <CardId>{o.idLabel}</CardId>
                                        <CardDate>
                                            {o.data}
                                            <strong>{o.hora}</strong>
                                        </CardDate>
                                    </CardHeader>

                                    <CardBody>
                                        <CardInfoRow>
                                            <span><strong>Natureza:</strong> {o.natureza}</span>
                                        </CardInfoRow>
                                        <CardInfoRow>
                                            <span><strong>Local:</strong> {o.localizacao}</span>
                                        </CardInfoRow>
                                        <CardInfoRow>
                                            <span><strong>Viatura:</strong> {o.viatura}</span>
                                        </CardInfoRow>
                                    </CardBody>

                                    <CardFooter>
                                        <CardActions>
                                            <Button text="Ver" variant="secondary"
                                                onClick={() => navigate(`/ocorrencias/${o.origId}`)} />
                                            <Button text="Detalhes" variant="primary"
                                                onClick={() => openDetalhes(o.origId)} />
                                        </CardActions>
                                        <StatusBadge cor={getStatusColor(o.status)}>{o.status}</StatusBadge>
                                    </CardFooter>
                                </EnhancedOcorrenciaCard>
                            ))}
                        </div>

                        {/* Paginação */}
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                            <Button text="Anterior"
                                onClick={() => {
                                    if (currentPage === 1) return;
                                    setCurrentPage(p => Math.max(1, p - 1));
                                }} />
                            <span><strong>{currentPage}</strong> / {totalPages}</span>
                            <Button text="Próximo"
                                onClick={() => {
                                    if (currentPage === totalPages) return;
                                    setCurrentPage(p => Math.min(totalPages, p + 1));
                                }} />
                        </div>
                    </BoxInfo>
                </GridColumn>
            </ResponsiveRow>

            {/* Modal Salvar Filtro */}
            {showModalSaveFilter && (
                <div onClick={() => setShowModalSaveFilter(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
                    <BoxInfo onClick={e => e.stopPropagation()} style={{ width: 360 }}>
                        <h3>Salvar Filtro</h3>
                        <input type="text" placeholder="Nome do filtro" value={newFilterName} onChange={e => setNewFilterName(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 8 }} />
                        <ActionsRow style={{ marginTop: 12 }}>
                            <Button text="Cancelar" onClick={() => setShowModalSaveFilter(false)} variant="secondary" />
                            <Button text="Salvar" onClick={handleConfirmSave} variant="primary" />
                        </ActionsRow>
                    </BoxInfo>
                </div>
            )}

            {/* Modal Detalhes */}
            {openDetailId !== null && (
                <div onClick={closeDetalhes} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10000 }}>
                    <BoxInfo onClick={e => e.stopPropagation()} style={{ width: "95%", maxWidth: 900, maxHeight: "80vh", overflow: "auto" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3>Detalhes da Ocorrência {openDetailId}</h3>
                            <div>
                                <Button text="Fechar" onClick={closeDetalhes} variant="secondary" />
                            </div>
                        </div>

                        {detailLoading && <p>Carregando detalhes...</p>}
                        {detailError && <p style={{ color: "#ef4444" }}>{detailError}</p>}
                        {detailData && (
                            <div style={{ marginTop: 8 }}>
                                <CardRow>
                                    <CardLabel>ID</CardLabel>
                                    <CardValue>{detailData.numeroOcorrencia || detailData.id}</CardValue>
                                </CardRow>

                                <CardRow>
                                    <CardLabel>Natureza</CardLabel>
                                    <CardValue>{detailData.naturezaOcorrencia?.nome || "N/A"}</CardValue>
                                </CardRow>

                                <CardRow>
                                    <CardLabel>Descrição</CardLabel>
                                    <CardValue style={{ fontWeight: 400 }}>{detailData.descricao || "—"}</CardValue>
                                </CardRow>

                                <CardRow>
                                    <CardLabel>Localização completa</CardLabel>
                                    <CardValue>
                                        {detailData.localizacao ? `${detailData.localizacao.municipio || ""} - ${detailData.localizacao.bairro || ""}, ${detailData.localizacao.logradouro || ""} ${detailData.localizacao.numero || ""}` : "Não informada"}
                                    </CardValue>
                                </CardRow>

                                <CardRow>
                                    <CardLabel>Viatura</CardLabel>
                                    <CardValue>{detailData.viatura ? `${detailData.viatura.tipo}-${detailData.viatura.numero}` : "Sem viatura"}</CardValue>
                                </CardRow>

                                <CardRow>
                                    <CardLabel>Usuario</CardLabel>
                                    <CardValue>{detailData.usuario?.nome || "N/A"} — {detailData.usuario?.matricula || ""}</CardValue>
                                </CardRow>

                                <div style={{ marginTop: 12 }}>
                                    <CardLabel>Anexos</CardLabel>
                                    <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                                        {Array.isArray(detailData.anexos) && detailData.anexos.length > 0 ? detailData.anexos.map((a: any) => (
                                            <a key={a.id || a.urlArquivo} href={a.urlArquivo} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                                                <div style={{ padding: 8, border: "1px solid #e2e8f0", borderRadius: 8, minWidth: 120, textAlign: "center" }}>
                                                    <div style={{ fontSize: 13, fontWeight: 600 }}>{a.nomeArquivo || a.urlArquivo?.split("/").pop()}</div>
                                                    <div style={{ fontSize: 12, color: "#64748b" }}>{a.tipoArquivo || a.extensaoArquivo}</div>
                                                </div>
                                            </a>
                                        )) : <div style={{ color: "#64748b" }}>Nenhum anexo</div>}
                                    </div>
                                </div>

                                <pre style={{ marginTop: 12, background: "#f8fafc", padding: 12, borderRadius: 8, overflow: "auto", fontSize: 12 }}>
                                    {JSON.stringify(detailData, null, 2)}
                                </pre>
                            </div>
                        )}
                    </BoxInfo>
                </div>
            )}
        </ContainerPainel>
    );
}

export default MinhasOcorrencias;