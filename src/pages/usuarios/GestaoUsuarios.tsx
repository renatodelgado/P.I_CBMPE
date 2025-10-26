import { useMemo, useState, useEffect } from "react";
import {
    ContainerPainel,
    PageTitle,
    PageSubtitle,
    ResponsiveRow,
    GridColumn,
    BoxInfo,
    Grid,
    Field,
    Table,
    ActionsRow,
    PageTopHeaderRow,
    PageTopHeaderColumn,
    TableWrapper,
} from "../../components/EstilosPainel.styles";
import { PlusIcon, PencilIcon, TrashIcon, DotsThreeIcon } from "@phosphor-icons/react";
import { Button } from "../../components/Button";
import { useNavigate } from "react-router-dom";

export function GestaoUsuarios() {
    // dados iniciais (substitua por f e etch da sua API quando disponível)
    const usuarios = useMemo(() => [
        {
            nome: "Roberto Almeida",
            email: "roberto.almeida@cbm.pe.gov.br",
            matricula: "12345",
            perfil: "Administrador",
            unidade: "1º BPM - Recife",
            status: "Ativo",
            ultimoAcesso: "25/09/2025 14:30",
            foto: "https://i.pravatar.cc/50?img=1",
        },
        {
            nome: "Juliana Costa",
            email: "juliana.costa@cbm.pe.gov.br",
            matricula: "23456",
            perfil: "Operador de Campo",
            unidade: "2º BPM - Olinda",
            status: "Inativo",
            ultimoAcesso: "25/09/2025 10:15",
            foto: "https://i.pravatar.cc/50?img=2",
        },
        {
            nome: "Camila Rocha",
            email: "camila.rocha@cbm.pe.gov.br",
            matricula: "34567",
            perfil: "Gestor de Ocorrências",
            unidade: "3º BPM - Jaboatão",
            status: "Suspenso",
            ultimoAcesso: "20/09/2025 16:43",
            foto: "https://i.pravatar.cc/50?img=3",
        },
        {
            nome: "Fernando Silva",
            email: "fernando.silva@cbm.pe.gov.br",
            matricula: "45678",
            perfil: "Operador de Campo",
            unidade: "2º BPM - Olinda",
            status: "Ativo",
            ultimoAcesso: "15/09/2025 08:20",
            foto: "https://i.pravatar.cc/50?img=4",
        },
        {
            nome: "Patrícia Nogueira",
            email: "patricia.nogueira@cbm.pe.gov.br",
            matricula: "56789",
            perfil: "Gestor de Ocorrências",
            unidade: "1º BPM - Recife",
            status: "Ativo",
            ultimoAcesso: "12/09/2025 13:10",
            foto: "https://i.pravatar.cc/50?img=5",
        },
        {
            nome: "André Souza",
            email: "andre.souza@cbm.pe.gov.br",
            matricula: "67890",
            perfil: "Administrador",
            unidade: "3º BPM - Jaboatão",
            status: "Ativo",
            ultimoAcesso: "10/09/2025 17:25",
            foto: "https://i.pravatar.cc/50?img=6",
        },
        {
            nome: "Beatriz Melo",
            email: "beatriz.melo@cbm.pe.gov.br",
            matricula: "78901",
            perfil: "Operador de Campo",
            unidade: "2º BPM - Olinda",
            status: "Suspenso",
            ultimoAcesso: "09/09/2025 09:42",
            foto: "https://i.pravatar.cc/50?img=7",
        },
        {
            nome: "Carlos Ramos",
            email: "carlos.ramos@cbm.pe.gov.br",
            matricula: "89012",
            perfil: "Gestor de Ocorrências",
            unidade: "1º BPM - Recife",
            status: "Ativo",
            ultimoAcesso: "08/09/2025 12:18",
            foto: "https://i.pravatar.cc/50?img=8",
        },
        {
            nome: "Daniela Fernandes",
            email: "daniela.fernandes@cbm.pe.gov.br",
            matricula: "90123",
            perfil: "Operador de Campo",
            unidade: "2º BPM - Olinda",
            status: "Inativo",
            ultimoAcesso: "05/09/2025 15:50",
            foto: "https://i.pravatar.cc/50?img=9",
        },
        {
            nome: "Eduardo Lima",
            email: "eduardo.lima@cbm.pe.gov.br",
            matricula: "11223",
            perfil: "Administrador",
            unidade: "1º BPM - Recife",
            status: "Ativo",
            ultimoAcesso: "04/09/2025 08:33",
            foto: "https://i.pravatar.cc/50?img=10",
        },
        {
            nome: "Fábio Barbosa",
            email: "fabio.barbosa@cbm.pe.gov.br",
            matricula: "12234",
            perfil: "Gestor de Ocorrências",
            unidade: "2º BPM - Olinda",
            status: "Inativo",
            ultimoAcesso: "03/09/2025 09:47",
            foto: "https://i.pravatar.cc/50?img=11",
        },
        {
            nome: "Gabriela Torres",
            email: "gabriela.torres@cbm.pe.gov.br",
            matricula: "13345",
            perfil: "Operador de Campo",
            unidade: "1º BPM - Recife",
            status: "Ativo",
            ultimoAcesso: "02/09/2025 11:20",
            foto: "https://i.pravatar.cc/50?img=12",
        },
        {
            nome: "Henrique Castro",
            email: "henrique.castro@cbm.pe.gov.br",
            matricula: "14456",
            perfil: "Administrador",
            unidade: "3º BPM - Jaboatão",
            status: "Suspenso",
            ultimoAcesso: "01/09/2025 10:10",
            foto: "https://i.pravatar.cc/50?img=13",
        },
        {
            nome: "Isabela Moura",
            email: "isabela.moura@cbm.pe.gov.br",
            matricula: "15567",
            perfil: "Gestor de Ocorrências",
            unidade: "2º BPM - Olinda",
            status: "Ativo",
            ultimoAcesso: "30/08/2025 14:55",
            foto: "https://i.pravatar.cc/50?img=14",
        },
        {
            nome: "João Pedro",
            email: "joao.pedro@cbm.pe.gov.br",
            matricula: "16678",
            perfil: "Operador de Campo",
            unidade: "1º BPM - Recife",
            status: "Ativo",
            ultimoAcesso: "29/08/2025 07:40",
            foto: "https://i.pravatar.cc/50?img=15",
        },
        {
            nome: "Karen Duarte",
            email: "karen.duarte@cbm.pe.gov.br",
            matricula: "17789",
            perfil: "Gestor de Ocorrências",
            unidade: "2º BPM - Olinda",
            status: "Inativo",
            ultimoAcesso: "27/08/2025 16:25",
            foto: "https://i.pravatar.cc/50?img=16",
        },
        {
            nome: "Leonardo Farias",
            email: "leonardo.farias@cbm.pe.gov.br",
            matricula: "18890",
            perfil: "Administrador",
            unidade: "3º BPM - Jaboatão",
            status: "Ativo",
            ultimoAcesso: "26/08/2025 10:55",
            foto: "https://i.pravatar.cc/50?img=17",
        },
        {
            nome: "Mariana Pinto",
            email: "mariana.pinto@cbm.pe.gov.br",
            matricula: "19901",
            perfil: "Operador de Campo",
            unidade: "2º BPM - Olinda",
            status: "Suspenso",
            ultimoAcesso: "25/08/2025 09:13",
            foto: "https://i.pravatar.cc/50?img=18",
        },
        {
            nome: "Nelson Albuquerque",
            email: "nelson.albuquerque@cbm.pe.gov.br",
            matricula: "21012",
            perfil: "Gestor de Ocorrências",
            unidade: "1º BPM - Recife",
            status: "Ativo",
            ultimoAcesso: "24/08/2025 17:40",
            foto: "https://i.pravatar.cc/50?img=19",
        },
        {
            nome: "Olívia Ferreira",
            email: "olivia.ferreira@cbm.pe.gov.br",
            matricula: "22123",
            perfil: "Operador de Campo",
            unidade: "2º BPM - Olinda",
            status: "Ativo",
            ultimoAcesso: "22/08/2025 08:25",
            foto: "https://i.pravatar.cc/50?img=20",
        },
        {
            nome: "Paulo Henrique",
            email: "paulo.henrique@cbm.pe.gov.br",
            matricula: "23234",
            perfil: "Administrador",
            unidade: "1º BPM - Recife",
            status: "Suspenso",
            ultimoAcesso: "20/08/2025 11:50",
            foto: "https://i.pravatar.cc/50?img=21",
        },
        {
            nome: "Queila Ramos",
            email: "queila.ramos@cbm.pe.gov.br",
            matricula: "24345",
            perfil: "Gestor de Ocorrências",
            unidade: "1º BPM - Recife",
            status: "Ativo",
            ultimoAcesso: "18/08/2025 13:35",
            foto: "https://i.pravatar.cc/50?img=22",
        },
        {
            nome: "Ricardo Monteiro",
            email: "ricardo.monteiro@cbm.pe.gov.br",
            matricula: "25456",
            perfil: "Operador de Campo",
            unidade: "1º BPM - Recife",
            status: "Inativo",
            ultimoAcesso: "17/08/2025 10:45",
            foto: "https://i.pravatar.cc/50?img=23",
        },
        {
            nome: "Sofia Andrade",
            email: "sofia.andrade@cbm.pe.gov.br",
            matricula: "26567",
            perfil: "Gestor de Ocorrências",
            unidade: "2º BPM - Olinda",
            status: "Ativo",
            ultimoAcesso: "15/08/2025 09:50",
            foto: "https://i.pravatar.cc/50?img=24",
        },
        {
            nome: "Thiago Brito",
            email: "thiago.brito@cbm.pe.gov.br",
            matricula: "27678",
            perfil: "Analista Estatístico",
            unidade: "2º BPM - Olinda",
            status: "Ativo",
            ultimoAcesso: "13/08/2025 14:00",
            foto: "https://i.pravatar.cc/50?img=25",
        },
        {
            nome: "Úrsula Lopes",
            email: "ursula.lopes@cbm.pe.gov.br",
            matricula: "28789",
            perfil: "Gestor de Ocorrências",
            unidade: "3º BPM - Jaboatão",
            status: "Suspenso",
            ultimoAcesso: "11/08/2025 15:30",
            foto: "https://i.pravatar.cc/50?img=26",
        },
        {
            nome: "Vítor Campos",
            email: "vitor.campos@cbm.pe.gov.br",
            matricula: "29890",
            perfil: "Analista Estatístico",
            unidade: "1º BPM - Recife",
            status: "Ativo",
            ultimoAcesso: "09/08/2025 07:55",
            foto: "https://i.pravatar.cc/50?img=27",
        },
        {
            nome: "William Teixeira",
            email: "william.teixeira@cbm.pe.gov.br",
            matricula: "30901",
            perfil: "Administrador",
            unidade: "1º BPM - Recife",
            status: "Ativo",
            ultimoAcesso: "07/08/2025 16:22",
            foto: "https://i.pravatar.cc/50?img=28",
        },
        {
            nome: "Xênia Prado",
            email: "xenia.prado@cbm.pe.gov.br",
            matricula: "32012",
            perfil: "Gestor de Ocorrências",
            unidade: "2º BPM - Olinda",
            status: "Inativo",
            ultimoAcesso: "05/08/2025 09:12",
            foto: "https://i.pravatar.cc/50?img=29",
        },
        {
            nome: "Yago Lima",
            email: "yago.lima@cbm.pe.gov.br",
            matricula: "33123",
            perfil: "Analista Estatístico",
            unidade: "3º BPM - Jaboatão",
            status: "Ativo",
            ultimoAcesso: "03/08/2025 10:10",
            foto: "https://i.pravatar.cc/50?img=30",
        },
    ], []);

    // estado dos filtros
    const [filters, setFilters] = useState({
        search: "",
        perfil: "Todos",
        unidade: "Todos",
        status: "Todos",
    });

    // paginação
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // gerar opções automaticamente a partir dos dados
    const perfis = useMemo(() => ["Todos", ...Array.from(new Set(usuarios.map(u => u.perfil)))], [usuarios]);
    const unidades = useMemo(() => ["Todos", ...Array.from(new Set(usuarios.map(u => u.unidade)))], [usuarios]);
    const statuses = useMemo(() => ["Todos", ...Array.from(new Set(usuarios.map(u => u.status)))], [usuarios]);

    // função utilitária para cor do status (mantida)
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Ativo":
                return "#dcfce7";
            case "Inativo":
                return "#fee2e2";
            case "Suspenso":
                return "#e0f2fe";
            default:
                return "#f1f5f9";
        }
    };

    const getStatusTextColor = (status: string) => {
        switch (status) {
            case "Ativo":
                return "#166534";
            case "Inativo":
                return "#991b1b";
            case "Suspenso":
                return "#075985";
            default:
                return "#334155";
        }
    };

    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/usuarios/cadastrar");
    };

    // filtragem aplicada nos dados
    const filteredUsuarios = useMemo(() => {
        const s = filters.search.trim().toLowerCase();
        return usuarios.filter(u => {
            // busca por nome, email ou matrícula
            const matchSearch =
                !s ||
                u.nome.toLowerCase().includes(s) ||
                u.email.toLowerCase().includes(s) ||
                u.matricula.toLowerCase().includes(s);

            const matchPerfil = filters.perfil === "Todos" || u.perfil === filters.perfil;
            const matchUnidade = filters.unidade === "Todos" || u.unidade === filters.unidade;
            const matchStatus = filters.status === "Todos" || u.status === filters.status;

            return matchSearch && matchPerfil && matchUnidade && matchStatus;
        });
    }, [usuarios, filters]);

    // garantir pagina atual válida quando filtros mudam / tamanho muda
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    useEffect(() => {
        const tp = Math.max(1, Math.ceil(filteredUsuarios.length / pageSize));
        if (currentPage > tp) setCurrentPage(tp);
    }, [filteredUsuarios, currentPage]);

    const totalPages = Math.ceil(filteredUsuarios.length / pageSize);
    const paginatedUsuarios = filteredUsuarios.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <ContainerPainel>
            <PageTopHeaderRow>
                <PageTopHeaderColumn>
                    <PageTitle>Gestão de Usuários</PageTitle>
                    <PageSubtitle>Gerencie contas, perfis e permissões do sistema.</PageSubtitle>
                </PageTopHeaderColumn>
                <PageTopHeaderColumn>
                    <ActionsRow>
                        <Button
                            variant="danger"
                            text={<><PlusIcon size={16} style={{ marginRight: 8 }} weight="bold" />Adicionar Usuário</>}
                            onClick={() => { handleLogin(); }}
                        />
                    </ActionsRow>
                </PageTopHeaderColumn>

            </PageTopHeaderRow>
            {/* FILTROS */}
            <ResponsiveRow>
                <GridColumn>
                    <BoxInfo>
                        <Grid>
                            <Field>
                                <label>Busca</label>
                                <input
                                    type="text"
                                    placeholder="Nome, e-mail ou matrícula..."
                                    value={filters.search}
                                    onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                                />
                            </Field>

                            <Field>
                                <label>Perfil</label>
                                <select
                                    value={filters.perfil}
                                    onChange={e => setFilters(f => ({ ...f, perfil: e.target.value }))}
                                >
                                    {perfis.map((p, idx) => (
                                        <option key={idx} value={p}>{p}</option>
                                    ))}
                                </select>
                            </Field>

                            <Field>
                                <label>Unidade</label>
                                <select
                                    value={filters.unidade}
                                    onChange={e => setFilters(f => ({ ...f, unidade: e.target.value }))}
                                >
                                    {unidades.map((u, idx) => (
                                        <option key={idx} value={u}>{u}</option>
                                    ))}
                                </select>
                            </Field>

                            <Field>
                                <label>Status</label>
                                <select
                                    value={filters.status}
                                    onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                                >
                                    {statuses.map((s, idx) => (
                                        <option key={idx} value={s}>{s}</option>
                                    ))}
                                </select>
                            </Field>
                        </Grid>
                    </BoxInfo>
                </GridColumn>
            </ResponsiveRow>

            {/* TABELA */}
            <ResponsiveRow>
                <GridColumn>
                    <BoxInfo>
                        <TableWrapper>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Usuário</th>
                                        <th>Perfil</th>
                                        <th>Unidade</th>
                                        <th>Status</th>
                                        <th>Último Acesso</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedUsuarios.map((u, i) => (
                                        <tr key={i}>
                                            <td style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                <img
                                                    src={u.foto}
                                                    alt={u.nome}
                                                    style={{ width: 40, height: 40, borderRadius: "50%" }}
                                                />
                                                <div>
                                                    <strong>{u.nome}</strong>
                                                    <div style={{ fontSize: "0.85rem", color: "#64748b" }}>{u.email}</div>
                                                    <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Mat: {u.matricula}</div>
                                                </div>
                                            </td>
                                            <td>{u.perfil}</td>
                                            <td>{u.unidade}</td>
                                            <td>
                                                <span
                                                    style={{
                                                        background: getStatusColor(u.status),
                                                        color: getStatusTextColor(u.status),
                                                        padding: "4px 10px",
                                                        borderRadius: "20px",
                                                        fontWeight: 500,
                                                        fontSize: "0.8rem",
                                                    }}
                                                >
                                                    {u.status}
                                                </span>
                                            </td>
                                            <td>{u.ultimoAcesso}</td>
                                            <td>
                                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                                    <button
                                                        style={{
                                                            border: "none",
                                                            background: "transparent",
                                                            cursor: "pointer",
                                                            color: "#475569",
                                                        }}
                                                    >
                                                        <PencilIcon size={18} />
                                                    </button>
                                                    <button
                                                        style={{
                                                            border: "none",
                                                            background: "transparent",
                                                            cursor: "pointer",
                                                            color: "#dc2625",
                                                        }}
                                                    >
                                                        <TrashIcon size={18} />
                                                    </button>
                                                    <button
                                                        style={{
                                                            border: "none",
                                                            background: "transparent",
                                                            cursor: "pointer",
                                                            color: "#475569",
                                                        }}
                                                    >
                                                        <DotsThreeIcon size={20} weight="bold" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
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
                                {currentPage} / {totalPages || 1}
                            </span>
                            <Button
                                text="Próximo"
                                onClick={() => setCurrentPage(Math.min((totalPages || 1), currentPage + 1))}
                                variant="secondary"
                            />
                        </div>

                        <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
                            <p style={{ color: "#64748b" }}>
                                Mostrando {paginatedUsuarios.length} de {filteredUsuarios.length} usuários filtrados
                            </p>
                        </div>
                    </BoxInfo>
                </GridColumn>
            </ResponsiveRow>
        </ContainerPainel>
    );
}