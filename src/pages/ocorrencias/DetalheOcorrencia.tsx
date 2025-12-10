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
  PersonCard,
  PersonCardHeader,
} from "../../components/EstilosPainel.styles";
import { Breadcrumb } from "../../components/Breadcrumb";
import { Button } from "../../components/Button";
import { EyeIcon, FileTextIcon, UserIcon, PaperclipIcon, PencilIcon, FireTruckIcon, XIcon } from "@phosphor-icons/react";
import { getOcorrenciaPorId, fetchVitimasPorOcorrencia, putOcorrencia, fetchEquipeOcorrencia, fetchSubgruposOcorrencias } from "../../services/api";
import { formatarDataHora, getStatusColor } from "../../utils/ocorrencias";
import { LocalizacaoView } from "./sections/LocalizacaoView";
import type { Usuario } from "../../services/api";




interface PessoaDetalhes {
  id: number;
  nome: string;
  cpfVitima: string;
  idade?: number;
  sexo?: string;
  etnia?: string;
  tipoAtendimento?: string;
  observacoes?: string;
  destinoVitima?: string;
  lesao?: {
    id: number;
    tipoLesao: string;
  };
}

interface AnexoDetalhes {
  id: number;
  tipoArquivo: string;
  urlArquivo: string;
  nomeArquivo: string;
  extensaoArquivo: string;
  descricao: string;
}

interface LocalizacaoDetalhes {
  municipio: string;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  pontoReferencia: string;
  latitude?: number;
  longitude?: number;
}

interface OcorrenciaDetalhes {
  id: number;
  numeroOcorrencia: string;
  dataHoraChamada: string;
  statusAtendimento: string;
  motivoNaoAtendimento?: string;
  descricao: string;
  formaAcionamento: string;
  tempoResposta?: string;
  observacoes?: string;
  usuario?: {
    nome: string;
    matricula?: string;
  };
  naturezaOcorrencia?: {
    id: number;
    nome: string;
    sigla: string;
    pontoBase: string;
  };
  grupoOcorrencia?: {
    id: number;
    nome: string;
  };
  subgrupoOcorrencia?: {
    id: number;
    nome: string;
  };
  viatura?: {
    id: number;
    tipo: string;
    numero: string;
    placa?: string;
  };
  unidadeOperacional?: {
    id: number;
    nome: string;
    sigla: string;
    pontoBase: string;
  };
  eventoEspecial?: {
    id: number;
    nome: string;
  };
  localizacao?: LocalizacaoDetalhes;
  anexos?: AnexoDetalhes[];
  //vitima?: PessoaDetalhes[];
}

export function DetalhesOcorrencia() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const usuarioLogadoId = auth?.user?.id;
  
  const [ocorrencia, setOcorrencia] = useState<OcorrenciaDetalhes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vitimas, setVitimas] = useState<PessoaDetalhes[]>([]);
  const [equipe, setEquipe] = useState<Usuario[]>([]);
  const [saving, setSaving] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [imagemSelecionada, setImagemSelecionada] = useState<AnexoDetalhes | null>(null);

  // Função para normalizar status do backend
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

  // Função para mapear forma de acionamento para exibição
  const mapFormaAcionamentoToDisplay = (forma: string | undefined): string => {
    if (!forma) return "Não informada";
    const normalized = forma.toLowerCase().trim();
    
    switch (normalized) {
      case "ligacao":
      case "ligação":
        return "Ligação Telefônica";
      case "whatsapp":
        return "WhatsApp";
      case "pessoalmente":
        return "Pessoalmente";
      case "email":
        return "Email";
      case "192":
        return "Via 192";
      default:
        return forma;
    }
  };

  useEffect(() => {
    async function fetchOcorrenciaDetalhes() {
      try {
        setLoading(true);
        setError(null);
        
        if (!id) return;
        
        const data = await getOcorrenciaPorId(id);
        
        if (!data) {
          throw new Error('Ocorrência não encontrada');
        }
        
        console.log('Dados recebidos:', data);
        console.log('subgrupoOcorrenciaId do backend:', data.subgrupoOcorrenciaId);
        console.log('subgrupoOcorrencia do backend:', data.subgrupoOcorrencia);
        console.log('SubgrupoOcorrencia (maiúsculo) do backend:', (data as Record<string, unknown>).SubgrupoOcorrencia);

        // Resolver subgrupo considerando respostas com chave maiúscula/minúscula e, se necessário, fazendo fetch da lista
        type SubgrupoCandidate = { id?: number; nome?: string } | null | undefined;
        type SubgrupoResolved = { id: number; nome: string } | undefined;

        // Verificar SubgrupoOcorrencia (maiúscula) - mas só usar se tiver id
        const subgrupoMaiusculo = (data as { SubgrupoOcorrencia?: SubgrupoCandidate }).SubgrupoOcorrencia;
        const subgrupoMinusculo = data.subgrupoOcorrencia || (data as { subgrupoOcorrencia?: SubgrupoCandidate }).subgrupoOcorrencia;
        
        // Preferir o que tiver id válido
        const subgrupoResp: SubgrupoCandidate = (subgrupoMaiusculo?.id ? subgrupoMaiusculo : subgrupoMinusculo);

        const subgrupoId = (data as { subgrupoOcorrenciaId?: number }).subgrupoOcorrenciaId
          ?? subgrupoResp?.id;

        console.log('subgrupoResp extraído:', subgrupoResp);
        console.log('subgrupoId extraído:', subgrupoId);

        let subgrupoFinal: SubgrupoResolved = undefined;

        // Se o backend devolveu o objeto e o ID bate com o ID retornado, usa direto.
        if (subgrupoId && subgrupoResp?.id && Number(subgrupoResp.id) === Number(subgrupoId) && subgrupoResp.nome) {
          subgrupoFinal = { id: Number(subgrupoId), nome: subgrupoResp.nome };
          console.log('Subgrupo resolvido pelo objeto do backend:', subgrupoFinal);
        }

        // Se ainda não resolvido, tenta buscar da lista completa pelo ID enviado/retornado.
        if (!subgrupoFinal && subgrupoId) {
          try {
            console.log('Buscando subgrupo na lista pelo ID:', subgrupoId);
            const subgrupos = await fetchSubgruposOcorrencias();
            console.log('Total de subgrupos carregados:', subgrupos?.length);
            const encontrado = (subgrupos || []).find((s) => Number((s as { id?: number }).id) === Number(subgrupoId)) as SubgrupoCandidate;
            console.log('Subgrupo encontrado na lista:', encontrado);
            if (encontrado?.id && encontrado.nome) {
              subgrupoFinal = { id: Number(encontrado.id), nome: encontrado.nome };
              console.log('Subgrupo resolvido pela lista:', subgrupoFinal);
            }
          } catch (err) {
            console.warn('Não foi possível carregar subgrupos para resolver nome:', err);
          }
        }

        // Se não encontramos pelo ID mas veio um objeto com nome, usa-o como último recurso.
        if (!subgrupoFinal && subgrupoResp?.id && subgrupoResp.nome) {
          subgrupoFinal = { id: Number(subgrupoResp.id), nome: subgrupoResp.nome };
          console.log('Subgrupo resolvido como último recurso:', subgrupoFinal);
        }

        console.log('subgrupoFinal DEFINITIVO:', subgrupoFinal);

        const vitimasData = await fetchVitimasPorOcorrencia(data.id);
        setVitimas(vitimasData || []);
        
        const equipeData = await fetchEquipeOcorrencia(data.id);
        setEquipe(equipeData || []);
        
        const ocorrenciaFormatada: OcorrenciaDetalhes = {
          ...data,
          numeroOcorrencia: data.numeroOcorrencia || '',
          dataHoraChamada: data.dataHoraChamada || '',
          statusAtendimento: data.statusAtendimento || 'pendente',
          descricao: data.descricao || '',
          formaAcionamento: data.formaAcionamento || '',
          usuario: data.usuario?.nome ? { nome: data.usuario.nome, matricula: data.usuario.matricula } : undefined,
          naturezaOcorrencia: data.naturezaOcorrencia ? { 
            id: data.naturezaOcorrencia.id || 0, 
            nome: data.naturezaOcorrencia.nome || '', 
            sigla: data.naturezaOcorrencia.sigla || '', 
            pontoBase: data.naturezaOcorrencia.pontoBase || '' 
          } : undefined,
          grupoOcorrencia: data.grupoOcorrencia || undefined,
          subgrupoOcorrencia: subgrupoFinal,
          viatura: data.viatura ? { 
            id: data.viatura.id || 0, 
            tipo: data.viatura.tipo || '', 
            numero: data.viatura.numero || '',
            placa: data.viatura.placa
          } : undefined,
          unidadeOperacional: data.unidadeOperacional || undefined,
          eventoEspecial: data.eventoEspecial || undefined,
          localizacao: data.localizacao ? {
            municipio: data.localizacao.municipio || '',
            bairro: data.localizacao.bairro || '',
            logradouro: data.localizacao.logradouro || '',
            numero: data.localizacao.numero || '',
            complemento: data.localizacao.complemento || '',
            pontoReferencia: data.localizacao.pontoReferencia || '',
            latitude: data.localizacao.latitude ? parseFloat(data.localizacao.latitude) : undefined,
            longitude: data.localizacao.longitude ? parseFloat(data.localizacao.longitude) : undefined,
          } : undefined,
          anexos: data.anexos ? data.anexos.map(anexo => ({
            id: anexo.id || 0,
            tipoArquivo: anexo.tipoArquivo || '',
            urlArquivo: anexo.urlArquivo || '',
            nomeArquivo: anexo.nomeArquivo || '',
            extensaoArquivo: anexo.extensaoArquivo || '',
            descricao: anexo.descricao || '',
          })) : undefined,
        };
        setOcorrencia(ocorrenciaFormatada);
      } catch (err) {
        console.error('Erro ao buscar detalhes da ocorrência:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchOcorrenciaDetalhes();
    }
  }, [id, usuarioLogadoId]);

  const handleEditar = () => {
    navigate(`/ocorrencias/editar/${id}`);
  };

  const handleVoltar = () => {
    navigate("/ocorrencias");
  };

  const handleImprimir = () => {
    window.print();
  };

  const handleMarcarComoAtendida = async () => {
    const confirmacao = window.confirm(
      "Marcar como atendida\n\nVocê está prestes a marcar esta ocorrência como atendida. Após isso ela será fechada e não poderá mais ser editada.\n\nDeseja continuar?"
    );

    if (!confirmacao) return;

    if (!id || !ocorrencia) return;
    
    try {
      setSaving(true);
      const payload = {
        statusAtendimento: "atendida"
      };

      await putOcorrencia(Number(id), payload);

      alert('Sucesso\n\nOcorrência marcada como atendida.');
      
      // Atualizar o estado local
      setOcorrencia({
        ...ocorrencia,
        statusAtendimento: "atendida"
      });
    } catch (error) {
      console.error('Erro ao marcar como atendida:', error);
      alert('Erro\n\nNão foi possível marcar a ocorrência como atendida.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ContainerPainel>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>Carregando detalhes da ocorrência...</p>
        </div>
      </ContainerPainel>
    );
  }

  if (error) {
    return (
      <ContainerPainel>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ color: "#EF4444" }}>Erro: {error}</p>
          <Button 
            text="Voltar para lista" 
            onClick={handleVoltar} 
            variant="secondary" 
            style={{ marginTop: "1rem" }}
          />
        </div>
      </ContainerPainel>
    );
  }

  if (!ocorrencia) {
    return (
      <ContainerPainel>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>Ocorrência não encontrada</p>
          <Button 
            text="Voltar para lista" 
            onClick={handleVoltar} 
            variant="secondary" 
            style={{ marginTop: "1rem" }}
          />
        </div>
      </ContainerPainel>
    );
  }

  const dataHoraFormatada = formatarDataHora(ocorrencia.dataHoraChamada);

  return (
    <ContainerPainel>
      <PageTopHeader>
        <Breadcrumb
          items={[
            { 
              label: "Ocorrências", 
              onClick: handleVoltar 
            },
            { 
              label: `Detalhes da Ocorrência` 
            },
          ]}
        />

        
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "0.5rem"
        }}>
          <div style={{ flex: 1 }}>
            <PageTitle>Detalhes da Ocorrência</PageTitle>
            <PageSubtitle>
              Visualize todas as informações da ocorrência {ocorrencia.numeroOcorrencia}
            </PageSubtitle>
          </div>
          
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {normalizeStatusFromBackend(ocorrencia.statusAtendimento) !== "Atendida" && normalizeStatusFromBackend(ocorrencia.statusAtendimento) !== "Não Atendida" && (
              <Button 
                text="Marcar como Atendida"
                onClick={handleMarcarComoAtendida}
                variant="primary"
                style={{ 
                  whiteSpace: "nowrap",
                  opacity: saving ? 0.6 : 1,
                  pointerEvents: saving ? "none" : "auto"
                }}
              />
            )}
            {normalizeStatusFromBackend(ocorrencia.statusAtendimento) !== "Atendida" && normalizeStatusFromBackend(ocorrencia.statusAtendimento) !== "Não Atendida" && (
              <Button 
                text={
                  <>
                    <PencilIcon size={16} style={{ marginRight: "8px" }} />
                    Editar Ocorrência
                  </>
                }
                onClick={handleEditar}
                variant="primary"
                style={{ 
                  whiteSpace: "nowrap",
                  minWidth: "160px"
                }}
              />
            )}
          </div>
        </div>
        
        <RequiredNotice><span>*</span>Campos obrigatórios</RequiredNotice>
      </PageTopHeader>

      
      <ResponsiveRow>
        <GridColumn weight={1}>
          <BoxInfo>
            <SectionTitle><FileTextIcon size={22} weight="fill" />Dados Principais</SectionTitle>
            <Grid>
              <Field>
                <label>Número da Ocorrência</label>
                <input type="text" value={ocorrencia.numeroOcorrencia} readOnly />
              </Field>

              <Field>
                <label className="required">Data/Hora do Chamado</label>
                <input 
                  type="text" 
                  value={dataHoraFormatada ? dataHoraFormatada.completa : "Data inválida"} 
                  readOnly 
                />
              </Field>

              <Field>
                <label>Status de Atendimento</label>
                <input 
                  type="text" 
                  value={normalizeStatusFromBackend(ocorrencia.statusAtendimento)} 
                  readOnly 
                  style={{
                    color: getStatusColor(ocorrencia.statusAtendimento),
                    fontWeight: 600
                  }}
                />
              </Field>

              {normalizeStatusFromBackend(ocorrencia.statusAtendimento) === "Não Atendida" && (
                <FullField>
                  <label>Motivo de Não Atendimento</label>
                  <textarea 
                    value={ocorrencia.motivoNaoAtendimento || "Não especificado"} 
                    readOnly 
                    placeholder="Descreva o motivo pelo qual a ocorrência não foi atendida."
                  />
                </FullField>
              )}

              <Field>
                <label className="required">Natureza da Ocorrência</label>
                <input 
                  type="text" 
                  value={ocorrencia.naturezaOcorrencia?.nome || "Não informada"} 
                  readOnly 
                />
              </Field>

              <Field>
                <label className="required">Grupo da Ocorrência</label>
                <input 
                  type="text" 
                  value={ocorrencia.grupoOcorrencia?.nome || "Não informado"} 
                  readOnly 
                />
              </Field>

              <Field>
                <label className="required">Subgrupo da Ocorrência</label>
                <input 
                  type="text" 
                  value={ocorrencia.subgrupoOcorrencia?.nome || "Não informado"} 
                  readOnly 
                />
              </Field>

              <Field>
                <label className="required">Forma de acionamento</label>
                <input 
                  type="text" 
                  value={mapFormaAcionamentoToDisplay(ocorrencia.formaAcionamento)} 
                  readOnly 
                />
              </Field>

              <Field>
                <label>Evento Especial?</label>
                <input 
                  type="text" 
                  value={ocorrencia.eventoEspecial ? "Sim" : "Não"} 
                  readOnly 
                />
              </Field>

              <FullField>
                <label>Descrição Resumida</label>
                <textarea 
                  value={ocorrencia.descricao || "Nenhuma descrição fornecida"} 
                  readOnly 
                  placeholder="Ex: Incêndio em veículo na Av. Norte, vítima consciente."
                />
              </FullField>

              {ocorrencia.tempoResposta && (
                <Field>
                  <label>Tempo de Resposta</label>
                  <input type="text" value={ocorrencia.tempoResposta} readOnly />
                </Field>
              )}

              {ocorrencia.observacoes && (
                <FullField>
                  <label>Observações Adicionais</label>
                  <textarea 
                    value={ocorrencia.observacoes} 
                    readOnly 
                  />
                </FullField>
              )}
            </Grid>
          </BoxInfo>
        </GridColumn>
      </ResponsiveRow>

      
<ResponsiveRow>
  <GridColumn weight={1}>
    <LocalizacaoView
      municipio={ocorrencia.localizacao?.municipio || ""}
      bairro={ocorrencia.localizacao?.bairro || ""}
      logradouro={ocorrencia.localizacao?.logradouro || ""}
      numero={ocorrencia.localizacao?.numero || ""}
      complemento={ocorrencia.localizacao?.complemento || ""}
      referencia={ocorrencia.localizacao?.pontoReferencia || ""}
      latitude={ocorrencia.localizacao?.latitude}
      longitude={ocorrencia.localizacao?.longitude}
    />
  </GridColumn>
</ResponsiveRow>

            {/* Vítimas e Pessoas Envolvidas */}
<ResponsiveRow>
  <GridColumn weight={1}>
    <BoxInfo>
      <SectionTitle><UserIcon size={22} weight="fill" /> Vítimas e Pessoas Envolvidas</SectionTitle>
      <BoxInfo>
        <Grid>
          {vitimas && vitimas.length > 0 ? (
            vitimas.map((vitima, idx) => (
              <PersonCard key={vitima.id || idx}>
                <PersonCardHeader>
                  <strong>Pessoa {idx + 1}</strong>
                </PersonCardHeader>
                
                <Grid>
                  <Field>
                    <label>Nome Completo</label>
                    <input 
                      type="text" 
                      value={vitima.nome || ""} 
                      readOnly 
                    />
                  </Field>

                  <Field>
                    <label>Idade</label>
                    <input 
                      type="text" 
                      value={vitima.idade?.toString() || ""} 
                      readOnly 
                    />
                  </Field>

                  <Field>
                    <label>Sexo</label>
                    <input 
                      type="text" 
                      value={vitima.sexo ? 
                        vitima.sexo === "M" ? "Masculino" : 
                        vitima.sexo === "F" ? "Feminino" : "Outro" 
                        : ""} 
                      readOnly 
                    />
                  </Field>

                  <Field>
                    <label>Etnia</label>
                    <input 
                      type="text" 
                      value={vitima.etnia || ""} 
                      readOnly 
                    />
                  </Field>

                  <Field>
                    <label>CPF</label>
                    <input 
                      type="text" 
                      value={vitima.cpfVitima || ""} 
                      readOnly 
                      placeholder="000.000.000-00"
                    />
                  </Field>

                  <Field>
                    <label>Tipo de Atendimento</label>
                    <input 
                      type="text" 
                      value={vitima.tipoAtendimento || ""} 
                      readOnly 
                    />
                  </Field>

                  <Field>
                    <label className="required">Condição</label>
                    <input 
                      type="text" 
                      value={vitima.lesao?.tipoLesao || "Não informada"} 
                      readOnly 
                    />
                  </Field>

                  <Field>
                    <label>Destino da Vítima</label>
                    <input 
                      type="text" 
                      value={vitima.destinoVitima || ""} 
                      readOnly 
                    />
                  </Field>

                  <FullField>
                    <label>Observações</label>
                    <textarea 
                      value={vitima.observacoes || ""} 
                      readOnly 
                      placeholder="Anotações sobre a pessoa, estado, etc."
                    />
                  </FullField>
                </Grid>
              </PersonCard>
            ))
          ) : (
            <div style={{ 
              gridColumn: "1 / -1", 
              color: "#64748b", 
              padding: "12px", 
              justifyContent: "center", 
              display: "flex" 
            }}>
              Nenhuma pessoa adicionada
            </div>
          )}
        </Grid>
      </BoxInfo>
    </BoxInfo>
  </GridColumn>
</ResponsiveRow>

      {/* Anexos e Evidências */}
      <ResponsiveRow>
        <GridColumn weight={1}>
          <BoxInfo>
            <SectionTitle><PaperclipIcon size={22} weight="fill" /> Anexos e Evidências</SectionTitle>
            
            {/* Fotos e Arquivos - Miniaturas */}
            <div style={{ marginBottom: "2rem" }}>
              <h4 style={{ marginBottom: "1rem", color: "#444" }}>Fotos e Arquivos</h4>
              
              {ocorrencia.anexos && ocorrencia.anexos.filter(a => a.tipoArquivo !== "assinatura").length > 0 ? (
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", 
                  gap: "1rem" 
                }}>
                  {ocorrencia.anexos
                    .filter(anexo => anexo.tipoArquivo !== "assinatura")
                    .map((anexo) => (
                    <div 
                      key={anexo.id}
                      onClick={() => {
                        setImagemSelecionada(anexo);
                        setModalAberto(true);
                      }}
                      style={{
                        position: "relative",
                        cursor: "pointer",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "2px solid #e2e8f0",
                        transition: "all 0.3s ease",
                        aspectRatio: "1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f8fafc",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "#0ea5e9";
                        (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0";
                        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                      }}
                    >
                      {(anexo.extensaoArquivo?.toLowerCase() === "jpg" || 
                        anexo.extensaoArquivo?.toLowerCase() === "jpeg" || 
                        anexo.extensaoArquivo?.toLowerCase() === "png" || 
                        anexo.extensaoArquivo?.toLowerCase() === "gif" ||
                        anexo.tipoArquivo === "imagem") ? (
                        <>
                          <img 
                            src={anexo.urlArquivo} 
                            alt={anexo.nomeArquivo}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover"
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                          <div 
                            style={{
                              position: "absolute",
                              inset: 0,
                              backgroundColor: "rgba(0, 0, 0, 0.4)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              opacity: 0,
                              transition: "opacity 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.opacity = "1";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.opacity = "0";
                            }}
                          >
                            <EyeIcon size={32} color="white" weight="fill" />
                          </div>
                        </>
                      ) : (
                        <div style={{ textAlign: "center", padding: "1rem" }}>
                          <FileTextIcon size={32} color="#94a3b8" weight="fill" />
                          <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.5rem" }}>
                            {anexo.nomeArquivo}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: "#64748b", fontStyle: "italic", padding: "2rem", textAlign: "center" }}>
                  Nenhum arquivo anexado
                </div>
              )}
            </div>            
          </BoxInfo>
        </GridColumn>
      </ResponsiveRow>

      {/* Equipe, Viaturas e Responsável */}
      <ResponsiveRow>
        <GridColumn weight={1}>
          <BoxInfo>
            <SectionTitle><FireTruckIcon size={22} weight="fill" /> Equipe, Viatura e Responsável</SectionTitle>

            <Grid style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
              {/* Viatura */}
              <div>
                <label className="required" style={{ fontSize: "0.9rem", color: "#374151", marginBottom: "0.5rem", display: "block" }}>
                  Viatura
                </label>
                <div style={{ 
                  padding: "0.75rem 1rem", 
                  backgroundColor: "#f8fafc", 
                  borderRadius: "8px", 
                  border: "1px solid #e2e8f0",
                  fontWeight: 500
                }}>
                  {ocorrencia.viatura 
                    ? `${ocorrencia.viatura.tipo} - ${ocorrencia.viatura.numero}${ocorrencia.viatura.placa ? ` • ${ocorrencia.viatura.placa}` : ''}`
                    : "Não informada"}
                </div>
              </div>

              {/* Unidade Operacional */}
              <div>
                <label className="required" style={{ fontSize: "0.9rem", color: "#374151", marginBottom: "0.5rem", display: "block" }}>
                  Unidade Operacional
                </label>
                <div style={{ 
                  padding: "0.75rem 1rem", 
                  backgroundColor: "#f8fafc", 
                  borderRadius: "8px", 
                  border: "1px solid #e2e8f0",
                  fontWeight: 500
                }}>
                  {ocorrencia.unidadeOperacional?.sigla || "Não informada"}<br />
                  <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    {ocorrencia.unidadeOperacional?.nome}
                  </span>
                </div>
              </div>

              {/* Responsável pela Ocorrência (Criador) */}
              <div>
                <label style={{ fontSize: "0.9rem", color: "#374151", marginBottom: "0.5rem", display: "block" }}>
                  Responsável pela Ocorrência
                </label>
                <div style={{ 
                  padding: "0.75rem 1rem", 
                  backgroundColor: "#ecfdf5", 
                  borderRadius: "8px", 
                  border: "1px solid #86efac",
                  fontWeight: 500,
                  color: "#166534"
                }}>
                  {ocorrencia.usuario?.nome || "Não informado"}
                  {ocorrencia.usuario?.matricula && (
                    <div style={{ fontSize: "0.8rem", opacity: 0.9, marginTop: "4px" }}>
                      Matrícula: {ocorrencia.usuario.matricula}
                    </div>
                  )}
                </div>
              </div>
            </Grid>

            {/* Equipe Atribuída - Chips compactos */}
            {equipe.length > 0 && (
              <div style={{ marginTop: "1.5rem" }}>
                <h4 style={{ marginBottom: "0.75rem", color: "#374151", fontSize: "1rem", fontWeight: 600 }}>
                  Equipe Atribuída ({equipe.length})
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {equipe.map(membro => (
                    <div
                      key={membro.id}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        backgroundColor: "#eff6ff",
                        color: "#1e40af",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        border: "1px solid #bfdbfe"
                      }}
                    >
                      {membro.nome}
                      {membro.patente && ` • ${membro.patente}`}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assinatura do Responsável - exibida diretamente */}
            {ocorrencia.anexos?.find(a => a.tipoArquivo === "assinatura") && (
              <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #e2e8f0" }}>
                <h4 style={{ marginBottom: "1rem", color: "#374151", fontSize: "1rem", fontWeight: 600 }}>
                  Assinatura do Responsável
                </h4>
                <div 
                  onClick={() => {
                    const assinatura = ocorrencia.anexos?.find(a => a.tipoArquivo === "assinatura");
                    if (assinatura) {
                      setImagemSelecionada(assinatura);
                      setModalAberto(true);
                    }
                  }}
                  style={{
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "1rem",
                    backgroundColor: "#f0fdf4",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    maxWidth: "400px"
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#22c55e";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 3px rgba(34, 197, 94, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <img 
                    src={ocorrencia.anexos.find(a => a.tipoArquivo === "assinatura")?.urlArquivo}
                    alt="Assinatura"
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "4px"
                    }}
                  />
                </div>
              </div>
            )}
          </BoxInfo>
        </GridColumn>
      </ResponsiveRow>

      
      <ResponsiveRow>
        <GridColumn weight={1}>
          <BoxInfo>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
              <div>
                {normalizeStatusFromBackend(ocorrencia.statusAtendimento) !== "Atendida" && normalizeStatusFromBackend(ocorrencia.statusAtendimento) !== "Não Atendida" && (
                  <Button 
                    text="Marcar como Atendida"
                    onClick={handleMarcarComoAtendida}
                    variant="primary"
                    style={{
                      opacity: saving ? 0.6 : 1,
                      pointerEvents: saving ? "none" : "auto"
                    }}
                  />
                )}
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <Button 
                  text="Voltar para Lista" 
                  onClick={handleVoltar} 
                  variant="secondary" 
                />
                {normalizeStatusFromBackend(ocorrencia.statusAtendimento) !== "Atendida" && normalizeStatusFromBackend(ocorrencia.statusAtendimento) !== "Não Atendida" && (
                  <Button 
                    text={
                      <>
                        <PencilIcon size={16} style={{ marginRight: "8px" }} />
                        Editar Ocorrência
                      </>
                    }
                    onClick={handleEditar}
                    variant="primary"
                  />
                )}
                <Button 
                  text="Imprimir/PDF" 
                  onClick={handleImprimir} 
                  variant="primary" 
                />
              </div>
            </div>
          </BoxInfo>
        </GridColumn>
      </ResponsiveRow>

      {/* Modal para visualizar imagens */}
      {modalAberto && imagemSelecionada && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem"
          }}
          onClick={() => setModalAberto(false)}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "90vh",
              backgroundColor: "white",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão fechar */}
            <button
              onClick={() => setModalAberto(false)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10000,
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = "rgba(0, 0, 0, 0.75)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = "rgba(0, 0, 0, 0.5)";
              }}
            >
              <XIcon size={24} weight="bold" />
            </button>

            {/* Conteúdo da imagem */}
            <img
              src={imagemSelecionada.urlArquivo}
              alt={imagemSelecionada.nomeArquivo}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                maxHeight: "90vh"
              }}
            />

            {/* Informações do arquivo */}
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#f8fafc",
                borderTop: "1px solid #e2e8f0"
              }}
            >
              <p style={{ margin: 0, fontWeight: 600, color: "#1e293b" }}>
                {imagemSelecionada.nomeArquivo}
              </p>
              {imagemSelecionada.descricao && (
                <p style={{ margin: "0.5rem 0 0 0", color: "#64748b", fontSize: "0.9rem" }}>
                  {imagemSelecionada.descricao}
                </p>
              )}
              <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem" }}>
                <a
                  href={imagemSelecionada.urlArquivo}
                  download={imagemSelecionada.nomeArquivo}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#0ea5e9",
                    color: "white",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "none",
                    transition: "background-color 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = "#0284c7";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = "#0ea5e9";
                  }}
                >
                  Baixar
                </a>
                <a
                  href={imagemSelecionada.urlArquivo}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#6366f1",
                    color: "white",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "none",
                    transition: "background-color 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = "#4f46e5";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = "#6366f1";
                  }}
                >
                  Abrir em nova aba
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </ContainerPainel>
  );
}