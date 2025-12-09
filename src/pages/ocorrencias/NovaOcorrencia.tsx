// File: src/components/NovaOcorrencia.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useContext } from "react";
import { Breadcrumb } from "../../components/Breadcrumb";
import { ContainerPainel, PageTopHeader, ResponsiveRow, GridColumn, PageTitle, PageSubtitle, RequiredNotice, StatusAlert } from "../../components/EstilosPainel.styles";
import type { Municipio } from "../../services/municipio_bairro";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import { useOnlineStatus } from "../../utils/useOnlineStatus";
import { AnexosEvidencias } from "./sections/AnexosEvidencias";
import { DadosPrincipais } from "./sections/DadosPrincipais";
import { EquipesViaturas } from "./sections/EquipesViaturas";
import { Localizacao } from "./sections/Localizacao";
import { VitimasPessoas, type VitimaEdicao } from "./sections/VitimasPessoas";
import { Button } from "../../components/Button";
import { WarningCircleIcon } from "@phosphor-icons/react";

// Import das funções de API do api.ts
import { postOcorrencia, postVitima, postOcorrenciaUsuario } from "../../services/api";
import type { Usuario } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

type UploadedFile = {
    file?: File;
    url?: string;
    name: string;
    preview?: string;
};

const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const mapStatus = (s: string) => {
    switch (s) {
        case "Pendente":
            return "pendente";
        case "Em andamento":
            return "em_andamento";
        case "Atendida":
            return "atendida";
        case "Não Atendido":
            return "nao_atendido";
        default:
            return String(s).toLowerCase().replace(/\s+/g, "_");
    }
};

export function CadastrarOcorrencia() {
    const isOnline = useOnlineStatus();
    const [municipios, setMunicipios] = useState<Municipio[]>([]);
    const [vitimas, setVitimas] = useState<VitimaEdicao[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [assinaturaDataUrl, setAssinaturaDataUrl] = useState<string | undefined>(undefined);
    const [eventoEspecial, setEventoEspecial] = useState(false);
    const auth = useContext(AuthContext);
    const usuarioLogado = auth?.user ?? null;
    const [numeroOcorrencia, setNumeroOcorrencia] = useState("");

    // Equipe / busca de usuários
    const [teamMembers, setTeamMembers] = useState<Usuario[]>([]);

    const getCurrentDateTime = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset();
        const adjusted = new Date(now.getTime() - offset * 60 * 1000);
        return adjusted.toISOString().slice(0, 16);
    };

    const [dataChamado, setDataChamado] = useState(getCurrentDateTime());
    const [statusAtendimento, setStatusAtendimento] = useState("Pendente");
    const [motivoNaoAtendimento, setMotivoNaoAtendimento] = useState("");
    const [descricao, setDescricao] = useState("");
    const [natureza, setNatureza] = useState("");
    const [grupo, setGrupo] = useState("");
    const [subgrupo, setSubgrupo] = useState("");
    const [unidade, setUnidade] = useState("");
    const [numeracaoViatura, setNumeracaoViatura] = useState("");
    const [tempoResposta, setTempoResposta] = useState("");
    const [observacoesAdicionais, setObservacoesAdicionais] = useState("");
    const [complemento, setComplemento] = useState("");
    const [referencia, setReferencia] = useState("");
    const [selectedMunicipioId, setSelectedMunicipioId] = useState<number | "">("");
    const [selectedMunicipioNome, setSelectedMunicipioNome] = useState("");
    const [bairro, setBairro] = useState("");
    const [logradouro, setLogradouro] = useState("");
    const [numero, setNumero] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [formaAcionamento, setFormaAcionamento] = useState("Telefone");

    useEffect(() => {
        const now = new Date();
        const offset = now.getTimezoneOffset();
        const adjusted = new Date(now.getTime() - offset * 60 * 1000);
        const formattedDate = adjusted.toISOString().replace(/[-:.TZ]/g, "");
        setNumeroOcorrencia(`OCR${formattedDate}`);
    }, []);


    const saveDraft = async () => {
        try {
            const filesData = await Promise.all(
                uploadedFiles.map(async (f) => {
                    let data;
                    if (f.file) {
                        data = await toBase64(f.file);
                    }
                    return {
                        name: f.name,
                        type: f.file?.type,
                        data,
                    };
                })
            );

            const draft = {
                id: Date.now(),
                numeroOcorrencia,
                dataChamado,
                statusAtendimento,
                motivoNaoAtendimento,
                descricao,
                natureza,
                grupo,
                subgrupo,
                formaAcionamento,
                eventoEspecial,
                selectedMunicipioId,
                selectedMunicipioNome,
                bairro,
                logradouro,
                numero,
                complemento,
                referencia,
                latitude,
                longitude,
                unidade,
                numeracaoViatura,
                tempoResposta,
                observacoesAdicionais,
                vitimas,
                uploadedFiles: filesData,
                assinaturaDataUrl,
                teamMembers, // inclui equipe no rascunho
            };

            // Salvar diretamente no localStorage
            const savedDrafts = localStorage.getItem('ocorrenciaDrafts');
            const currentDrafts = savedDrafts ? JSON.parse(savedDrafts) : [];
            const updatedDrafts = [...currentDrafts, draft];
            localStorage.setItem('ocorrenciaDrafts', JSON.stringify(updatedDrafts));

            // Limpar formulário
            uploadedFiles.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
            setVitimas([]);
            setUploadedFiles([]);
            setAssinaturaDataUrl(undefined);
            setEventoEspecial(false);
            setSelectedMunicipioId("");
            setSelectedMunicipioNome("");
            setBairro("");
            setLogradouro("");
            setNumero("");
            setLatitude("");
            setLongitude("");
            setComplemento("");
            setReferencia("");
            setUnidade("");
            setNumeracaoViatura("");
            setTempoResposta("");
            setObservacoesAdicionais("");
            setNatureza("");
            setGrupo("");
            setSubgrupo("");
            setDescricao("");
            setMotivoNaoAtendimento("");
            setFormaAcionamento("Telefone");
            setStatusAtendimento("Pendente");
            setTeamMembers([]);
            setDataChamado(getCurrentDateTime());
            const now = new Date();
            const offset = now.getTimezoneOffset();
            const adjusted = new Date(now.getTime() - offset * 60 * 1000);
            const formattedDate = adjusted.toISOString().replace(/[-:.TZ]/g, "");
            setNumeroOcorrencia(`OCR${formattedDate}`);

            alert("Rascunho salvo offline.");
        } catch (err) {
            console.error("Erro ao salvar rascunho:", err);
            alert("Falha ao salvar rascunho.");
        }
    };

    const handleFileUpload = async (files: FileList | null) => {
        if (!files) return;
        const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
            file,
            name: file.name,
            url: undefined,
            preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
        }));
        setUploadedFiles((prev) => [...prev, ...newFiles]);
    };

    // converte dataURL (data:) em Blob
    const dataURLtoBlob = (dataUrl: string) => {
        const parts = dataUrl.split(',');
        const meta = parts[0] || '';
        const base64 = parts[1] || '';
        const m = meta.match(/:(.*?);/);
        const mime = m ? m[1] : 'image/png';
        const binary = atob(base64);
        const len = binary.length;
        const u8 = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            u8[i] = binary.charCodeAt(i);
        }
        return new Blob([u8], { type: mime });
    };

    const handleSaveOcorrencia = async () => {
        try {
            if (!isOnline) {
                alert("Sem internet. Não é possível salvar a ocorrência.");
                return;
            }

            // salvar backup da assinatura no localStorage para garantir que esteja disponível
            try {
                if (assinaturaDataUrl) {
                    localStorage.setItem(`assinatura_backup_${numeroOcorrencia}`, assinaturaDataUrl);
                }
            } catch (err) {
                console.warn("Falha ao salvar backup da assinatura no localStorage:", err);
            }

            let assinaturaUrl: string | undefined = undefined;
            if (assinaturaDataUrl) {
                try {
                    // tenta fetch (funciona com data: e blob:) — se falhar, usa fallback para dataURL
                    let blob: Blob | undefined;
                    try {
                        const res = await fetch(assinaturaDataUrl);
                        if (res.ok) {
                            blob = await res.blob();
                        } else {
                            console.warn("fetch retornou não-ok para assinaturaDataUrl, usando fallback.");
                        }
                    } catch (fetchErr) {
                        console.warn("fetch falhou para assinaturaDataUrl, usando fallback:", fetchErr);
                    }

                    if (!blob) {
                        // se for data:URL decodifica para Blob
                        if (assinaturaDataUrl.startsWith("data:")) {
                            blob = dataURLtoBlob(assinaturaDataUrl);
                        } else {
                            // se for blob: ou outro, tentar recuperar backup do localStorage
                            const backup = localStorage.getItem(`assinatura_backup_${numeroOcorrencia}`);
                            if (backup && backup.startsWith("data:")) {
                                blob = dataURLtoBlob(backup);
                            } else {
                                throw new Error("Não foi possível obter Blob da assinatura (fetch e backup falharam).");
                            }
                        }
                    }

                    const assinaturaFileName = `assinatura${numeroOcorrencia}.png`;
                    const file = new File([blob], assinaturaFileName, { type: (blob as Blob).type || "image/png" });
                    console.log("Assinatura: arquivo criado", file);
                    assinaturaUrl = await uploadToCloudinary(file);
                    console.log("Assinatura enviada. URL:", assinaturaUrl);
                } catch (err) {
                    console.error("Erro ao processar/enviar assinatura:", err);
                }
            } else {
                console.log("Nenhuma assinatura presente (assinaturaDataUrl vazio).");
            }

            // upload demais anexos (com tratamento de erro por arquivo)
            const uploadedResults = await Promise.all(
                uploadedFiles.map(async (f) => {
                    try {
                        const url = f.url ?? (f.file ? await uploadToCloudinary(f.file) : undefined);
                        return { ...f, url };
                    } catch (err) {
                        console.error("Erro ao enviar anexo:", f.name, err);
                        return { ...f, url: undefined };
                    }
                })
            );

            const anexos = uploadedResults
                .filter((u) => u.url)
                .map((u) => {
                    const ext = (u.name || "").split(".").pop()?.toLowerCase() || "";
                    const tipoArquivo = ext === "pdf" ? "arquivo" : "imagem";
                    return {
                        tipoArquivo,
                        urlArquivo: u.url,
                        nomeArquivo: u.name,
                        extensaoArquivo: ext,
                        descricao: "",
                    };
                });

            if (assinaturaUrl) {
                anexos.push({
                    tipoArquivo: "assinatura",
                    urlArquivo: assinaturaUrl,
                    nomeArquivo: `${numeroOcorrencia}.png`,
                    extensaoArquivo: "png",
                    descricao: "Assinatura do responsável",
                });
            }

            const payload = {
                numeroOcorrencia: numeroOcorrencia,
                dataHoraChamada: dataChamado ? new Date(dataChamado).toISOString() : new Date().toISOString(),
                statusAtendimento: mapStatus(statusAtendimento),
                motivoNaoAtendimento: motivoNaoAtendimento || "N/A",
                descricao: descricao || "",
                formaAcionamento: (formaAcionamento || "Telefone").toLowerCase(),
                dataSincronizacao: new Date().toISOString(),
                usuarioId: usuarioLogado?.id,
                unidadeOperacionalId: unidade ? Number(unidade) : undefined,
                naturezaOcorrenciaId: natureza ? Number(natureza) : undefined,
                grupoOcorrenciaId: grupo ? Number(grupo) : undefined,
                subgrupoOcorrenciaId: subgrupo ? Number(subgrupo) : undefined,
                viaturaId: numeracaoViatura ? Number(numeracaoViatura) : undefined,
                eventoEspecialId: eventoEspecial ? 1 : undefined,
                localizacao: {
                    municipio: selectedMunicipioNome || "",
                    bairro: bairro || "",
                    logradouro: logradouro || "",
                    numero: numero || "",
                    complemento: complemento || "",
                    pontoReferencia: referencia || "",
                    latitude: latitude ? Number(latitude) : undefined,
                    longitude: longitude ? Number(longitude) : undefined,
                },
                anexos: Array.isArray(anexos)
                    ? anexos.map((u: any) => ({
                          tipoArquivo: u.tipoArquivo,
                          urlArquivo: u.urlArquivo,
                          nomeArquivo: u.nomeArquivo,
                          extensaoArquivo: u.extensaoArquivo,
                          descricao: u.descricao || "",
                      }))
                    : [],
                tempoResposta: tempoResposta || undefined,
                observacoes: observacoesAdicionais || undefined,
            };

            console.log("Payload final (antes do postOcorrencia):", payload);
            const response = await postOcorrencia(payload);
            console.log("Ocorrência enviada:", response);
            const ocorrenciaId = response?.id ?? response?.ocorrenciaId ?? undefined;

            // associar membros da equipe à ocorrência (chamada por usuário)
            if (ocorrenciaId && teamMembers.length > 0) {
                try {
                    await Promise.all(
                        teamMembers.map((m) =>
                            postOcorrenciaUsuario({ ocorrenciaId: Number(ocorrenciaId), userId: Number(m.id) })
                        )
                    );
                    console.log("Membros da equipe associados à ocorrência.");
                } catch (err) {
                    console.error("Erro ao associar membros da equipe:", err);
                    alert("Ocorrência salva, mas falha ao associar membros da equipe. Verifique o console.");
                }
            }

            // enviar vítimas
            if (Array.isArray(vitimas) && vitimas.length > 0) {
                const mapSexo = (s?: string) => {
                    if (!s) return undefined;
                    const low = s.toString().toLowerCase();
                    if (low.startsWith("m")) return "M";
                    if (low.startsWith("f")) return "F";
                    return "O";
                };
                const vitimasPayloads = vitimas.map((v) => ({
                    cpfVitima: v.cpfVitima || "",
                    nome: v.nome || "",
                    idade: v.idade ?? undefined,
                    sexo: mapSexo(v.sexo),
                    tipoAtendimento: v.tipoAtendimento || undefined,
                    observacoes: v.observacoes || undefined,
                    etnia: v.etnia || undefined,
                    destinoVitima: v.destinoVitima || undefined,
                    ocorrenciaId: ocorrenciaId,
                    lesaoId: v.lesaoId ?? undefined,
                }));
                try {
                    const results = await Promise.all(
                        vitimasPayloads.map((vp) => postVitima(vp))
                    );
                    console.log("Vítimas enviadas:", results);
                } catch (err) {
                    console.error("Erro ao enviar vítimas:", err);
                    alert("Ocorrência enviada, mas falha ao enviar vítimas. Verifique o console.");
                }
            }

            alert("Ocorrência salva com sucesso!");
        } catch (err) {
            console.error("Erro ao salvar ocorrência:", err);
            alert("Falha ao salvar a ocorrência. Confira o console para detalhes.");
        }
    };
    return (
        <ContainerPainel>
            <PageTopHeader>
                <Breadcrumb
                    items={[
                        { label: "Ocorrências", onClick: () => console.log("Voltar às ocorrências") },
                        { label: "Cadastrar Ocorrência" },
                    ]}
                />

                <ResponsiveRow>
                    <GridColumn weight={1}>
                        <StatusAlert isOnline={isOnline}>
                            <div className="status-row">
                                <span className="dot" />
                                <strong>{isOnline ? "Conectado" : "Offline"}</strong>
                            </div>

                            {isOnline ? (
                                <div className="message">
                                    <WarningCircleIcon size={22} />
                                    <span>
                                        Você está conectado. As ocorrências salvas serão enviadas diretamente ao banco de dados.
                                    </span>
                                </div>
                            ) : (
                                <div className="message">
                                    <WarningCircleIcon size={22} />
                                    <span>
                                        Você está offline. As ocorrências serão salvas localmente como rascunho e serão sincronizadas no banco de dados quando ficar online.
                                    </span>
                                </div>
                            )}
                        </StatusAlert>
                    </GridColumn>
                </ResponsiveRow>

                <PageTitle>Cadastrar Ocorrência</PageTitle>
                <PageSubtitle>Preencha as informações abaixo para registrar a ocorrência.</PageSubtitle>
                <RequiredNotice><span>*</span>Campos obrigatórios</RequiredNotice>
            </PageTopHeader>
            <ResponsiveRow>
                <GridColumn weight={1}>
                    <DadosPrincipais
                        numeroOcorrencia={numeroOcorrencia}
                        dataChamado={dataChamado}
                        setDataChamado={setDataChamado}
                        statusAtendimento={statusAtendimento}
                        setStatusAtendimento={setStatusAtendimento}
                        motivoNaoAtendimento={motivoNaoAtendimento}
                        setMotivoNaoAtendimento={setMotivoNaoAtendimento}
                        descricao={descricao}
                        setDescricao={setDescricao}
                        natureza={natureza}
                        setNatureza={setNatureza}
                        grupo={grupo}
                        setGrupo={setGrupo}
                        subgrupo={subgrupo}
                        setSubgrupo={setSubgrupo}
                        formaAcionamento={formaAcionamento}
                        setFormaAcionamento={setFormaAcionamento}
                        eventoEspecial={eventoEspecial}
                        setEventoEspecial={setEventoEspecial}
                    />
                </GridColumn>
            </ResponsiveRow>
            <ResponsiveRow>
                <GridColumn weight={1}>
                    <Localizacao
                        municipios={municipios}
                        setMunicipios={setMunicipios}
                        selectedMunicipioId={selectedMunicipioId}
                        setSelectedMunicipioId={setSelectedMunicipioId}
                        selectedMunicipioNome={selectedMunicipioNome}
                        setSelectedMunicipioNome={setSelectedMunicipioNome}
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
                        isLoadingOffline={!isOnline}
                    />
                </GridColumn>
            </ResponsiveRow>
            <ResponsiveRow>
                <GridColumn weight={1}>
                    <EquipesViaturas
                        unidade={unidade}
                        setUnidade={setUnidade}
                        numeracaoViatura={numeracaoViatura}
                        setNumeracaoViatura={setNumeracaoViatura}
                        onTeamMembersChange={setTeamMembers}
                    />
                </GridColumn>
            </ResponsiveRow>

            <ResponsiveRow>
                <GridColumn weight={1}>
                    <VitimasPessoas
                        vitimas={vitimas}
                        onChange={setVitimas}
                    />
                </GridColumn>
            </ResponsiveRow>
            <ResponsiveRow>
                <GridColumn weight={1}>
                    <AnexosEvidencias
                        uploadedFiles={uploadedFiles}
                        handleFileUpload={handleFileUpload}
                        assinaturaDataUrl={assinaturaDataUrl}
                        setAssinaturaDataUrl={setAssinaturaDataUrl}
                    />
                </GridColumn>
            </ResponsiveRow>
            <ResponsiveRow>
                <GridColumn weight={1}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                        <Button
                            text="Limpar"
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                try {
                                    // Revoke object URLs created for previews
                                    try {
                                        uploadedFiles.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
                                    } catch (err) {
                                        console.error("Erro ao revogar URLs de preview:", err);
                                    }

                                    // Reset form state to defaults
                                    setVitimas([]);
                                    setUploadedFiles([]);
                                    setAssinaturaDataUrl(undefined);
                                    setEventoEspecial(false);
                                    setMunicipios([]);
                                    setSelectedMunicipioId("");
                                    setSelectedMunicipioNome("");
                                    setBairro("");
                                    setLogradouro("");
                                    setNumero("");
                                    setLatitude("");
                                    setLongitude("");
                                    setComplemento("");
                                    setReferencia("");
                                    setUnidade("");
                                    setNumeracaoViatura("");
                                    setTempoResposta("");
                                    setObservacoesAdicionais("");
                                    setNatureza("");
                                    setGrupo("");
                                    setSubgrupo("");
                                    setDescricao("");
                                    setMotivoNaoAtendimento("");
                                    setFormaAcionamento("Telefone");
                                    setStatusAtendimento("Pendente");
                                    setTeamMembers([]);

                                    // Reset data/hora e gerar novo número de ocorrência
                                    setDataChamado(getCurrentDateTime());
                                    const now = new Date();
                                    const offset = now.getTimezoneOffset();
                                    const adjusted = new Date(now.getTime() - offset * 60 * 1000);
                                    const formattedDate = adjusted.toISOString().replace(/[-:.TZ]/g, "");
                                    setNumeroOcorrencia(`OCR${formattedDate}`);

                                    alert("Formulário limpo.");
                                } catch (err) {
                                    console.error("Erro ao limpar formulário:", err);
                                    alert("Não foi possível limpar completamente. Veja o console.");
                                }
                            }}
                            style={{ padding: "8px 14px", borderRadius: 6 }}
                        />
                        {isOnline ? (
                            <Button
                                text="Salvar Ocorrência"
                                type="button"
                                variant="danger"
                                onClick={handleSaveOcorrencia}
                            />
                        ) : (
                            <Button
                                text="Salvar Rascunho Offline"
                                type="button"
                                variant="danger"
                                onClick={saveDraft}
                            />
                        )}
                    </div>
                </GridColumn>
            </ResponsiveRow>
        </ContainerPainel>
    );
}