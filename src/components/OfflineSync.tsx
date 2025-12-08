/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useOnlineStatus } from "../utils/useOnlineStatus";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { processarUploadsArquivos, dataUrlParaFile, prepararAnexos, mapearStatusOcorrencia, postOcorrenciaComTimeout, fetchGeocodeCompleto, mapearSexo, postVitimaComTimeout } from "../services/api";


// Tipos necessários
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

export function OfflineSync() {
    const isOnline = useOnlineStatus();
    const prevOnline = useRef(isOnline);
    const [drafts, setDrafts] = useState<any[]>([]);
    const auth = useContext(AuthContext);
    const usuarioLogadoId = (auth && auth.user && (auth.user as any).id) ? Number((auth.user as any).id) : undefined;
    const isSyncing = useRef(false);
    const syncAttempts = useRef(new Map());
    const lastSyncTime = useRef(0);

    // Carregar drafts do localStorage - verificação mais frequente
    useEffect(() => {
        const loadDrafts = () => {
            try {
                const savedDrafts = localStorage.getItem('ocorrenciaDrafts');
                if (savedDrafts) {
                    const parsed = JSON.parse(savedDrafts);
                    setDrafts(Array.isArray(parsed) ? parsed : []);
                } else {
                    setDrafts([]);
                }
            } catch (err) {
                console.error("Erro ao carregar drafts:", err);
                setDrafts([]);
            }
        };

        loadDrafts();

        // Verificar a cada 1.5 segundos por mudanças no localStorage
        const intervalId = setInterval(loadDrafts, 1500);

        // Também verificar quando a página ganha foco (usuário volta para a aba)
        const handleFocus = () => {
            loadDrafts();
            if (isOnline && !isSyncing.current) {
                syncDrafts(false, 'focus');
            }
        };

        window.addEventListener('focus', handleFocus);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('focus', handleFocus);
        };
    }, [isOnline]);

    // Sincronizar quando ficar online
    useEffect(() => {
        if (isOnline && !prevOnline.current) {
            console.log("🔗 Conexão restaurada - iniciando sincronização...");
            syncDrafts(true, 'online-restored');
        }
        prevOnline.current = isOnline;
    }, [isOnline]);

    // Sincronizar periodicamente quando online e tiver drafts
    useEffect(() => {
        if (isOnline && drafts.length > 0 && !isSyncing.current) {
            const now = Date.now();
            // Sincronizar a cada 30 segundos se tiver drafts pendentes
            if (now - lastSyncTime.current > 30000) {
                syncDrafts(false, 'periodic');
            }
        }
    }, [drafts, isOnline]);

    // Sincronizar imediatamente quando drafts mudarem e estiver online
    useEffect(() => {
        if (isOnline && drafts.length > 0 && !isSyncing.current) {
            // Pequeno delay para agrupar múltiplas mudanças
            const timeoutId = setTimeout(() => {
                syncDrafts(false, 'drafts-changed');
            }, 1000);

            return () => clearTimeout(timeoutId);
        }
    }, [drafts.length, isOnline]);

    const syncDrafts = async (isTransitionToOnline: boolean = false, trigger: string = 'unknown') => {
        if (isSyncing.current) {
            console.log(`⏳ Sync já em andamento, ignorando trigger: ${trigger}`);
            return;
        }

        if (drafts.length === 0) {
            console.log("📭 Nenhum rascunho para sincronizar");
            return;
        }

        if (!isOnline) {
            console.log("📡 Offline - não é possível sincronizar");
            return;
        }

        console.log(`🚀 Iniciando sincronização (trigger: ${trigger}) - ${drafts.length} rascunhos`);

        isSyncing.current = true;
        lastSyncTime.current = Date.now();

        let sentCount = 0;
        const failedDrafts: any[] = [];
        const successfulIds: number[] = [];
        const successfulOcorrenciaIds: number[] = [];

        // Fazer uma cópia atualizada dos drafts do localStorage
        let currentDrafts;
        try {
            const savedDrafts = localStorage.getItem('ocorrenciaDrafts');
            currentDrafts = savedDrafts ? JSON.parse(savedDrafts) : [];
            if (!Array.isArray(currentDrafts)) currentDrafts = [];
        } catch (err) {
            console.error("Erro ao ler drafts do localStorage:", err);
            currentDrafts = [...drafts];
        }

        // Processar drafts em sequência
        for (const draft of currentDrafts) {
            try {
                const attemptCount = syncAttempts.current.get(draft.id) || 0;
                if (attemptCount > 5) {
                    console.warn(`🔄 Draft ${draft.id} ignorado após ${attemptCount} tentativas falhas`);
                    continue;
                }

                console.log(`📤 Processando draft ${draft.id}...`);
                const result = await processDraft(draft);

                if (result.success) {
                    successfulIds.push(draft.id);
                    if (result.ocorrenciaId) {
                        successfulOcorrenciaIds.push(result.ocorrenciaId);
                    }
                    sentCount++;
                    syncAttempts.current.delete(draft.id);
                    console.log(`✅ Draft ${draft.id} sincronizado com sucesso`);
                } else {
                    const newAttemptCount = attemptCount + 1;
                    syncAttempts.current.set(draft.id, newAttemptCount);
                    failedDrafts.push(draft);
                    console.warn(`❌ Falha ao sincronizar draft ${draft.id} (tentativa ${newAttemptCount})`);
                }
            } catch (err) {
                console.error(`💥 Erro crítico ao processar draft ${draft.id}:`, err);
                const attemptCount = syncAttempts.current.get(draft.id) || 0;
                syncAttempts.current.set(draft.id, attemptCount + 1);
                failedDrafts.push(draft);
            }
        }

        // Atualizar localStorage removendo apenas os bem-sucedidos
        if (successfulIds.length > 0) {
            try {
                const updatedDrafts = currentDrafts.filter((d: any) => !successfulIds.includes(d.id));
                localStorage.setItem('ocorrenciaDrafts', JSON.stringify(updatedDrafts));

                // Atualizar estado também
                setDrafts(updatedDrafts);

                console.log(`🗑️ Removidos ${successfulIds.length} drafts sincronizados do localStorage`);
            } catch (err) {
                console.error("Erro ao atualizar localStorage:", err);
            }
        }

        // Feedback para o usuário
        if (sentCount > 0) {
            let message = `${sentCount} ocorrência${sentCount > 1 ? 's' : ''} sincronizada${sentCount > 1 ? 's' : ''} com sucesso.`;
            if (successfulOcorrenciaIds.length > 0) {
                message += ` IDs: ${successfulOcorrenciaIds.join(', ')}`;
            }

            if (isTransitionToOnline) {
                message = `🔗 Agora online! ${message}`;
            }

            showNotification(message, 'success');
            console.log(`🎉 ${message}`);
        }

        if (failedDrafts.length > 0) {
            console.warn(`⚠️ ${failedDrafts.length} rascunhos falharam na sincronização e serão retentados`);
        }

        isSyncing.current = false;
        console.log(`🏁 Sincronização concluída. ${sentCount} sucessos, ${failedDrafts.length} falhas`);
    };

    const processDraft = async (draft: any): Promise<{ success: boolean; ocorrenciaId?: number }> => {
        try {
            // Geocoding se necessário
            let finalDraft = { ...draft };
            if (!finalDraft.latitude || !finalDraft.longitude) {
                finalDraft = await attemptGeocoding(finalDraft);
            }

            // Upload de arquivos usando a função do api.ts
            const uploadedResults = await processarUploadsArquivos(finalDraft.uploadedFiles || []);

            // Upload da assinatura
            let assinaturaUrl: string | undefined;
            if (finalDraft.assinaturaDataUrl) {
                try {
                    const assinaturaFileName = `assinatura${finalDraft.numeroOcorrencia}.png`;
                    const file = await dataUrlParaFile(finalDraft.assinaturaDataUrl, assinaturaFileName, "image/png");
                    assinaturaUrl = await uploadToCloudinary(file);
                } catch (err) {
                    console.error("Erro no upload da assinatura:", err);
                }
            }

            // Preparar anexos usando a função do api.ts
            const anexos = prepararAnexos(uploadedResults, assinaturaUrl, finalDraft.numeroOcorrencia);

            // Payload da ocorrência
            const payload = {
                numeroOcorrencia: finalDraft.numeroOcorrencia,
                dataHoraChamada: finalDraft.dataChamado ? new Date(finalDraft.dataChamado).toISOString() : new Date().toISOString(),
                statusAtendimento: mapearStatusOcorrencia(finalDraft.statusAtendimento),
                motivoNaoAtendimento: finalDraft.motivoNaoAtendimento || "N/A",
                descricao: finalDraft.descricao || "",
                formaAcionamento: (finalDraft.formaAcionamento || "Telefone").toLowerCase(),
                dataSincronizacao: new Date().toISOString(),
                usuarioId: usuarioLogadoId,
                unidadeOperacionalId: finalDraft.unidade ? Number(finalDraft.unidade) : undefined,
                naturezaOcorrenciaId: finalDraft.natureza ? Number(finalDraft.natureza) : undefined,
                grupoOcorrenciaId: finalDraft.grupo ? Number(finalDraft.grupo) : undefined,
                subgrupoOcorrenciaId: finalDraft.subgrupo ? Number(finalDraft.subgrupo) : undefined,
                viaturaId: finalDraft.numeracaoViatura ? Number(finalDraft.numeracaoViatura) : undefined,
                eventoEspecialId: finalDraft.eventoEspecial ? 1 : undefined,
                localizacao: {
                    municipio: finalDraft.selectedMunicipioNome || "",
                    bairro: finalDraft.bairro || "",
                    logradouro: finalDraft.logradouro || "",
                    numero: finalDraft.numero || "",
                    complemento: finalDraft.complemento || "",
                    pontoReferencia: finalDraft.referencia || "",
                    latitude: finalDraft.latitude ? Number(finalDraft.latitude) : undefined,
                    longitude: finalDraft.longitude ? Number(finalDraft.longitude) : undefined,
                },
                anexos: anexos,
                tempoResposta: finalDraft.tempoResposta || undefined,
                observacoes: finalDraft.observacoesAdicionais || undefined,
            };

            // Enviar ocorrência usando a função do api.ts
            const response = await postOcorrenciaComTimeout(payload, 30000);

            const ocorrenciaId = response?.id ?? response?.ocorrenciaId ?? undefined;

            if (ocorrenciaId !== undefined) {
                // Enviar vítimas
                if (Array.isArray(finalDraft.pessoas) && finalDraft.pessoas.length > 0) {
                    await sendVitimas(finalDraft.pessoas, ocorrenciaId);
                }
                return { success: true, ocorrenciaId };
            }

            return { success: false };
        } catch (err) {
            console.error("Erro ao processar draft:", err);
            return { success: false };
        }
    };

    const attemptGeocoding = async (draft: any): Promise<any> => {
        try {
            const municipioNome = draft.selectedMunicipioNome || "";
            const q = `${draft.logradouro}, ${draft.numero}, ${draft.bairro}, ${municipioNome}, Pernambuco, Brazil`;

            const json = await fetchGeocodeCompleto(q);
            
            if (json.length > 0) {
                return {
                    ...draft,
                    latitude: json[0].lat,
                    longitude: json[0].lon
                };
            }
        } catch (err) {
            console.error("Erro no geocoding:", err);
        }
        return draft;
    };

    const sendVitimas = async (pessoas: Pessoa[], ocorrenciaId: number) => {
        const vitimasPayloads = pessoas.map((p: Pessoa) => ({
            cpfVitima: p.cpf || "",
            nome: p.nome || "",
            idade: p.idade ?? undefined,
            sexo: mapearSexo(p.sexo),
            tipoAtendimento: p.tipoAtendimento || undefined,
            observacoes: p.observacoes || undefined,
            etnia: p.etnia || undefined,
            destinoVitima: p.destinoVitima || undefined,
            ocorrenciaId: ocorrenciaId,
            lesaoId: p.condicao ? Number(p.condicao) : (p.condicaoVitima ?? undefined),
        }));

        await Promise.all(
            vitimasPayloads.map((vp: any) =>
                postVitimaComTimeout(vp, 15000)
            )
        );
    };

    const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
        // Usar console para debug
        console.log(`[${type.toUpperCase()}] ${message}`);

        // Notificação nativa do browser
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Sincronização de Ocorrências', {
                body: message,
                icon: '/icon.png'
            });
        }

        // Alert como fallback
        alert(message);
    };

    // Adicionar função manual de sync que pode ser chamada de outros componentes
    useEffect(() => {
        const forceSyncHandler = () => {
            console.log("🔄 Sincronização forçada via botão");
            syncDrafts(false, 'manual-button');
        };

        // Expor a função no window
        (window as any).forceSync = forceSyncHandler;

        // Função para verificar drafts
        (window as any).checkDrafts = () => {
            const drafts = localStorage.getItem('ocorrenciaDrafts');
            const parsed = drafts ? JSON.parse(drafts) : [];
            console.log("📋 Drafts no localStorage:", parsed);
            console.log("📊 Quantidade:", parsed.length);
            return parsed;
        };

        // Cleanup
        return () => {
            delete (window as any).forceSync;
            delete (window as any).checkDrafts;
        };
    }, [syncDrafts]);

    return null;
}