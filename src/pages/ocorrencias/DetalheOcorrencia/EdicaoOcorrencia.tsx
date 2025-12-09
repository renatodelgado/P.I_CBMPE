/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
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
  UploadArea,
} from "../../../components/EstilosPainel.styles";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { Button } from "../../../components/Button";
import { FileTextIcon, FireTruckIcon, PaperclipIcon } from "@phosphor-icons/react";
import api from "../../../services/api";
import { Localizacao } from "../sections/Localizacao";
import { type Municipio } from "../../../services/municipio_bairro";
import { VitimasPessoas } from "../sections/VitimasPessoas";

interface PessoaEdicao {
  id: number;
  nome: string;
  cpf: string;
  idade?: number;
  sexo?: string;
  etnia?: string;
  tipoAtendimento: string;
  observacoes: string;
  condicao: string;
  destinoVitima?: string;
  condicaoVitima?: number;
}

interface AnexoEdicao {
  id: number;
  tipoArquivo: string;
  urlArquivo: string;
  nomeArquivo: string;
  extensaoArquivo: string;
  descricao: string;
}

interface NaturezaOcorrencia {
  id: number;
  nome: string;
  sigla: string;
  pontoBase: string;
}

interface GrupoOcorrencia {
  id: number;
  nome: string;
  naturezaOcorrencia: any;
}

interface SubgrupoOcorrencia {
  id: number;
  nome: string;
  grupoOcorrencia: any;
}

interface Lesao {
  id: number;
  tipoLesao: string;
}

interface Viatura {
  id: number;
  tipo: string;
  numero: string;
  placa?: string;
}

interface UnidadeOperacional {
  id: number;
  nome: string;
  sigla: string;
  pontoBase: string;
}

export function EditarOcorrencia() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
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
  
  // Pessoas
  const [pessoas, setPessoas] = useState<PessoaEdicao[]>([]);
  
  // Anexos
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [existingAnexos, setExistingAnexos] = useState<AnexoEdicao[]>([]);
  const [] = useState<string | undefined>(undefined);
  
  // Estados para combos
  const [naturezasOcorrencias, setNaturezasOcorrencias] = useState<NaturezaOcorrencia[]>([]);
  const [gruposOcorrencias, setGruposOcorrencias] = useState<GrupoOcorrencia[]>([]);
  const [subgruposOcorrencias, setSubgruposOcorrencias] = useState<SubgrupoOcorrencia[]>([]);
  const [, setCondicoesVitima] = useState<Lesao[]>([]);
  const [viaturas, setViaturas] = useState<Viatura[]>([]);
  const [unidadesOperacionais, setUnidadesOperacionais] = useState<UnidadeOperacional[]>([]);

  const uri = api.getUri();

  // Função para buscar vítimas da ocorrência
  async function fetchVitimaDaOcorrencia(ocorrenciaId: string) {
    try {
      setLoading(true);
      
      const response = await fetch(`${uri}/vitimas/ocorrencia/${ocorrenciaId}`);
      const data = await response.json();

      console.log("vitimas da ocorrência ", data);

      // Formatando as vítimas para o formato esperado pelo componente
      const pessoasFormatadas = data.map((vitima: any) => ({
        id: vitima.id,
        nome: vitima.nome || "",
        cpf: vitima.cpfVitima || "",
        idade: vitima.idade,
        sexo: vitima.sexo,
        etnia: vitima.etnia,
        tipoAtendimento: vitima.tipoAtendimento || "",
        observacoes: vitima.observacoes || "",
        condicao: vitima.lesao?.id?.toString() || "",
        destinoVitima: vitima.destinoVitima || "",
        condicaoVitima: vitima.lesao?.id || undefined
      }));
      
      setPessoas(pessoasFormatadas);
    } catch (err) {
      console.log("Erro ao buscar vítimas:", err);
    } finally {
      setLoading(false);
    }
  }

  // Carregar dados da ocorrência
  useEffect(() => {
    async function fetchOcorrencia() {
      try {
        setLoading(true);
        const response = await fetch(`${uri}/ocorrencias/${id}`);
        if (!response.ok) throw new Error('Erro ao carregar ocorrência');
        
        const data = await response.json();
        
        // Preencher os campos do formulário com os dados existentes
        setNumeroOcorrencia(data.numeroOcorrencia || "");
        setDataChamado(data.dataHoraChamada ? new Date(data.dataHoraChamada).toISOString().slice(0, 16) : "");
        setStatusAtendimento(mapStatusFromBackend(data.statusAtendimento));
        setMotivoNaoAtendimento(data.motivoNaoAtendimento || "");
        setDescricao(data.descricao || "");
        setNatureza(data.naturezaOcorrencia?.id?.toString() || "");
        setGrupo(data.grupoOcorrencia?.id?.toString() || "");
        setSubgrupo(data.subgrupoOcorrencia?.id?.toString() || "");
        setFormaAcionamento(mapFormaAcionamentoFromBackend(data.formaAcionamento));
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
        setExistingAnexos(data.anexos || []);
        
        // Buscar vítimas da ocorrência separadamente
        fetchVitimaDaOcorrencia(data.id);
        
      } catch (error) {
        console.error('Erro ao carregar ocorrência:', error);
        alert('Erro ao carregar ocorrência para edição');
      } finally {
        setLoading(false);
      }
    }

    // Carregar combos
    async function fetchCombos() {
      try {
        const [naturezasRes, gruposRes, subgruposRes, lesoesRes, viaturasRes, unidadesRes] = await Promise.all([
          fetch(`${uri}/naturezasocorrencias`),
          fetch(`${uri}/gruposocorrencias`),
          fetch(`${uri}/subgruposocorrencias`),
          fetch(`${uri}/lesoes`),
          fetch(`${uri}/viaturas`),
          fetch(`${uri}/unidadesoperacionais`)
        ]);

        if (naturezasRes.ok) setNaturezasOcorrencias(await naturezasRes.json());
        if (gruposRes.ok) setGruposOcorrencias(await gruposRes.json());
        if (subgruposRes.ok) setSubgruposOcorrencias(await subgruposRes.json());
        if (lesoesRes.ok) setCondicoesVitima(await lesoesRes.json());
        if (viaturasRes.ok) setViaturas(await viaturasRes.json());
        if (unidadesRes.ok) setUnidadesOperacionais(await unidadesRes.json());
      } catch (error) {
        console.error('Erro ao carregar combos:', error);
      }
    }

    if (id) {
      fetchOcorrencia();
      fetchCombos();
    }
  }, [id, uri]);

  // Funções de mapeamento
  const mapStatusFromBackend = (status: string) => {
    switch (status) {
      case "pendente": return "Pendente";
      case "em_andamento": return "Em andamento";
      case "concluida": return "Concluída";
      case "nao_atendido": return "Não Atendido";
      default: return "Pendente";
    }
  };

  const mapStatusToBackend = (status: string) => {
    switch (status) {
      case "Pendente": return "pendente";
      case "Em andamento": return "em_andamento";
      case "Concluída": return "concluida";
      case "Não Atendido": return "nao_atendido";
      default: return "pendente";
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

  // Funções para pessoas
  const addPessoa = () => {
    setPessoas(prev => [
      ...prev,
      {
        id: Date.now(),
        nome: "",
        cpf: "",
        idade: undefined,
        sexo: "",
        etnia: "",
        tipoAtendimento: "",
        observacoes: "",
        condicao: "",
        destinoVitima: ""
      }
    ]);
  };

  const updatePessoa = (id: number, patch: Partial<PessoaEdicao>) => {
    setPessoas(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p));
  };

  const removePessoa = (id: number) => {
    setPessoas(prev => prev.filter(p => p.id !== id));
  };

  // Funções para arquivos
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeAnexoExistente = (anexoId: number) => {
    setExistingAnexos(prev => prev.filter(a => a.id !== anexoId));
  };

  const removeAnexoNovo = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Submit do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        numeroOcorrencia,
        dataHoraChamada: dataChamado ? new Date(dataChamado).toISOString() : new Date().toISOString(),
        statusAtendimento: mapStatusToBackend(statusAtendimento),
        motivoNaoAtendimento: motivoNaoAtendimento || "N/A",
        descricao: descricao || "",
        formaAcionamento: mapFormaAcionamentoToBackend(formaAcionamento),
        naturezaOcorrenciaId: natureza ? Number(natureza) : undefined,
        grupoOcorrenciaId: grupo ? Number(grupo) : undefined,
        subgrupoOcorrenciaId: subgrupo ? Number(subgrupo) : undefined,
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
      };

      const response = await fetch(`${uri}/ocorrencias/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Erro ao atualizar ocorrência');

      alert('Ocorrência atualizada com sucesso!');
      navigate(`/ocorrencias/${id}`);
      
    } catch (error) {
      console.error('Erro ao salvar ocorrência:', error);
      alert('Erro ao atualizar ocorrência');
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
              onClick: () => navigate(`/ocorrencias/${id}`)
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
                      if (e.target.value !== "Não Atendido") setMotivoNaoAtendimento("");
                    }}
                  >
                    <option>Pendente</option>
                    <option>Em andamento</option>
                    <option>Concluída</option>
                    <option>Não Atendido</option>
                  </select>
                </Field>

                {statusAtendimento === "Não Atendido" && (
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
                    onChange={(e) => setNatureza(e.target.value)}
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
                    onChange={(e) => setGrupo(e.target.value)}
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
                    required
                  >
                    <option value="">Selecione o subgrupo</option>
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
              setSelectedMunicipioId={(value) => {
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
            <BoxInfo>
              <SectionTitle><FireTruckIcon size={22} weight="fill" /> Equipes e Viaturas</SectionTitle>
              <Grid>
                <Field>
                  <label className="required">Unidade Operacional</label>
                  <select 
                    value={unidade} 
                    onChange={(e) => setUnidade(e.target.value)}
                    required
                  >
                    <option value="">Selecione a unidade</option>
                    {unidadesOperacionais.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nome} ({u.pontoBase})
                      </option>
                    ))}
                  </select>
                </Field>

                <Field>
                  <label className="required">Número da Viatura</label>
                  <select 
                    value={numeracaoViatura} 
                    onChange={(e) => setNumeracaoViatura(e.target.value)}
                    required
                  >
                    <option value="">Selecione a numeração da viatura</option>
                    {viaturas.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.tipo} - {v.numero}
                      </option>
                    ))}
                  </select>
                </Field>
              </Grid>
            </BoxInfo>
          </GridColumn>
        </ResponsiveRow>

        {/* Vítimas e Pessoas Envolvidas */}
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
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
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