import { ClipboardTextIcon, FileTextIcon, FireTruckIcon, GearIcon, MapPinIcon, PaperclipIcon, UserIcon } from "@phosphor-icons/react";
import { BoxInfo, SectionTitle, Grid, Field, FullField, ContainerPainel, GridColumn, ResponsiveRow, PageSubtitle, PageTitle, PageTopHeader, RequiredNotice, TeamSearchWrapper, TeamSearchInput, TeamResults, TeamBox, TeamChip, MapRow, CoordsColumn, MapFullBox, MapPlaceholder, MapMessage, PersonCard, PersonCardHeader, PersonRemoveButton, UploadArea } from "../../components/EstilosPainel.styles";
import { Breadcrumb } from "../../components/Breadcrumb";
import { useEffect, useState } from "react";
import { fetchBairrosFromOSM, fetchMunicipiosPE, type Municipio } from "../../services/municipio_bairro";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "../../components/Button";

export function NovaOcorrencia() {
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [selectedMunicipioId, setSelectedMunicipioId] = useState<number | "">("");
  const [bairros, setBairros] = useState<string[]>([]);
  const [bairro, setBairro] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  // simular usuários cadastrados
  const [users] = useState<string[]>([
    "Cabo Silva",
    "Sargento Souza",
    "Tenente Costa",
    "Capitão Lima",
    "Soldado Araújo",
    "Soldada Araújo",
    "Major Fernandes",
  ]);
  // Chefe e Líder são pessoas distintas
  const [chefe, setChefe] = useState("");
  const [lider, setLider] = useState("");

  // substituído: handler antigo de <select multiple> por estados/handlers para lista buscável
  const [team, setTeam] = useState<string[]>([]);
  const [teamQuery, setTeamQuery] = useState("");

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ("Marker" in L && !(L as any)._copilot_icon_set) {
    const DefaultIcon = L.icon({
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (L as any).Marker.prototype.options.icon = DefaultIcon;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      if (!requiredLocationFilled) return;
      const municipioNome = municipios.find((m) => m.id === selectedMunicipioId)?.nome || "";
      const q = `${logradouro}, ${numero}, ${bairro}, ${municipioNome}, Pernambuco, Brazil`;
      setIsGeocoding(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            q
          )}&limit=1`
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
  }, [requiredLocationFilled, selectedMunicipioId, bairro, logradouro, numero, municipios]);

  // Novas estruturas para vítimas/pessoas envolvidas
  type Pessoa = {
    id: number;
    nome: string;
    idade: string;
    documento: string;
    condicao: string;
  };

  // Começa sem pessoas; o usuário adiciona conforme necessário
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  
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

  return (
    <>
      <ContainerPainel>

        <PageTopHeader>
          <Breadcrumb
            items={[
              { label: "Ocorrências", onClick: () => console.log("Voltar às ocorrências") },
              { label: "Cadastrar Ocorrência" },
            ]}
          />

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
                  <select>
                    <option>Incêndio</option>
                    <option>Resgate</option>
                    <option>Atendimento Pré-Hospitalar</option>
                    <option>Outro</option>
                  </select>
                </Field>
                <Field>
                  <label className="required">Data/Hora do Chamado</label>
                  <input type="datetime-local" />
                </Field>
                <Field>
                  <label>Status Inicial</label>
                  <select>
                    <option>Pendente</option>
                    <option>Em andamento</option>
                    <option>Concluída</option>
                  </select>
                </Field>
                <FullField>
                  <label>Descrição Resumida</label>
                  <textarea placeholder="Ex: Incêndio em veículo na Av. Norte, vítima consciente." />
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
                  <select
                    value={selectedMunicipioId}
                    onChange={(e) => setSelectedMunicipioId(e.target.value ? Number(e.target.value) : "")}
                  >
                    <option value="">Selecione o município (PE)</option>
                    {municipios.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nome}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field>
                  <label className="required">Bairro</label>
                  {bairros.length > 0 ? (
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
                <Field><label>Complemento</label><input placeholder="Ex: apt 101" /></Field>


                <Field>
                  <label>Referência</label>
                  <input placeholder="Ex: Em frente ao Hospital Agamenon Magalhães" /></Field>

                <MapRow>
                  <CoordsColumn>
                    <Field>
                      <label>Latitude</label>
                      <input
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        disabled={requiredLocationFilled}
                      />
                    </Field>
                    <Field>
                      <label>Longitude</label>
                      <input
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        disabled={requiredLocationFilled}
                        placeholder={requiredLocationFilled ? "Bloqueada - preencha os campos obrigatórios para editar via mapa" : ""}
                      />
                    </Field>
                  </CoordsColumn>
                  <Field>
                    <div>
                      <label>Mapa Interativo</label>
                      {requiredLocationFilled ? (
                        <MapFullBox>
                          {latitude && longitude ? (
                            <MapContainer
                              center={[Number(latitude), Number(longitude)]}
                              zoom={18}
                              style={{ height: "100%", width: "100%" }}
                              scrollWheelZoom={true}
                            >
                              <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              />
                              <Marker position={[Number(latitude), Number(longitude)]} />
                            </MapContainer>
                          ) : isGeocoding ? (
                            <MapMessage>Localizando endereço...</MapMessage>
                          ) : (
                            <MapMessage>
                              Não foi possível localizar o endereço no mapa.
                            </MapMessage>
                          )}
                        </MapFullBox>
                      ) : (
                        <MapPlaceholder>
                          <div>Preencha Município, Bairro, Logradouro e Número para exibir o mapa.</div>
                        </MapPlaceholder>
                      )}
                    </div>
                  </Field>
                </MapRow>

              </Grid>
            </BoxInfo>
          </GridColumn>
        </ResponsiveRow>

        <ResponsiveRow>
          <GridColumn weight={1}>
            <BoxInfo>
              <SectionTitle><FireTruckIcon size={22} weight="fill" /> Equipes e Viaturas</SectionTitle>
              <Grid>
                <Field><label>Unidade Responsável</label>
                  <select>
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
                     ) }
                    </TeamBox>
                  </Field>
                <Field><label>Ponto Base</label>
                <select>
                    <option value="">Selecione ponto base no acionamento</option>
                    <option>Voltando para a base</option>
                    <option>Na base</option>
                    <option>Em deslocamento</option>
                  </select>
                  </Field>
                <Field><label>Viatura Utilizada</label>
                <select>
                    <option value="">Selecione o tipo de viatura utilizada</option>
                    <option>Auto Bomba</option>
                    <option>Auto Resgate</option>
                    <option>Auto Tanque</option>
                    <option>Auto Socorro</option>
                    <option>Motocicleta</option>
                  </select> 
                </Field>
                <Field><label>Numeração da Viatura</label>
                <select>
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
              <UploadArea>
                <p>Arraste arquivos aqui ou clique para selecionar</p>
                <input type="file" />
              </UploadArea>
            </BoxInfo>
          </GridColumn>
        </ResponsiveRow>

        <ResponsiveRow>
          <GridColumn weight={1}>
            <BoxInfo>
              <SectionTitle><GearIcon size={22} weight="fill" /> Detalhes Operacionais</SectionTitle>
              <Grid>
                <Field><label>Tempo Estimado de Resposta (min)</label><input /></Field>
                <FullField>
                  <label>Observações Adicionais</label>
                  <textarea placeholder="Anotações internas, detalhes específicos da operação..." />
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
                text="Cancelar"
                type="button"
                variant="secondary"
                onClick={() => console.log("Cancelar")}
                style={{ padding: "8px 14px", borderRadius: 6 }}
              />
              <Button
                text="Salvar Ocorrência"
                type="button"
                variant="danger"
                onClick={() => console.log("Salvar Ocorrência")}
                style={{ padding: "8px 14px", borderRadius: 6 }}
              />
            </div>
          </GridColumn>
        </ResponsiveRow>

      </ContainerPainel >

    </>
  );
}
