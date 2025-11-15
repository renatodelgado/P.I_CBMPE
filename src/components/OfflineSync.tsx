/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useOnlineStatus } from "../utils/useOnlineStatus";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

// Tipos necessários (copiados/adaptados do seu código original)
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

export function OfflineSync() {
    const isOnline = useOnlineStatus();
    const prevOnline = useRef(isOnline);
    const [drafts, setDrafts] = useState<any[]>([]);
    const [usuarioLogado] = useState({ id: 64 }); // Mantenha como no original; se for dinâmico, use contexto ou props

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
        if (isOnline && !prevOnline.current && drafts.length > 0) {
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
                // Geocoding se necessário (igual ao original)
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

                // Upload de arquivos (igual ao original)
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

                // Payload da ocorrência (igual ao original)
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

                // Envio de vítimas (igual ao original)
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
                        vitimasPayloads.map((vp: any) =>
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

    return null; // Não renderiza nada na UI
}