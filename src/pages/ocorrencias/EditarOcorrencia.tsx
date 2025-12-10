/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
    ContainerPainel,
    PageTopHeader,
    PageTitle,
    PageSubtitle,
    RequiredNotice,
    BoxInfo,
    SectionTitle,
    Grid,
    Field,
    FullField,
    ResponsiveRow,
    GridColumn,
    PreviewList,
    SignatureBox,
    UploadArea,
} from "../../components/EstilosPainel.styles";
import { Breadcrumb } from "../../components/Breadcrumb";
import { Button } from "../../components/Button";
import { FileTextIcon, PaperclipIcon, } from "@phosphor-icons/react";
import {
    getOcorrenciaPorId,
    fetchVitimasPorOcorrencia,
    fetchNaturezasOcorrencias,
    fetchGruposOcorrencias,
    fetchSubgruposOcorrencias,
    fetchLesoes,
    fetchViaturas,
    fetchUnidadesOperacionais,
    putOcorrencia,
    fetchEquipeOcorrencia,
    deletePessoaEquipeOcorrencia,
    fetchUsuarios,
    postOcorrenciaUsuario,
    type Usuario,
    postVitima,
    putVitima,
    deleteVitima,
    processarUploadsArquivos,
    prepararAnexos,
    deleteAnexo,
} from "../../services/api";
import { Localizacao } from "./sections/Localizacao";
import { type Municipio } from "../../services/municipio_bairro";
import { EquipesViaturas } from "./sections/EquipesViaturas";
import { VitimasPessoas, type VitimaEdicao } from "./sections/VitimasPessoas";

interface AnexoEdicao {
    id: number;
    tipoArquivo: string;
    urlArquivo: string;
    nomeArquivo: string;
    extensaoArquivo: string;
    descricao?: string;
}

interface NaturezaOcorrencia {
    id?: number;
    nome?: string;
    sigla?: string;
    pontoBase?: string;
}

interface GrupoOcorrencia {
    id?: number;
    nome?: string;
    naturezaOcorrencia?: any;
}

interface SubgrupoOcorrencia {
    id?: number;
    nome?: string;
    grupoOcorrencia?: any;
}

interface Lesao {
    id?: number;
    tipoLesao?: string;
}

export function EditarOcorrencia() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const usuarioLogadoId = auth?.user?.id;

    // Estados para os dados da ocorrência
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Estados dos campos do formulário
    const [numeroOcorrencia, setNumeroOcorrencia] = useState("");
    const [dataChamado, setDataChamado] = useState("");
    const [statusAtendimento, setStatusAtendimento] = useState("Pendente");
    const [motivoNaoAtendimento, setMotivoNaoAtendimento] = useState("");
    const [descricao, setDescricao] = useState("");
    const [natureza, setNatureza] = useState("");
    const [grupo, setGrupo] = useState("");
    const [subgrupo, setSubgrupo] = useState("");
    const [formaAcionamento, setFormaAcionamento] = useState("Telefone");
    const [eventoEspecial, setEventoEspecial] = useState(false);
    const [unidade, setUnidade] = useState("");
    const [numeracaoViatura, setNumeracaoViatura] = useState("");
    const [tempoResposta, setTempoResposta] = useState("");
    const [observacoesAdicionais, setObservacoesAdicionais] = useState("");
    const [municipios, setMunicipios] = useState<Municipio[]>([]);

    // Localização
    const [municipio, setMunicipio] = useState("");
    const [bairro, setBairro] = useState("");
    const [logradouro, setLogradouro] = useState("");
    const [numero, setNumero] = useState("");
    const [complemento, setComplemento] = useState("");
    const [referencia, setReferencia] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");

    // Vítimas
    const [vitimas, setVitimas] = useState<VitimaEdicao[]>([]);

    // Anexos
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [existingAnexos, setExistingAnexos] = useState<AnexoEdicao[]>([]);
    const [anexosRemovidos, setAnexosRemovidos] = useState<number[]>([]);

    // Equipe
    const [equipe, setEquipe] = useState<Usuario[]>([]);

    // Estados para combos
    const [naturezasOcorrencias, setNaturezasOcorrencias] = useState<NaturezaOcorrencia[]>([]);
    const [gruposOcorrencias, setGruposOcorrencias] = useState<GrupoOcorrencia[]>([]);
    const [subgruposOcorrencias, setSubgruposOcorrencias] = useState<SubgrupoOcorrencia[]>([]);
    const [, setCondicoesVitima] = useState<Lesao[]>([]);

    // Carregar dados da ocorrência
    useEffect(() => {
        async function fetchOcorrencia() {
            try {
                setLoading(true);

                if (!id) return;

                const data = await getOcorrenciaPorId(id);
                if (!data) throw new Error('Ocorrência não encontrada');

                // Preencher os campos do formulário com os dados existentes
                setNumeroOcorrencia(data.numeroOcorrencia || "");
                setDataChamado(data.dataHoraChamada ? new Date(data.dataHoraChamada).toISOString().slice(0, 16) : "");
                setStatusAtendimento(normalizeStatusFromBackend(data.statusAtendimento));
                setMotivoNaoAtendimento(data.motivoNaoAtendimento || "");
                setDescricao(data.descricao || "");
                const subgrupoIdInicial =
                    data.subgrupoOcorrenciaId?.toString() ||
                    data.subgrupoOcorrencia?.id?.toString() ||
                    (data as any)?.SubgrupoOcorrencia?.id?.toString() ||
                    "";

                setNatureza(data.naturezaOcorrencia?.id?.toString() || "");
                setGrupo(data.grupoOcorrencia?.id?.toString() || "");
                setSubgrupo(subgrupoIdInicial);
                setFormaAcionamento(mapFormaAcionamentoFromBackend(data.formaAcionamento || ""));
                setEventoEspecial(!!data.eventoEspecial);
                setUnidade(data.unidadeOperacional?.id?.toString() || "");
                setNumeracaoViatura(data.viatura?.id?.toString() || "");
                setTempoResposta(data.tempoResposta || "");
                setObservacoesAdicionais(data.observacoes || "");

                // Localização
                if (data.localizacao) {
                    setMunicipio(data.localizacao.municipio || "");
                    setBairro(data.localizacao.bairro || "");
                    setLogradouro(data.localizacao.logradouro || "");
                    setNumero(data.localizacao.numero || "");
                    setComplemento(data.localizacao.complemento || "");
                    setReferencia(data.localizacao.pontoReferencia || "");
                    setLatitude(data.localizacao.latitude?.toString() || "");
                    setLongitude(data.localizacao.longitude?.toString() || "");
                }

                // Anexos existentes
                setExistingAnexos((data.anexos || []).filter(a => a.id !== undefined).map(a => ({
                    ...a,
                    id: a.id as number,
                    tipoArquivo: a.tipoArquivo || "",
                    urlArquivo: a.urlArquivo || "",
                    nomeArquivo: a.nomeArquivo || "",
                    extensaoArquivo: a.extensaoArquivo || ""
                })));

                const vitimasData = await fetchVitimasPorOcorrencia(data.id);
                const vitimasFormatadas = (vitimasData || []).map((v: any) => ({
                    id: v.id,
                    nome: v.nome || "",
                    cpfVitima: v.cpfVitima || "",
                    idade: v.idade,
                    sexo: v.sexo,
                    etnia: v.etnia,
                    tipoAtendimento: v.tipoAtendimento || "",
                    observacoes: v.observacoes || "",
                    destinoVitima: v.destinoVitima || "",
                    lesaoId: v.lesao?.id,
                    lesao: v.lesao,
                }));
                setVitimas(vitimasFormatadas);
                setLoading(false);

            } catch (error) {
                console.error('Erro ao carregar ocorrência:', error);
                alert('Erro ao carregar ocorrência para edição');
                setLoading(false);
            }
        }

        // Carregar combos
        async function fetchCombos() {
            try {
                const [naturezas, grupos, subgrupos, lesoes] = await Promise.all([
                    fetchNaturezasOcorrencias(),
                    fetchGruposOcorrencias(),
                    fetchSubgruposOcorrencias(),
                    fetchLesoes(),
                    fetchViaturas(),
                    fetchUnidadesOperacionais(),
                    fetchUsuarios(),
                ]);

                setNaturezasOcorrencias(naturezas);
                setGruposOcorrencias(grupos);
                setSubgruposOcorrencias(subgrupos);
                setCondicoesVitima(lesoes);
            } catch (error) {
                console.error('Erro ao carregar combos:', error);
            }
        }

        if (id) {
            fetchOcorrencia();
            fetchCombos();
        }
    }, [id]);

    // Carregar equipe
    useEffect(() => {
        if (!id) return;

        console.log("🔍 Carregando equipe da ocorrência:", id);
        fetchEquipeOcorrencia(id).then(equipeData => {
            console.log("📥 Equipe carregada do backend:", equipeData?.map(u => ({ id: u.id, nome: u.nome })));
            // Carregar equipe sem filtrar - se o criador estiver lá, é porque foi adicionado manualmente
            setEquipe(equipeData || []);
        }).catch(error => {
            console.error('❌ Erro ao carregar equipe:', error);
        });
    }, [id]);



    // Funções de mapeamento normalizadas
    const normalizeStatusFromBackend = (status: string | undefined): string => {
        if (!status) return "Pendente";
        const normalized = status.toLowerCase().trim();

        // Normalizar "atendida" e variações
        if (normalized === "atendida" || normalized === "concluida" || normalized === "concluído" || normalized === "atendido") {
            return "Atendida";
        }
        // Normalizar "não atendida" e variações
        if (normalized === "não_atendida" || normalized === "nao_atendida" || normalized === "não atendida" || normalized === "não atendido") {
            return "Não Atendida";
        }
        // Normalizar "em andamento"
        if (normalized === "em_andamento" || normalized === "em andamento") {
            return "Em andamento";
        }
        // Normalizar "pendente"
        if (normalized === "pendente") {
            return "Pendente";
        }

        return "Pendente";
    };

    const mapStatusToBackend = (status: string): string => {
        switch (status) {
            case "Pendente":
                return "pendente";
            case "Em andamento":
                return "em_andamento";
            case "Atendida":
                return "atendida";
            case "Não Atendida":
                return "não_atendida";
            default:
                return "pendente";
        }
    };

    const mapFormaAcionamentoFromBackend = (forma: string) => {
        switch (forma?.toLowerCase()) {
            case "telefone": return "Telefone";
            case "aplicativo": return "Aplicativo";
            case "pessoalmente": return "Pessoalmente";
            default: return "Telefone";
        }
    };

    const mapFormaAcionamentoToBackend = (forma: string) => {
        return forma.toLowerCase();
    };

    // Funções para arquivos
    const handleFileUpload = (files: FileList | null) => {
        if (!files) return;
        const newFiles = Array.from(files);
        setUploadedFiles(prev => [...prev, ...newFiles]);
    };

    const removeAnexoExistente = (anexoId: number) => {
        setExistingAnexos(prev => prev.filter(a => a.id !== anexoId));
        setAnexosRemovidos(prev => [...prev, anexoId]);
    };

    const removeAnexoNovo = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Helpers para garantir nome/extensão dos anexos
    const extrairExtensao = (nome?: string, url?: string, ext?: string) => {
        if (ext && ext.trim()) return ext.trim().replace(/^\./, "");
        const fromNome = nome?.split(".").pop();
        if (fromNome) return fromNome.trim();
        if (url) {
            const last = url.split("?")[0].split("#")[0].split("/").pop();
            const fromUrl = last?.split(".").pop();
            if (fromUrl) return fromUrl.trim();
        }
        return "bin";
    };

    const garantirNomeArquivo = (anexo: Partial<AnexoEdicao>, fallbackIndex: number) => {
        const ext = extrairExtensao(anexo.nomeArquivo, anexo.urlArquivo, anexo.extensaoArquivo);
        const baseNome = anexo.nomeArquivo && anexo.nomeArquivo.trim() ? anexo.nomeArquivo.trim() : undefined;
        const nomeFinal = baseNome || `anexo_${anexo.id ?? fallbackIndex}.${ext}`;
        return {
            ...anexo,
            nomeArquivo: nomeFinal,
            extensaoArquivo: ext,
        } as AnexoEdicao;
    };

    // Submit do formulário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Upload dos novos anexos e montagem do array final de anexos
            const uploadsProcessados = await processarUploadsArquivos(uploadedFiles as any[]);
            const anexosNovos = prepararAnexos(uploadsProcessados, undefined, numeroOcorrencia)
                .map((anexo, idx) => garantirNomeArquivo(anexo, idx));

            // Mantém anexos existentes que não foram marcados para remoção
            const anexosMantidos = existingAnexos
                .filter(anexo => !anexosRemovidos.includes(anexo.id))
                .map((anexo, idx) => garantirNomeArquivo({
                    id: anexo.id,
                    tipoArquivo: anexo.tipoArquivo,
                    urlArquivo: anexo.urlArquivo,
                    nomeArquivo: anexo.nomeArquivo,
                    extensaoArquivo: anexo.extensaoArquivo,
                    descricao: anexo.descricao,
                }, idx + 1000));

            const payload = {
                numeroOcorrencia,
                dataHoraChamada: dataChamado ? new Date(dataChamado).toISOString() : new Date().toISOString(),
                statusAtendimento: mapStatusToBackend(statusAtendimento),
                motivoNaoAtendimento: motivoNaoAtendimento || "N/A",
                descricao: descricao || "",
                formaAcionamento: mapFormaAcionamentoToBackend(formaAcionamento),
                naturezaOcorrenciaId: natureza ? Number(natureza) : undefined,
                grupoOcorrenciaId: grupo ? Number(grupo) : undefined,
                subgrupoOcorrenciaId: subgrupo ? Number(subgrupo) : (subgrupo === "" ? null : undefined),
                viaturaId: numeracaoViatura ? Number(numeracaoViatura) : undefined,
                unidadeOperacionalId: unidade ? Number(unidade) : undefined,
                eventoEspecialId: eventoEspecial ? 1 : undefined,
                tempoResposta: tempoResposta || undefined,
                observacoes: observacoesAdicionais || undefined,
                localizacao: {
                    municipio: municipio || "",
                    bairro: bairro || "",
                    logradouro: logradouro || "",
                    numero: numero || "",
                    complemento: complemento || "",
                    pontoReferencia: referencia || "",
                    latitude: latitude ? Number(latitude) : undefined,
                    longitude: longitude ? Number(longitude) : undefined,
                },
                anexos: [...anexosMantidos, ...anexosNovos],
            };

            if (!id) throw new Error('ID da ocorrência não encontrado');

            await putOcorrencia(Number(id), payload);
            // Deletar anexos removidos no backend
            for (const anexoId of anexosRemovidos) {
                try {
                    await deleteAnexo(anexoId);
                } catch (err) {
                    console.warn(`Erro ao remover anexo ${anexoId}:`, err);
                }
            }

            // === EQUIPE: sincronizar apenas os que ainda não estão no backend ===
            const equipeAtual = await fetchEquipeOcorrencia(id); // recarrega do backend para comparar
            console.log("=== SINCRONIZAÇÃO DE EQUIPE ===");
            console.log("Equipe BACKEND ANTES:", equipeAtual.map(u => ({ id: u.id, nome: u.nome })));
            console.log("Equipe LOCAL (após edição):", equipe.map(u => ({ id: u.id, nome: u.nome })));
            console.log("Usuário logado:", { id: usuarioLogadoId });
            
            const equipeAtualIds = new Set(equipeAtual.map(u => u.id));

            // Adiciona apenas os novos membros
            for (const membro of equipe) {
                if (membro.id && !equipeAtualIds.has(membro.id)) {
                    try {
                        console.log(`➕ Adicionando usuário ${membro.id} (${membro.nome})`);
                        await postOcorrenciaUsuario({
                            ocorrenciaId: Number(id),
                            userId: membro.id,
                        });
                        console.log(`✅ Usuário ${membro.id} adicionado com sucesso`);
                    } catch (error) {
                        console.warn(`❌ Erro ao adicionar usuário ${membro.id}:`, error);
                    }
                }
            }

            // Remove os que foram excluídos localmente (mas ainda estão no backend)
            const equipeLocalIds = new Set(equipe.map((u) => u.id));
            for (const membroBackend of equipeAtual) {
                if (membroBackend.id && !equipeLocalIds.has(membroBackend.id)) {
                    try {
                        console.log(`🗑️ Removendo usuário ${membroBackend.id} (${membroBackend.nome}) do backend`);
                        await deletePessoaEquipeOcorrencia(Number(id), membroBackend.id);
                        console.log(`✅ Usuário ${membroBackend.id} removido com sucesso`);
                    } catch (error) {
                        console.error(`❌ Erro ao remover usuário ${membroBackend.id}:`, error);
                        
                        // Se for erro de "não encontrada", significa que já não está vinculado
                        const errorStr = error instanceof Error ? error.message : JSON.stringify(error);
                        if (errorStr.includes("não encontrada") || errorStr.includes("404") || errorStr.includes("not found")) {
                            console.warn(`⚠️ Usuário ${membroBackend.id} (${membroBackend.nome}) não estava vinculado - ignorando erro`);
                        } else {
                            console.warn(`⚠️ Aviso ao remover usuário ${membroBackend.id}:`, error);
                        }
                    }
                }
            }
            console.log("=== FIM SINCRONIZAÇÃO DE EQUIPE ===");

            // === VÍTIMAS: sincronizar com POST, PUT e DELETE (VERSÃO CORRETA E FINAL) ===
try {
  // Carrega vítimas atuais do backend
  const vitimasBackend = await fetchVitimasPorOcorrencia(id);
  const backendIds = new Set(vitimasBackend.map(v => v.id).filter(Boolean));

  for (const vitima of vitimas) {
    const payload = {
      ocorrenciaId: Number(id),  // ← mesmo que não precise, não atrapalha
      nome: vitima.nome?.trim() || null,
      cpfVitima: vitima.cpfVitima?.trim() || null,
      idade: vitima.idade || null,
      sexo: vitima.sexo || null,
      etnia: vitima.etnia?.trim() || null,
      tipoAtendimento: vitima.tipoAtendimento?.trim() || null,
      observacoes: vitima.observacoes?.trim() || null,
      destinoVitima: vitima.destinoVitima?.trim() || null,
      lesaoId: vitima.lesaoId || null,
    };

    if (vitima.id > 0) {
      // Atualiza vítima existente → PATCH /vitimas/:id
      await putVitima(vitima.id, payload);
      console.log("Vítima atualizada:", vitima.id);
    } else {
      // Cria nova vítima
      await postVitima(payload);
      console.log("Nova vítima criada");
    }
  }

  // Remove vítimas que foram deletadas localmente
  const localIds = new Set(vitimas.map(v => v.id).filter(id => id > 0));
  for (const backendId of backendIds) {
    if (!localIds.has(backendId)) {
      await deleteVitima(backendId);
      console.log("Vítima removida:", backendId);
    }
  }

} catch (err) {
  console.error("Erro ao sincronizar vítimas:", err);
  // alert("Erro ao salvar vítimas. Verifique o console.");
}

            alert('Ocorrência atualizada com sucesso!');
            navigate(`/ocorrencias/detalhes/${id}`);

        } catch (error) {
            console.error('Erro ao salvar ocorrência:', error);
            const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
            alert(`Erro ao atualizar ocorrência: ${errorMessage}`);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate(`/ocorrencias/${id}`);
    };

    if (loading) {
        return (
            <ContainerPainel>
                <div style={{ textAlign: "center", padding: "2rem" }}>
                    <p>Carregando ocorrência para edição...</p>
                </div>
            </ContainerPainel>
        );
    }

    return (
        <ContainerPainel>
            <PageTopHeader>
                <Breadcrumb
                    items={[
                        {
                            label: "Ocorrências",
                            onClick: () => navigate("/ocorrencias")
                        },
                        {
                            label: `Detalhes - ${numeroOcorrencia}`,
                            onClick: () => navigate(`/ocorrencias/detalhes/${id}`)
                        },
                        {
                            label: "Editar Ocorrência"
                        },
                    ]}
                />

                <PageTitle>Editar Ocorrência</PageTitle>
                <PageSubtitle>
                    Edite as informações da ocorrência {numeroOcorrencia}
                </PageSubtitle>
                <RequiredNotice><span>*</span>Campos obrigatórios</RequiredNotice>
            </PageTopHeader>

            <form onSubmit={handleSubmit}>
                {/* Dados Principais */}
                <ResponsiveRow>
                    <GridColumn weight={1}>
                        <BoxInfo>
                            <SectionTitle><FileTextIcon size={22} weight="fill" />Dados Principais</SectionTitle>
                            <Grid>
                                <Field>
                                    <label>Número da Ocorrência</label>
                                    <input
                                        type="text"
                                        value={numeroOcorrencia}
                                        readOnly
                                    />
                                </Field>

                                <Field>
                                    <label className="required">Data/Hora do Chamado</label>
                                    <input
                                        type="datetime-local"
                                        value={dataChamado}
                                        onChange={(e) => setDataChamado(e.target.value)}
                                        required
                                    />
                                </Field>

                                <Field>
                                    <label>Status de Atendimento</label>
                                    <select
                                        value={statusAtendimento}
                                        onChange={(e) => {
                                            setStatusAtendimento(e.target.value);
                                            if (e.target.value !== "Não Atendida") setMotivoNaoAtendimento("");
                                        }}
                                    >
                                        <option>Pendente</option>
                                        <option>Em andamento</option>
                                        <option>Atendida</option>
                                        <option>Não Atendida</option>
                                    </select>
                                </Field>

                                {statusAtendimento === "Não Atendida" && (
                                    <FullField>
                                        <label>Motivo de Não Atendimento</label>
                                        <textarea
                                            placeholder="Descreva o motivo pelo qual a ocorrência não foi atendida."
                                            value={motivoNaoAtendimento}
                                            onChange={(e) => setMotivoNaoAtendimento(e.target.value)}
                                        />
                                    </FullField>
                                )}

                                <Field>
                                    <label className="required">Natureza da Ocorrência</label>
                                    <select
                                        value={natureza}
                                        onChange={(e) => {
                                            setNatureza(e.target.value);
                                            setGrupo(""); // reseta grupo
                                            setSubgrupo(""); // reseta subgrupo
                                        }}
                                        required
                                    >
                                        <option value="">Selecione a natureza</option>
                                        {naturezasOcorrencias.map((n) => (
                                            <option key={n.id} value={n.id}>{n.nome}</option>
                                        ))}
                                    </select>
                                </Field>

                                <Field>
                                    <label className="required">Grupo da Ocorrência</label>
                                    <select
                                        value={grupo}
                                        onChange={(e) => {
                                            setGrupo(e.target.value);
                                            setSubgrupo(""); // reseta subgrupo quando grupo muda
                                        }}
                                        required
                                    >
                                        <option value="">Selecione o grupo</option>
                                        {gruposOcorrencias
                                            .filter(g => String(g.naturezaOcorrencia?.id) === String(natureza))
                                            .map((g) => (
                                                <option key={g.id} value={g.id}>{g.nome}</option>
                                            ))}
                                    </select>
                                </Field>

                                <Field>
                                    <label className="required">Subgrupo da Ocorrência</label>
                                    <select
                                        value={subgrupo}
                                        onChange={(e) => setSubgrupo(e.target.value)}
                                        disabled={!grupo}
                                        required
                                    >
                                        <option value="">
                                            {grupo ? "Selecione o subgrupo" : "Selecione um grupo primeiro"}
                                        </option>
                                        {subgruposOcorrencias
                                            .filter(s => String(s.grupoOcorrencia?.id) === String(grupo))
                                            .map((s) => (
                                                <option key={s.id} value={s.id}>{s.nome}</option>
                                            ))}
                                    </select>
                                </Field>

                                <Field>
                                    <label className="required">Forma de acionamento</label>
                                    <select
                                        value={formaAcionamento}
                                        onChange={(e) => setFormaAcionamento(e.target.value)}
                                    >
                                        <option>Telefone</option>
                                        <option>Aplicativo</option>
                                        <option>Pessoalmente</option>
                                    </select>
                                </Field>

                                <Field>
                                    <label>Evento Especial?</label>
                                    <select
                                        value={eventoEspecial ? "Sim" : "Não"}
                                        onChange={(e) => setEventoEspecial(e.target.value === "Sim")}
                                    >
                                        <option value="Não">Não</option>
                                        <option value="Sim">Sim</option>
                                    </select>
                                </Field>

                                <FullField>
                                    <label>Descrição Resumida</label>
                                    <textarea
                                        placeholder="Ex: Incêndio em veículo na Av. Norte, vítima consciente."
                                        value={descricao}
                                        onChange={(e) => setDescricao(e.target.value)}
                                    />
                                </FullField>

                                <Field>
                                    <label>Tempo de Resposta</label>
                                    <input
                                        type="text"
                                        value={tempoResposta}
                                        onChange={(e) => setTempoResposta(e.target.value)}
                                        placeholder="Ex: 15 minutos"
                                    />
                                </Field>

                                <FullField>
                                    <label>Observações Adicionais</label>
                                    <textarea
                                        value={observacoesAdicionais}
                                        onChange={(e) => setObservacoesAdicionais(e.target.value)}
                                    />
                                </FullField>
                            </Grid>
                        </BoxInfo>
                    </GridColumn>
                </ResponsiveRow>

                {/* Localização*/}
                <ResponsiveRow>
                    <GridColumn weight={1}>
                        <Localizacao
                            municipios={municipios}
                            setMunicipios={setMunicipios}
                            selectedMunicipioId={""}
                            setSelectedMunicipioId={(value: string | number) => {
                                const municipioNome = municipios.find(m => m.id === value)?.nome || "";
                                setMunicipio(municipioNome);
                            }}
                            selectedMunicipioNome={municipio}
                            setSelectedMunicipioNome={setMunicipio}
                            bairro={bairro}
                            setBairro={setBairro}
                            logradouro={logradouro}
                            setLogradouro={setLogradouro}
                            numero={numero}
                            setNumero={setNumero}
                            complemento={complemento}
                            setComplemento={setComplemento}
                            referencia={referencia}
                            setReferencia={setReferencia}
                            latitude={latitude}
                            setLatitude={setLatitude}
                            longitude={longitude}
                            setLongitude={setLongitude}
                        />
                    </GridColumn>
                </ResponsiveRow>

                {/* Equipes e Viaturas */}
                <ResponsiveRow>
                    <GridColumn weight={1}>
                        <EquipesViaturas
                            unidade={unidade}
                            setUnidade={setUnidade}
                            numeracaoViatura={numeracaoViatura}
                            setNumeracaoViatura={setNumeracaoViatura}
                            onTeamMembersChange={(newTeam) => {
                                console.log("🔄 EditarOcorrencia recebeu mudança de equipe:", newTeam.map(u => ({ id: u.id, nome: u.nome })));
                                setEquipe(newTeam);
                            }}
                            initialTeamMembers={equipe}
                        />
                    </GridColumn>
                </ResponsiveRow>

                {/* Vítimas e Pessoas Envolvidas */}
                <ResponsiveRow>
                    <GridColumn weight={1}>
                        <VitimasPessoas vitimas={vitimas} onChange={setVitimas} />
                    </GridColumn>
                </ResponsiveRow>

                {/* Anexos e Evidências */}
                <ResponsiveRow>
                    <GridColumn weight={1}>
                        <BoxInfo>
                            <SectionTitle><PaperclipIcon size={22} weight="fill" /> Anexos e Evidências</SectionTitle>

                            {/* Anexos Existentes - Fotos e Arquivos */}
                            {existingAnexos.filter(anexo =>
                                anexo.tipoArquivo !== "assinatura" &&
                                anexo.tipoArquivo !== "Assinatura" &&
                                !anexo.nomeArquivo?.toLowerCase().includes('assinatura')
                            ).length > 0 && (
                                    <div style={{ marginBottom: "1.5rem" }}>
                                        <h4 style={{ marginBottom: "0.5rem", color: "#444" }}>Anexos Existentes</h4>
                                        <PreviewList>
                                            {existingAnexos
                                                .filter(anexo =>
                                                    anexo.tipoArquivo !== "assinatura" &&
                                                    anexo.tipoArquivo !== "Assinatura" &&
                                                    !anexo.nomeArquivo?.toLowerCase().includes('assinatura')
                                                )
                                                .map((anexo) => (
                                                    <div key={anexo.id} style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "space-between" }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                            <span>{anexo.nomeArquivo}</span>
                                                            <a
                                                                href={anexo.urlArquivo}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{ marginLeft: "8px", color: "#2563eb" }}
                                                            >
                                                                Visualizar
                                                            </a>
                                                        </div>
                                                        <Button
                                                            text="Remover"
                                                            onClick={() => removeAnexoExistente(anexo.id)}
                                                            variant="danger"
                                                            style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                                                            type="button"
                                                        />
                                                    </div>
                                                ))}
                                        </PreviewList>
                                    </div>
                                )}

                            {/* Novos Anexos */}
                            <div style={{ marginBottom: "1.5rem" }}>
                                <h4 style={{ marginBottom: "0.5rem", color: "#444" }}>Novos Anexos</h4>
                                <UploadArea
                                    onDragOver={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
                                    onDrop={(e: React.DragEvent<HTMLDivElement>) => {
                                        e.preventDefault();
                                        handleFileUpload(e.dataTransfer.files);
                                    }}
                                >
                                    <p>Arraste arquivos aqui ou clique para selecionar</p>
                                    <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        multiple
                                        capture="environment"
                                        onChange={(e) => handleFileUpload(e.target.files)}
                                    />
                                </UploadArea>

                                {uploadedFiles.length > 0 && (
                                    <PreviewList>
                                        {uploadedFiles.map((file, index) => (
                                            <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "space-between" }}>
                                                <span>{file.name}</span>
                                                <Button
                                                    text="Remover"
                                                    onClick={() => removeAnexoNovo(index)}
                                                    variant="danger"
                                                    style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                                                    type="button"
                                                />
                                            </div>
                                        ))}
                                    </PreviewList>
                                )}
                            </div>

                            {/* Assinatura do Responsável */}
                            <div>
                                <h4 style={{ marginBottom: "0.5rem", color: "#444" }}>Assinatura do Responsável</h4>
                                <SignatureBox>
                                    {existingAnexos.find(a => a.tipoArquivo === "assinatura") ? (
                                        <div style={{ textAlign: "center", padding: "1rem" }}>
                                            <p>✅ Assinatura digital registrada</p>
                                            <a
                                                href={existingAnexos.find(a => a.tipoArquivo === "assinatura")?.urlArquivo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: "#2563eb" }}
                                            >
                                                Visualizar assinatura
                                            </a>
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: "center", padding: "1rem", color: "#64748b" }}>
                                            <p>Nenhuma assinatura registrada</p>
                                        </div>
                                    )}
                                </SignatureBox>
                            </div>
                        </BoxInfo>
                    </GridColumn>
                </ResponsiveRow>

                {/* Ações */}
                <ResponsiveRow>
                    <GridColumn weight={1}>
                        <BoxInfo>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                                <Button
                                    text="Cancelar"
                                    onClick={handleCancel}
                                    variant="secondary"
                                    type="button"
                                />
                                <Button
                                    text={saving ? "Salvando..." : "Salvar Alterações"}
                                    type="submit"
                                    variant="primary"
                                    style={{ opacity: saving ? 0.6 : 1, pointerEvents: saving ? "none" : "auto" }}
                                />
                            </div>
                        </BoxInfo>
                    </GridColumn>
                </ResponsiveRow>
            </form>
        </ContainerPainel>
    );
}