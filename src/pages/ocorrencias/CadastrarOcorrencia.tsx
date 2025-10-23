/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClipboardTextIcon, FileTextIcon, FireTruckIcon, GearIcon, MapPinIcon, PaperclipIcon, UserIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { BoxInfo, SectionTitle, Grid, Field, FullField, ContainerPainel, GridColumn, ResponsiveRow, PageSubtitle, PageTitle, PageTopHeader, RequiredNotice, TeamSearchWrapper, TeamSearchInput, TeamResults, TeamBox, TeamChip, MapFullBox, MapPlaceholder, PersonCard, PersonCardHeader, PersonRemoveButton, UploadArea, Divider, PreviewList, SectionSubtitle, SignatureActions, SignatureBox, ModalContent, ModalOverlay, StatusAlert } from "../../components/EstilosPainel.styles";
import { Breadcrumb } from "../../components/Breadcrumb";
import { useEffect, useRef, useState } from "react";
import { fetchBairrosFromOSM, fetchMunicipiosPE, type Municipio } from "../../services/municipio_bairro";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "../../components/Button";
import { useOnlineStatus } from "../../utils/useOnlineStatus";

export function NovaOcorrencia() {
  const isOnline = useOnlineStatus();
  const CACHE_KEY = "ocorrencias_offline";

  // Função para formatar a data atual no formato datetime-local
  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const adjusted = new Date(now.getTime() - offset * 60 * 1000);
    return adjusted.toISOString().slice(0, 16); // Formato YYYY-MM-DDThh:mm
  };

  function saveOffline(ocorrencia: any) {
    const timestamped = {
      ...ocorrencia,
      savedAt: new Date().toISOString(),
    };

    try {
      const existing = localStorage.getItem(CACHE_KEY);
      const list = existing ? JSON.parse(existing) : [];
      list.push(timestamped);
      localStorage.setItem(CACHE_KEY, JSON.stringify(list));
      console.debug("Ocorrência salva no localStorage:", timestamped);
      return timestamped;
    } catch (err) {
      console.error("Erro ao salvar no localStorage:", err);
      try {
        const existing = sessionStorage.getItem(CACHE_KEY);
        const list = existing ? JSON.parse(existing) : [];
        list.push(timestamped);
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(list));
        console.debug("Ocorrência salva no sessionStorage (fallback):", timestamped);
        return timestamped;
      } catch (err2) {
        console.error("Falha também no sessionStorage:", err2);
        alert("Não foi possível salvar localmente. Verifique as permissões do navegador.");
        return null;
      }
    }
  }

  function getOfflineOccurrences() {
    try {
      const existing = localStorage.getItem(CACHE_KEY);
      return existing ? JSON.parse(existing) : [];
    } catch (err) {
      console.error("Erro ao ler localStorage, tentando sessionStorage:", err);
      try {
        const existing = sessionStorage.getItem(CACHE_KEY);
        return existing ? JSON.parse(existing) : [];
      } catch (err2) {
        console.error("Falha ao ler sessionStorage:", err2);
        return [];
      }
    }
  }

  const [offlineOccurrences, setOfflineOccurrences] = useState<any[]>([]);
  const [tipoOcorrencia, setTipoOcorrencia] = useState("Incêndio");
  const [dataChamado, setDataChamado] = useState(getCurrentDateTime());
  const [statusInicial, setStatusInicial] = useState("Pendente");
  const [descricaoResumida, setDescricaoResumida] = useState("");
  const [unidadeResponsavel, setUnidadeResponsavel] = useState("");
  const [pontoBase, setPontoBase] = useState("");
  const [viaturaUtilizada, setViaturaUtilizada] = useState("");
  const [numeracaoViatura, setNumeracaoViatura] = useState("");
  const [tempoResposta, setTempoResposta] = useState("");
  const [observacoesAdicionais, setObservacoesAdicionais] = useState("");
  const [complemento, setComplemento] = useState("");
  const [referencia, setReferencia] = useState("");
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [selectedMunicipioId, setSelectedMunicipioId] = useState<number | "">("");
  const [selectedMunicipioNome, setSelectedMunicipioNome] = useState("");
  const [forceManualLocationInput, setForceManualLocationInput] = useState(false);
  const [bairros, setBairros] = useState<string[]>([]);
  const [bairro, setBairro] = useState("");
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isLoadingOffline, setIsLoadingOffline] = useState(false);
  const [users] = useState<string[]>([
    "Cabo Silva",
    "Sargento Souza",
    "Tenente Costa",
    "Capitão Lima",
    "Soldado Araújo",
    "Soldada Araújo",
    "Major Fernandes",
  ]);
  const [chefe, setChefe] = useState("");
  const [lider, setLider] = useState("");
  const [team, setTeam] = useState<string[]>([]);
  const [teamQuery, setTeamQuery] = useState("");
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [modalCanvasRef, setModalCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [isModalDrawing, setIsModalDrawing] = useState(false);

  type Pessoa = {
    id: number;
    nome: string;
    idade: string;
    documento: string;
    condicao: string;
  };

  useEffect(() => {
    if (isOnline) {
      const offlineData = getOfflineOccurrences();
      if (offlineData.length > 0) {
        offlineData.forEach(async (ocorrencia: any) => {
          try {
            await fakeSendToServer(ocorrencia);
          } catch (err) {
            console.error("Erro ao enviar ocorrência offline:", err);
          }
        });
      }
    }
  }, [isOnline]);

  async function fakeSendToServer(data: any) {
    console.log("Enviando para o servidor:", data);
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const handleAddToTeam = (name: string) => {
    if (!name) return;
    setTeam((t) => (t.includes(name) ? t : [...t, name]));
    setTeamQuery("");
  };

  const handleRemoveFromTeam = (name: string) => {
    setTeam((t) => t.filter((x) => x !== name));
  };

  const filteredUsers = users.filter(
    (u) => u.toLowerCase().includes(teamQuery.toLowerCase()) && !team.includes(u)
  );

  if ("Marker" in L && !(L as any)._copilot_icon_set) {
    const DefaultIcon = L.icon({
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    (L as any).Marker.prototype.options.icon = DefaultIcon;
    (L as any)._copilot_icon_set = true;
  }

  useEffect(() => {
    fetchMunicipiosPE()
      .then(setMunicipios)
      .catch((err) => console.error("Erro ao buscar municípios IBGE:", err));
  }, []);

  useEffect(() => {
    if (!selectedMunicipioId) {
      setBairros([]);
      return;
    }
    fetchBairrosFromOSM(String(municipios.find((m) => m.id === selectedMunicipioId)?.nome))
      .then(setBairros)
      .catch((err) => {
        console.error("Erro ao buscar distritos IBGE:", err);
        setBairros([]);
      });
  }, [municipios, selectedMunicipioId]);

  const requiredLocationFilled =
    Boolean(selectedMunicipioId) &&
    bairro.trim() !== "" &&
    logradouro.trim() !== "" &&
    numero.trim() !== "";

  useEffect(() => {
    async function geocodeAddress() {
      if (!requiredLocationFilled || isLoadingOffline) return;
      const municipioNome = municipios.find((m) => m.id === selectedMunicipioId)?.nome || "";
      const q = `${logradouro}, ${numero}, ${bairro}, ${municipioNome}, Pernambuco, Brazil`;
      setIsGeocoding(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`
        );
        if (!res.ok) throw new Error(`Nominatim error: ${res.status}`);
        const json = (await res.json()) as Array<{ lat: string; lon: string }>;
        if (Array.isArray(json) && json.length > 0) {
          setLatitude(json[0].lat);
          setLongitude(json[0].lon);
        } else {
          console.warn("Geocoding sem resultado para:", q);
        }
      } catch (err) {
        console.error("Erro no geocoding:", err);
      } finally {
        setIsGeocoding(false);
      }
    }
    geocodeAddress();
  }, [requiredLocationFilled, selectedMunicipioId, bairro, logradouro, numero, municipios, isLoadingOffline]);

  const addPessoa = () => {
    setPessoas((prev) => [
      ...prev,
      { id: Date.now() + Math.floor(Math.random() * 1000), nome: "", idade: "", documento: "", condicao: "Ileso" },
    ]);
  };

  const updatePessoa = (id: number, patch: Partial<Pessoa>) => {
    setPessoas((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const removePessoa = (id: number) => {
    setPessoas((prev) => (prev.length > 0 ? prev.filter((p) => p.id !== id) : prev));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    setUploadedFiles([...uploadedFiles, ...Array.from(files)]);
  };

  const startDrawing = (e: any) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setIsDrawing(true);
    const { x, y } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCoordinates(e, canvas);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const getCoordinates = (e: any, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const dataURL = canvas.toDataURL("image/png");
    console.log("Assinatura capturada em base64:", dataURL);
    alert("Assinatura salva (base64 gerada no console).");
  };

  const startModalDrawing = (e: any) => {
    if (!modalCanvasRef) return;
    const ctx = modalCanvasRef.getContext("2d");
    if (!ctx) return;
    setIsModalDrawing(true);
    const { x, y } = getCoordinates(e, modalCanvasRef);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const drawModal = (e: any) => {
    if (!isModalDrawing || !modalCanvasRef) return;
    const ctx = modalCanvasRef.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCoordinates(e, modalCanvasRef);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const endModalDrawing = () => setIsModalDrawing(false);

  const clearModalSignature = () => {
    if (!modalCanvasRef) return;
    const ctx = modalCanvasRef.getContext("2d");
    ctx?.clearRect(0, 0, modalCanvasRef.width, modalCanvasRef.height);
  };

  const saveModalSignature = () => {
    if (!modalCanvasRef) return;
    const dataURL = modalCanvasRef.toDataURL("image/png");
    console.log("Assinatura do modal:", dataURL);
    setSignatureModalOpen(false);
    alert("Assinatura salva do modal (base64 no console).");
  };

  function loadOfflineOccurrences() {
    const cached = getOfflineOccurrences();
    setOfflineOccurrences(cached);

    if (cached.length > 0) {
      const last = cached[cached.length - 1];
      console.debug("Recuperando ocorrência offline:", last);

      setIsLoadingOffline(true);

      setDataChamado(last.dataChamado || getCurrentDateTime());
      setTipoOcorrencia(last.tipoOcorrencia || "Incêndio");
      setStatusInicial(last.statusInicial || "Pendente");
      setDescricaoResumida(last.descricaoResumida || "");
      setUnidadeResponsavel(last.unidadeResponsavel || "");
      setChefe(last.chefe || "");
      setLider(last.lider || "");
      setPontoBase(last.pontoBase || "");
      setViaturaUtilizada(last.viaturaUtilizada || "");
      setNumeracaoViatura(last.numeracaoViatura || "");
      setTempoResposta(last.tempoResposta || "");
      setObservacoesAdicionais(last.observacoesAdicionais || "");
      setComplemento(last.complemento || "");
      setReferencia(last.referencia || "");

      const muniId = last.municipioId !== undefined && last.municipioId !== null && last.municipioId !== "" ? Number(last.municipioId) : "";
      setSelectedMunicipioId(Number.isNaN(muniId) ? "" : muniId);
      setSelectedMunicipioNome(last.municipioNome || "");
      setBairro(last.bairro || "");
      setLogradouro(last.logradouro || "");
      setNumero(last.numero || "");
      setLatitude(last.latitude || "");
      setLongitude(last.longitude || "");

      const equipe = Array.isArray(last.equipe) ? last.equipe : (last.equipe ? [String(last.equipe)] : []);
      setTeam(equipe);

      const rawPessoas = Array.isArray(last.pessoas) ? last.pessoas : [];
      const normalizedPessoas = rawPessoas.map((p: any, idx: number) => ({
        id: p?.id ?? Date.now() + idx,
        nome: p?.nome ?? "",
        idade: p?.idade ?? "",
        documento: p?.documento ?? "",
        condicao: p?.condicao ?? "Ileso",
      }));
      setPessoas(normalizedPessoas);

      const arquivoNomes = Array.isArray(last.arquivos) ? last.arquivos : [];
      const files = arquivoNomes.map((name: string) => new File([new Uint8Array()], name));
      setUploadedFiles(files);

      setTimeout(() => setIsLoadingOffline(false), 0);
    }
  }

  useEffect(() => {
    loadOfflineOccurrences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocalização não suportada pelo navegador.");
      alert("Geolocalização não suportada. Preencha os dados manualmente.");
      setForceManualLocationInput(true);
      return;
    }

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 60000,
      maximumAge: 0,
    };

    const fallbackGeoOptions = {
      maximumAge: 0,
      timeout: 10000,
      enableHighAccuracy: false,
    };

    console.debug("Iniciando obtenção de localização (alta precisão)...");
    setIsGeocoding(true);
    setLatitude("");
    setLongitude("");
    setLogradouro("");
    setNumero("");
    setBairro("");
    setSelectedMunicipioId("");
    setSelectedMunicipioNome("");
    setForceManualLocationInput(false);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handlePosition(pos);
      },
      (err) => {
        console.warn(`Erro na geolocalização de alta precisão: ${err.message} (código: ${err.code})`);
        if (err.code === err.TIMEOUT) {
          console.debug("Tentando fallback com baixa precisão...");
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              handlePosition(pos);
            },
            (err) => {
              console.error(`Erro no fallback: ${err.message} (código: ${err.code})`);
              setIsGeocoding(false);
              setForceManualLocationInput(true);
              let errorMessage = "Não foi possível obter a localização: ";
              switch (err.code) {
                case err.PERMISSION_DENIED:
                  errorMessage += "Permissão de geolocalização negada.";
                  break;
                case err.POSITION_UNAVAILABLE:
                  errorMessage += "Localização indisponível.";
                  break;
                case err.TIMEOUT:
                  errorMessage += "Tempo limite atingido.";
                  break;
                default:
                  errorMessage += err.message;
              }
              alert(errorMessage + " Preencha os dados manualmente.");
            },
            fallbackGeoOptions
          );
        } else {
          setIsGeocoding(false);
          setForceManualLocationInput(true);
          alert(`Erro: ${err.message}. Preencha os dados manualmente.`);
        }
      },
      geoOptions
    );

    const handlePosition = (pos: GeolocationPosition) => {
      const lat = pos.coords.latitude.toFixed(6);
      const lon = pos.coords.longitude.toFixed(6);
      setLatitude(lat);
      setLongitude(lon);
      console.debug(`Coordenadas obtidas: lat=${lat}, lon=${lon}, precisão=${pos.coords.accuracy}m`);

      if (isOnline) {
        console.debug("Online: realizando reverse geocoding...");
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
          { headers: { 'User-Agent': 'NovaOcorrenciaApp/1.0' } }
        )
          .then((res) => {
            if (!res.ok) throw new Error(`Erro na API Nominatim: ${res.status}`);
            return res.json();
          })
          .then((data) => {
            console.debug("Resposta do reverse geocoding:", data);
            const addr = data.address || {};
            setLogradouro(addr.road || "");
            setNumero(addr.house_number || "");
            setBairro(addr.suburb || addr.neighbourhood || addr.village || "");
            const munNome = addr.city || addr.town || addr.village || "";
            const mun = municipios.find(
              (m) => m.nome.toLowerCase() === munNome.toLowerCase()
            );
            if (mun) {
              setSelectedMunicipioId(mun.id);
              setSelectedMunicipioNome(mun.nome);
              console.debug(`Município encontrado: ${mun.nome}`);
            } else {
              console.warn(`Município não encontrado: ${munNome}`);
              setSelectedMunicipioId("");
              setSelectedMunicipioNome(munNome);
              setForceManualLocationInput(true);
              alert("Município não encontrado. Preencha manualmente.");
            }
          })
          .catch((err) => {
            console.error("Erro no reverse geocoding:", err);
            setForceManualLocationInput(true);
            alert("Erro ao obter endereço. Preencha manualmente.");
          })
          .finally(() => {
            setIsGeocoding(false);
          });
      } else {
        console.debug("Offline: salvando apenas coordenadas.");
        setForceManualLocationInput(true);
        setLogradouro("");
        setNumero("");
        setBairro("");
        setSelectedMunicipioId("");
        setSelectedMunicipioNome("");
        setIsGeocoding(false);
        alert("Modo offline: apenas coordenadas salvas. Preencha manualmente.");
      }
    };
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

        {offlineOccurrences.length > 0 && (
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
                      A conexão foi restabelecida. Você pode agora salvar a ocorrência no banco de dados.
                    </span>
                  </div>
                ) : (
                  <div className="message">
                    <WarningCircleIcon size={22} />
                    <span>
                      Registro de ocorrência salvo localmente. Assim que a conexão voltar, será possível
                      enviar os dados para o banco de dados.
                    </span>
                  </div>
                )}
              </StatusAlert>
            </GridColumn>
          </ResponsiveRow>
        )}


        <PageTitle>Cadastrar Ocorrência</PageTitle>
        <PageSubtitle>Preencha as informações abaixo para registrar a ocorrência.</PageSubtitle>
        <RequiredNotice><span>*</span>Campos obrigatórios</RequiredNotice>
      </PageTopHeader>

      <ResponsiveRow>
        <GridColumn weight={1}>
          <BoxInfo>
            <SectionTitle><FileTextIcon size={22} weight="fill" />Dados Principais</SectionTitle>
            <Grid>
              <Field>
                <label className="required">Tipo de Ocorrência</label>
                <select value={tipoOcorrencia} onChange={(e) => setTipoOcorrencia(e.target.value)}>
                  <option>Incêndio</option>
                  <option>Resgate</option>
                  <option>Atendimento Pré-Hospitalar</option>
                  <option>Outro</option>
                </select>
              </Field>
              <Field>
                <label className="required">Data/Hora do Chamado</label>
                <input
                  type="datetime-local"
                  value={dataChamado}
                  readOnly
                />
              </Field>
              <Field>
                <label>Status Inicial</label>
                <select value={statusInicial} onChange={(e) => setStatusInicial(e.target.value)}>
                  <option>Pendente</option>
                  <option>Em andamento</option>
                  <option>Concluída</option>
                </select>
              </Field>
              <FullField>
                <label>Descrição Resumida</label>
                <textarea
                  placeholder="Ex: Incêndio em veículo na Av. Norte, vítima consciente."
                  value={descricaoResumida}
                  onChange={(e) => setDescricaoResumida(e.target.value)}
                />
              </FullField>
            </Grid>
          </BoxInfo>
        </GridColumn>
      </ResponsiveRow>

      <ResponsiveRow>
        <GridColumn weight={1}>
          <BoxInfo>
            <SectionTitle><MapPinIcon size={22} weight="fill" /> Localização</SectionTitle>
            <Grid>
              <Field>
                <label className="required">Município</label>
                {municipios.length > 0 && !forceManualLocationInput ? (
                  <select
                    value={selectedMunicipioId}
                    onChange={(e) => {
                      const id = e.target.value ? Number(e.target.value) : "";
                      setSelectedMunicipioId(id);
                      const nome = municipios.find(m => m.id === id)?.nome || "";
                      setSelectedMunicipioNome(nome);
                    }}
                  >
                    <option value="">Selecione o município (PE)</option>
                    {municipios.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nome}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    placeholder="Informe o município"
                    value={selectedMunicipioNome}
                    onChange={(e) => setSelectedMunicipioNome(e.target.value)}
                  />
                )}
              </Field>
              <Field>
                <label className="required">Bairro</label>
                {bairros.length > 0 && !forceManualLocationInput ? (
                  <select value={bairro} onChange={(e) => setBairro(e.target.value)}>
                    <option value="">Selecione o bairro</option>
                    {bairros.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input placeholder="Informe o bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} />
                )}
              </Field>
              <Field>
                <label className="required">Logradouro</label>
                <input placeholder="Ex: Av. Norte" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} />
              </Field>
              <Field>
                <label className="required">Número</label>
                <input placeholder="Ex: 458" value={numero} onChange={(e) => setNumero(e.target.value)} />
              </Field>
              <Field>
                <label>Complemento</label>
                <input placeholder="Ex: apt 101" value={complemento} onChange={(e) => setComplemento(e.target.value)} />
              </Field>
              <Field>
                <label>Referência</label>
                <input
                  placeholder="Ex: Em frente ao Hospital Agamenon Magalhães"
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                />
              </Field>
              <Field>
                <label>Latitude</label>
                <input
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder=""
                  readOnly
                />
              </Field>
              <Field>
                <label>Longitude</label>
                <input
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder=""
                  readOnly
                />
              </Field>
              <Field>
                <label>Localização automática</label>
                <Button
                  text={<><MapPinIcon size={16} style={{ marginRight: 8 }} />Usar Localização</>}
                  onClick={() => {
                    if (!isGeocoding) handleUseLocation();
                  }}
                  style={{ opacity: isGeocoding ? 0.6 : 1, pointerEvents: isGeocoding ? "none" : "auto" }}
                />
              </Field>
            </Grid>
            <Grid>
              <Field>
                <br />
                <MapFullBox>
                  {latitude && longitude ? (
                    <MapContainer
                      center={[Number(latitude), Number(longitude)]}
                      zoom={17}
                      style={{ height: "100%", width: "100%" }}
                      scrollWheelZoom
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[Number(latitude), Number(longitude)]} />
                    </MapContainer>
                  ) : (
                    <MapPlaceholder>
                      Use o botão “Usar Localização” ou preencha os campos obrigatórios
                    </MapPlaceholder>
                  )}
                </MapFullBox>
              </Field>
            </Grid>
          </BoxInfo>
        </GridColumn>
      </ResponsiveRow>

      <ResponsiveRow>
        <GridColumn weight={1}>
          <BoxInfo>
            <SectionTitle><FireTruckIcon size={22} weight="fill" /> Equipes e Viaturas</SectionTitle>
            <Grid>
              <Field>
                <label>Unidade Responsável</label>
                <select value={unidadeResponsavel} onChange={(e) => setUnidadeResponsavel(e.target.value)}>
                  <option value="">Selecione a unidade</option>
                  <option>1º GBM - Recife</option>
                  <option>2º GBM - Olinda</option>
                  <option>3º GBM - Caruaru</option>
                  <option>4º GBM - Petrolina</option>
                  <option>5º GBM - Garanhuns</option>
                </select>
              </Field>
              <Field>
                <label>Chefe de Ocorrência</label>
                <select value={chefe} onChange={(e) => setChefe(e.target.value)}>
                  <option value="">Escolha o chefe de ocorrência</option>
                  {users.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </Field>
              <Field>
                <label>Líder Militar</label>
                <select value={lider} onChange={(e) => setLider(e.target.value)}>
                  <option value="">Escolha o líder militar</option>
                  {users.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </Field>
              <Field>
                <label>Equipe</label>
                <TeamSearchWrapper>
                  <TeamSearchInput
                    placeholder="Digite para buscar membros..."
                    value={teamQuery}
                    onChange={(e) => setTeamQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (filteredUsers.length > 0) handleAddToTeam(filteredUsers[0]);
                      }
                    }}
                  />
                  {teamQuery && filteredUsers.length > 0 && (
                    <TeamResults role="listbox">
                      {filteredUsers.map((u) => (
                        <div key={u} onClick={() => handleAddToTeam(u)} role="option" tabIndex={0}>
                          {u}
                        </div>
                      ))}
                    </TeamResults>
                  )}
                </TeamSearchWrapper>
              </Field>
              <Field>
                <TeamBox aria-label="Equipe selecionada">
                  {team.length === 0 ? (
                    <div className="placeholder">Nenhum membro adicionado</div>
                  ) : (
                    team.map((t) => (
                      <TeamChip key={t}>
                        <span>{t}</span>
                        <button type="button" onClick={() => handleRemoveFromTeam(t)} aria-label={`Remover ${t}`}>
                          ✕
                        </button>
                      </TeamChip>
                    ))
                  )}
                </TeamBox>
              </Field>
              <Field>
                <label>Ponto Base</label>
                <select value={pontoBase} onChange={(e) => setPontoBase(e.target.value)}>
                  <option value="">Selecione ponto base no acionamento</option>
                  <option>Voltando para a base</option>
                  <option>Na base</option>
                  <option>Em deslocamento</option>
                </select>
              </Field>
              <Field>
                <label>Viatura Utilizada</label>
                <select value={viaturaUtilizada} onChange={(e) => setViaturaUtilizada(e.target.value)}>
                  <option value="">Selecione o tipo de viatura utilizada</option>
                  <option>Auto Bomba</option>
                  <option>Auto Resgate</option>
                  <option>Auto Tanque</option>
                  <option>Auto Socorro</option>
                  <option>Motocicleta</option>
                </select>
              </Field>
              <Field>
                <label>Numeração da Viatura</label>
                <select value={numeracaoViatura} onChange={(e) => setNumeracaoViatura(e.target.value)}>
                  <option value="">Selecione a numeração da viatura</option>
                  <option>VT-001</option>
                  <option>VT-002</option>
                  <option>VT-003</option>
                </select>
              </Field>
            </Grid>
          </BoxInfo>
        </GridColumn>
      </ResponsiveRow>

      <ResponsiveRow>
        <GridColumn weight={1}>
          <BoxInfo>
            <SectionTitle><UserIcon size={22} weight="fill" /> Vítimas e Pessoas Envolvidas</SectionTitle>
            <BoxInfo>
              <Grid>
                {pessoas.length === 0 && (
                  <div style={{ gridColumn: "1 / -1", color: "#64748b", padding: 12, justifyContent: "center", display: "flex" }}>
                    Nenhuma pessoa adicionada
                  </div>
                )}
                {pessoas.map((p, idx) => (
                  <PersonCard key={p.id}>
                    <PersonCardHeader>
                      <strong>Pessoa {idx + 1}</strong>
                      <PersonRemoveButton
                        type="button"
                        onClick={() => removePessoa(p.id)}
                      >
                        Remover
                      </PersonRemoveButton>
                    </PersonCardHeader>
                    <Grid>
                      <Field>
                        <label>Nome Completo</label>
                        <input value={p.nome} onChange={(e) => updatePessoa(p.id, { nome: e.target.value })} />
                      </Field>
                      <Field>
                        <label>Idade</label>
                        <input type="number" value={p.idade} onChange={(e) => updatePessoa(p.id, { idade: e.target.value })} />
                      </Field>
                      <Field>
                        <label>Documento</label>
                        <input placeholder="CPF, RG..." value={p.documento} onChange={(e) => updatePessoa(p.id, { documento: e.target.value })} />
                      </Field>
                      <Field>
                        <label>Condição</label>
                        <select value={p.condicao} onChange={(e) => updatePessoa(p.id, { condicao: e.target.value })}>
                          <option>Ileso</option>
                          <option>Ferido</option>
                        </select>
                      </Field>
                    </Grid>
                  </PersonCard>
                ))}
                <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "center" }}>
                  <Button text="+ Adicionar Pessoa" onClick={addPessoa} />
                </div>
              </Grid>
            </BoxInfo>
          </BoxInfo>
        </GridColumn>
      </ResponsiveRow>

      <ResponsiveRow>
        <GridColumn weight={1}>
          <BoxInfo>
            <SectionTitle><PaperclipIcon size={22} weight="fill" /> Anexos e Evidências</SectionTitle>
            <SectionSubtitle>Fotos e Arquivos</SectionSubtitle>
            <UploadArea
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const files = e.dataTransfer.files;
                handleFileUpload(files);
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
            {uploadedFiles?.length > 0 && (
              <PreviewList>
                {uploadedFiles.map((file, idx) => (
                  <div key={idx}>
                    <span>{file.name}</span>
                  </div>
                ))}
              </PreviewList>
            )}
            <Divider />
            <SectionSubtitle>Assinatura do Responsável</SectionSubtitle>
            <SignatureBox>
              <canvas
                ref={signatureCanvasRef}
                width={window.innerWidth < 480 ? 300 : 500}
                height={200}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={endDrawing}
              />
              <SignatureActions>
                <Button variant="secondary" text="Limpar" onClick={clearSignature} />
                <Button text="Salvar Assinatura" onClick={saveSignature} />
                <Button text="Abrir tela maior" onClick={() => setSignatureModalOpen(true)} />
              </SignatureActions>
            </SignatureBox>
            {signatureModalOpen && (
              <ModalOverlay>
                <ModalContent>
                  <canvas
                    ref={setModalCanvasRef}
                    width={window.innerWidth - 40}
                    height={300}
                    onMouseDown={startModalDrawing}
                    onMouseMove={drawModal}
                    onMouseUp={endModalDrawing}
                    onTouchStart={startModalDrawing}
                    onTouchMove={drawModal}
                    onTouchEnd={endModalDrawing}
                  />
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: 12 }}>
                    <Button variant="secondary" text="Limpar" onClick={clearModalSignature} />
                    <Button text="Salvar" onClick={saveModalSignature} />
                    <Button variant="secondary" text="Fechar" onClick={() => setSignatureModalOpen(false)} />
                  </div>
                </ModalContent>
              </ModalOverlay>
            )}
          </BoxInfo>
        </GridColumn>
      </ResponsiveRow>

      <ResponsiveRow>
        <GridColumn weight={1}>
          <BoxInfo>
            <SectionTitle><GearIcon size={22} weight="fill" /> Detalhes Operacionais</SectionTitle>
            <Grid>
              <Field>
                <label>Tempo Estimado de Resposta (min)</label>
                <input value={tempoResposta} onChange={(e) => setTempoResposta(e.target.value)} />
              </Field>
              <FullField>
                <label>Observações Adicionais</label>
                <textarea
                  placeholder="Anotações internas, detalhes específicos da operação..."
                  value={observacoesAdicionais}
                  onChange={(e) => setObservacoesAdicionais(e.target.value)}
                />
              </FullField>
            </Grid>
          </BoxInfo>
        </GridColumn>
      </ResponsiveRow>

      <ResponsiveRow>
        <GridColumn weight={1}>
          <BoxInfo>
            <SectionTitle><ClipboardTextIcon size={22} weight="fill" /> Informações de Auditoria</SectionTitle>
            <Grid>
              <Field><label>Atendente Responsável</label><input value="Ana Paula" readOnly /></Field>
              <Field><label>Data/Hora do Registro</label><input value="29/09/2025 12:33" readOnly /></Field>
              <Field><label>IP de Origem</label><input value="192.167.2.100" readOnly /></Field>
            </Grid>
          </BoxInfo>
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
                  localStorage.removeItem(CACHE_KEY);
                  sessionStorage.removeItem(CACHE_KEY);
                  setOfflineOccurrences([]);
                  alert("Dados do localStorage e sessionStorage foram limpos.");
                } catch (err) {
                  console.error("Erro ao limpar armazenamento:", err);
                  alert("Não foi possível limpar o armazenamento.");
                }
              }}
              style={{ padding: "8px 14px", borderRadius: 6 }}
            />
            <Button
              text="Salvar Ocorrência"
              type="button"
              variant="danger"
              onClick={() => {
                const ocorrencia = {
                  tipoOcorrencia,
                  dataChamado,
                  statusInicial,
                  descricaoResumida,
                  unidadeResponsavel,
                  chefe,
                  lider,
                  equipe: team,
                  pontoBase,
                  viaturaUtilizada,
                  numeracaoViatura,
                  municipioId: selectedMunicipioId,
                  municipioNome: selectedMunicipioNome,
                  bairro,
                  logradouro,
                  numero,
                  complemento,
                  referencia,
                  latitude,
                  longitude,
                  pessoas,
                  arquivos: uploadedFiles.map(f => f.name),
                  tempoResposta,
                  observacoesAdicionais,
                };

                const saved = saveOffline(ocorrencia);
                if (saved) {
                  setOfflineOccurrences(getOfflineOccurrences());
                  if (isOnline) {
                    fakeSendToServer(ocorrencia);
                  } else {
                    alert("Sem internet. Ocorrência salva offline.");
                  }
                } else {
                  console.warn("Ocorrência não salva localmente.");
                }
              }}
            />

          </div>
        </GridColumn>
      </ResponsiveRow>
    </ContainerPainel>
  );
}