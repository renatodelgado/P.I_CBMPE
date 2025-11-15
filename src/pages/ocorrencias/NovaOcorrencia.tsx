/* eslint-disable react-hooks/exhaustive-deps */
// File: src/components/NovaOcorrencia.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Breadcrumb } from "../../components/Breadcrumb";
import { ContainerPainel, PageTopHeader, ResponsiveRow, GridColumn, PageTitle, PageSubtitle, RequiredNotice, StatusAlert } from "../../components/EstilosPainel.styles";
import type { Municipio } from "../../services/municipio_bairro";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import { useOnlineStatus } from "../../utils/useOnlineStatus";
import { AnexosEvidencias } from "./sections/AnexosEvidencias";
import { DadosPrincipais } from "./sections/DadosPrincipais";
import { EquipesViaturas } from "./sections/EquipesViaturas";
import { Localizacao } from "./sections/Localizacao";
import { VitimasPessoas } from "./sections/VitimasPessoas";
import { Button } from "../../components/Button";
import { WarningCircleIcon } from "@phosphor-icons/react";


type Pessoa = {
    id: number;
    nome: string;
    sexo?: string;
    etnia?: string;
    idade?: number;
    cpf: string;
    tipoAtendimento: string;
    observacoes: string;
    condicao: string;
    destinoVitima?: string;
    condicaoVitima?: number;
};

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

const dataUrlToFile = async (dataUrl: string, filename: string, type: string) => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type });
};

const mapStatus = (s: string) => {
    switch (s) {
        case "Pendente":
            return "pendente";
        case "Em andamento":
            return "em_andamento";
        case "Concluída":
            return "concluida";
        case "Não Atendido":
            return "nao_atendido";
        default:
            return String(s).toLowerCase().replace(/\s+/g, "_");
    }
};

export function CadastrarOcorrencia() {
    const isOnline = useOnlineStatus();
    const prevOnline = useRef(isOnline);
    const [municipios, setMunicipios] = useState<Municipio[]>([]);
    const [pessoas, setPessoas] = useState<Pessoa[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [assinaturaDataUrl, setAssinaturaDataUrl] = useState<string | undefined>(undefined);
    const [eventoEspecial, setEventoEspecial] = useState(false);
    const [usuarioLogado] = useState({ id: 64 });
    const [numeroOcorrencia, setNumeroOcorrencia] = useState("");
    const [drafts, setDrafts] = useState<any[]>([]);

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

    useEffect(() => {
        const savedDrafts = localStorage.getItem('ocorrenciaDrafts');
        if (savedDrafts) {
            const parsedDrafts = JSON.parse(savedDrafts);
            setDrafts(parsedDrafts);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('ocorrenciaDrafts', JSON.stringify(drafts));
    }, [drafts]);

    useEffect(() => {
        if (isOnline && drafts.length > 0) {
            syncDrafts();
        }
        prevOnline.current = isOnline;
    }, [isOnline, drafts.length]);

    const syncDrafts = async () => {
        let sentCount = 0;
        const currentDrafts = [...drafts];
        const successfulIds: number[] = [];
        for (const draft of currentDrafts) {
            try {
                // Perform geocoding if latitude or longitude is missing
                if (!draft.latitude || !draft.longitude) {
                    const municipioNome = draft.selectedMunicipioNome || "";
                    const q = `${draft.logradouro}, ${draft.numero}, ${draft.bairro}, ${municipioNome}, Pernambuco, Brazil`;
                    try {
                        const res = await fetch(
                            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`
                        );
                        if (res.ok) {
                            const json = await res.json();
                            if (json.length > 0) {
                                draft.latitude = json[0].lat;
                                draft.longitude = json[0].lon;
                            }
                        }
                    } catch (err) {
                        console.error("Erro no geocoding durante sync:", err);
                    }
                }

                const uploadedResults = await Promise.all(
                    draft.uploadedFiles.map(async (f: any) => {
                        if (f.url) return { ...f, url: f.url };
                        const file = await dataUrlToFile(f.data, f.name, f.type || 'application/octet-stream');
                        const url = await uploadToCloudinary(file);
                        return { ...f, url };
                    })
                );

                let assinaturaUrl: string | undefined = undefined;
                if (draft.assinaturaDataUrl) {
                    const blob = await (await fetch(draft.assinaturaDataUrl)).blob();
                    const assinaturaFileName = `assinatura${draft.numeroOcorrencia}.png`;
                    const file = new File([blob], assinaturaFileName, { type: "image/png" });
                    assinaturaUrl = await uploadToCloudinary(file);
                }

                const anexos = uploadedResults
                    .filter((u: any) => u.url)
                    .map((u: any) => {
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
                        nomeArquivo: `${draft.numeroOcorrencia}.png`,
                        extensaoArquivo: "png",
                        descricao: "Assinatura do responsável",
                    });
                }

                const payload = {
                    numeroOcorrencia: draft.numeroOcorrencia,
                    dataHoraChamada: draft.dataChamado ? new Date(draft.dataChamado).toISOString() : new Date().toISOString(),
                    statusAtendimento: mapStatus(draft.statusAtendimento),
                    motivoNaoAtendimento: draft.motivoNaoAtendimento || "N/A",
                    descricao: draft.descricao || "",
                    formaAcionamento: (draft.formaAcionamento || "Telefone").toLowerCase(),
                    dataSincronizacao: new Date().toISOString(),
                    usuarioId: usuarioLogado.id,
                    unidadeOperacionalId: draft.unidade ? Number(draft.unidade) : undefined,
                    naturezaOcorrenciaId: draft.natureza ? Number(draft.natureza) : undefined,
                    grupoOcorrenciaId: draft.grupo ? Number(draft.grupo) : undefined,
                    subgrupoOcorrenciaId: draft.subgrupo ? Number(draft.subgrupo) : undefined,
                    viaturaId: draft.numeracaoViatura ? Number(draft.numeracaoViatura) : undefined,
                    eventoEspecialId: draft.eventoEspecial ? 1 : undefined,
                    localizacao: {
                        municipio: draft.selectedMunicipioNome || "",
                        bairro: draft.bairro || "",
                        logradouro: draft.logradouro || "",
                        numero: draft.numero || "",
                        complemento: draft.complemento || "",
                        pontoReferencia: draft.referencia || "",
                        latitude: draft.latitude ? Number(draft.latitude) : undefined,
                        longitude: draft.longitude ? Number(draft.longitude) : undefined,
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
                    tempoResposta: draft.tempoResposta || undefined,
                    observacoes: draft.observacoesAdicionais || undefined,
                };

                const response = await axios.post("https://backend-chama.up.railway.app/ocorrencias", payload, {
                    headers: { "Content-Type": "application/json" },
                });
                const ocorrenciaId = response.data?.id ?? response.data?.ocorrenciaId ?? undefined;

                if (Array.isArray(draft.pessoas) && draft.pessoas.length > 0) {
                    const mapSexo = (s?: string) => {
                        if (!s) return undefined;
                        const low = s.toString().toLowerCase();
                        if (low.startsWith("m")) return "M";
                        if (low.startsWith("f")) return "F";
                        return "O";
                    };
                    const vitimasPayloads = draft.pessoas.map((p: Pessoa) => ({
                        cpfVitima: p.cpf || "",
                        nome: p.nome || "",
                        idade: p.idade ?? undefined,
                        sexo: mapSexo(p.sexo),
                        tipoAtendimento: p.tipoAtendimento || undefined,
                        observacoes: p.observacoes || undefined,
                        etnia: p.etnia || undefined,
                        destinoVitima: p.destinoVitima || undefined,
                        ocorrenciaId: ocorrenciaId,
                        lesaoId: p.condicao ? Number(p.condicao) : (p.condicaoVitima ?? undefined),
                    }));
                    await Promise.all(
                        vitimasPayloads.map((vp:any) =>
                            axios.post("https://backend-chama.up.railway.app/vitimas/", vp, {
                                headers: { "Content-Type": "application/json" },
                            })
                        )
                    );
                }

                successfulIds.push(draft.id);
                sentCount++;
            } catch (err) {
                console.error("Erro ao sincronizar rascunho:", err);
            }
        }
        if (successfulIds.length > 0) {
            setDrafts((prev) => prev.filter((d) => !successfulIds.includes(d.id)));
        }
        if (sentCount > 0) {
            alert(`${sentCount} ocorrência${sentCount > 1 ? 's' : ''} foi${sentCount > 1 ? 'ram' : ''} enviada${sentCount > 1 ? 's' : ''} ao banco de dados com sucesso.`);
        }
    };

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
                pessoas,
                uploadedFiles: filesData,
                assinaturaDataUrl,
            };

            setDrafts((prev) => [...prev, draft]);

            uploadedFiles.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
            setPessoas([]);
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

    const addPessoa = () => {
        setPessoas((prev) => [
            ...prev,
            { id: Date.now() + Math.floor(Math.random() * 1000), nome: "", idade: undefined, cpf: "", tipoAtendimento: "", condicao: "", sexo: "", etnia: "", observacoes: "" },
        ]);
    };

    const updatePessoa = (id: number, patch: Partial<Pessoa>) => {
        setPessoas((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    };

    const removePessoa = (id: number) => {
        setPessoas((prev) => (prev.length > 0 ? prev.filter((p) => p.id !== id) : prev));
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
                    />
                </GridColumn>
            </ResponsiveRow>
            <ResponsiveRow>
                <GridColumn weight={1}>
                    <VitimasPessoas
                        pessoas={pessoas}
                        addPessoa={addPessoa}
                        updatePessoa={updatePessoa}
                        removePessoa={removePessoa}
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
                                    setPessoas([]);
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
                                onClick={async () => {
                                    try {
                                        if (!isOnline) {
                                            alert("Sem internet. Não é possível salvar a ocorrência.");
                                            return;
                                        }

                                        let assinaturaUrl: string | undefined = undefined;
                                        if (assinaturaDataUrl) {
                                            const blob = await (await fetch(assinaturaDataUrl)).blob();
                                            const assinaturaFileName = `assinatura${numeroOcorrencia}.png`;
                                            const file = new File([blob], assinaturaFileName, { type: "image/png" });
                                            assinaturaUrl = await uploadToCloudinary(file);
                                        }
                                        const uploadedResults = await Promise.all(
                                            uploadedFiles.map(async (f) => {
                                                const url = f.url ?? (f.file ? await uploadToCloudinary(f.file) : undefined);
                                                return { ...f, url };
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
                                            usuarioId: usuarioLogado.id,
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
                                        console.log(payload);
                                        const response = await axios.post("https://backend-chama.up.railway.app/ocorrencias", payload, {
                                            headers: { "Content-Type": "application/json" },
                                        });
                                        console.log("Ocorrência enviada:", response.data);
                                        const ocorrenciaId = response.data?.id ?? response.data?.ocorrenciaId ?? undefined;
                                        if (Array.isArray(pessoas) && pessoas.length > 0) {
                                            const mapSexo = (s?: string) => {
                                                if (!s) return undefined;
                                                const low = s.toString().toLowerCase();
                                                if (low.startsWith("m")) return "M";
                                                if (low.startsWith("f")) return "F";
                                                return "O";
                                            };
                                            const vitimasPayloads = pessoas.map((p) => ({
                                                cpfVitima: p.cpf || "",
                                                nome: p.nome || "",
                                                idade: p.idade ?? undefined,
                                                sexo: mapSexo(p.sexo),
                                                tipoAtendimento: p.tipoAtendimento || undefined,
                                                observacoes: p.observacoes || undefined,
                                                etnia: p.etnia || undefined,
                                                destinoVitima: p.destinoVitima || undefined,
                                                ocorrenciaId: ocorrenciaId,
                                                lesaoId: p.condicao ? Number(p.condicao) : (p.condicaoVitima ?? undefined),
                                            }));
                                            try {
                                                const results = await Promise.all(
                                                    vitimasPayloads.map((vp) =>
                                                        axios.post("https://backend-chama.up.railway.app/vitimas/", vp, {
                                                            headers: { "Content-Type": "application/json" },
                                                        })
                                                    )
                                                );
                                                console.log("Vítimas enviadas:", results.map(r => r.data));
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
                                }}
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