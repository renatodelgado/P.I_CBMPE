/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  PersonCard,
  PersonCardHeader,
} from "../../../components/EstilosPainel.styles";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { Button } from "../../../components/Button";
import { EyeIcon, FileTextIcon, UserIcon, FireTruckIcon, PaperclipIcon, PencilIcon } from "@phosphor-icons/react";
import api from "../../../services/api";
import { formatarDataHora, getStatusColor,} from "../../../utils/ocorrencias.ts";
import { LocalizacaoView } from "../sections/LocalizacaoView.tsx";



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
  motivoNaoAtendimento: string;
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
  const [ocorrencia, setOcorrencia] = useState<OcorrenciaDetalhes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vitimas, setVitimas] = useState<PessoaDetalhes[]>([])

  const uri = api.getUri();

  useEffect(() => {
    async function fetchOcorrenciaDetalhes() {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`Buscando ocorrência ID: ${id} de: ${uri}/ocorrencias/${id}`);
        
        const response = await fetch(`${uri}/ocorrencias/${id}`);
        
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Dados recebidos:', data);

        fetchVitimaDaOcorrencia(data.id);
        
        setOcorrencia(data);
      } catch (err) {
        console.error('Erro ao buscar detalhes da ocorrência:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    async function fetchVitimaDaOcorrencia(ocorrenciaId: string) {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${uri}/vitimas/ocorrencia/${ocorrenciaId}`);

            const data = await response.json();

            console.log("vitimas ", data);

            setVitimas(data)
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    if (id) {
      fetchOcorrenciaDetalhes();
    }
  }, [id, uri]);

  const handleEditar = () => {
    navigate(`/ocorrencias/editar/${id}`);
  };

  const handleVoltar = () => {
    navigate("/ocorrencias");
  };

  const handleImprimir = () => {
    window.print();
  };

  const handleDownloadAnexo = async (anexo: AnexoDetalhes) => {
    try {
      const response = await fetch(anexo.urlArquivo);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = anexo.nomeArquivo || `anexo-${anexo.id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao baixar anexo:', err);
      alert('Erro ao baixar o arquivo');
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

  // Função para mapear status 
  const mapStatusToDisplay = (status: string) => {
    switch (status) {
      case "pendente": return "Pendente";
      case "em_andamento": return "Em andamento";
      case "concluida": return "Concluída";
      case "nao_atendido": return "Não Atendido";
      default: return status;
    }
  };

  // Função para mapear forma de acionamento 
  const mapFormaAcionamentoToDisplay = (forma: string) => {
    switch (forma?.toLowerCase()) {
      case "telefone": return "Telefone";
      case "aplicativo": return "Aplicativo";
      case "pessoalmente": return "Pessoalmente";
      default: return forma || "Telefone";
    }
  };

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
                  value={mapStatusToDisplay(ocorrencia.statusAtendimento)} 
                  readOnly 
                  style={{
                    color: getStatusColor(ocorrencia.statusAtendimento),
                    fontWeight: 600
                  }}
                />
              </Field>

              {ocorrencia.statusAtendimento === "nao_atendido" && (
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

      
      <ResponsiveRow>
        <GridColumn weight={1}>
          <BoxInfo>
            <SectionTitle><FireTruckIcon size={22} weight="fill" /> Equipes e Viaturas</SectionTitle>
            <Grid>
              <Field>
                <label className="required">Unidade Operacional</label>
                <input 
                  type="text" 
                  value={ocorrencia.unidadeOperacional?.nome || "Não informada"} 
                  readOnly 
                />
              </Field>

              <Field>
                <label className="required">Número da Viatura</label>
                <input 
                  type="text" 
                  value={
                    ocorrencia.viatura 
                      ? `${ocorrencia.viatura.tipo} - ${ocorrencia.viatura.numero}${ocorrencia.viatura.placa ? ` (${ocorrencia.viatura.placa})` : ''}`
                      : "Não informada"
                  } 
                  readOnly 
                />
              </Field>
            </Grid>
          </BoxInfo>
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
            
            {/* Fotos e Arquivos */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h4 style={{ marginBottom: "0.5rem", color: "#444" }}>Fotos e Arquivos</h4>
              
              {ocorrencia.anexos && ocorrencia.anexos.filter(a => a.tipoArquivo !== "assinatura").length > 0 ? (
                <PreviewList>
                  {ocorrencia.anexos
                    .filter(anexo => anexo.tipoArquivo !== "assinatura")
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
                        text={<EyeIcon size={16} />}
                        onClick={() => handleDownloadAnexo(anexo)}
                        variant="primary"
                        style={{ padding: "6px 12px" }}
                      />
                    </div>
                  ))}
                </PreviewList>
              ) : (
                <div style={{ color: "#64748b", fontStyle: "italic", padding: "1rem", textAlign: "center" }}>
                  Nenhum arquivo anexado
                </div>
              )}
            </div>

            {/* Assinatura do Responsável */}
            <div>
              <h4 style={{ marginBottom: "0.5rem", color: "#444" }}>Assinatura do Responsável</h4>
              <SignatureBox>
                {ocorrencia.anexos && ocorrencia.anexos.find(a => a.tipoArquivo === "assinatura") ? (
                  <div style={{ textAlign: "center", padding: "1rem" }}>
                    <p>✅ Assinatura digital registrada</p>
                    <a 
                      href={ocorrencia.anexos.find(a => a.tipoArquivo === "assinatura")?.urlArquivo} 
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

      
      <ResponsiveRow>
        <GridColumn weight={1}>
          <BoxInfo>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <Button 
                text="Voltar para Lista" 
                onClick={handleVoltar} 
                variant="secondary" 
              />
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
              <Button 
                text="Imprimir/PDF" 
                onClick={handleImprimir} 
                variant="primary" 
              />
            </div>
          </BoxInfo>
        </GridColumn>
      </ResponsiveRow>
    </ContainerPainel>
  );
}