/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { MapPinIcon } from "@phosphor-icons/react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BoxInfo, SectionTitle, Grid, Field, MapFullBox, MapPlaceholder } from "../../../components/EstilosPainel.styles";
import { Button } from "../../../components/Button";

// Import das funções de API do api.ts
import { fetchMunicipiosPE, fetchBairrosFromOSM, fetchGeocode, fetchReverseGeocode } from "../../../services/api";
import type { Municipio } from "../../../services/municipio_bairro";

interface LocalizacaoProps {
  municipios: Municipio[];
  setMunicipios: (value: Municipio[]) => void;
  selectedMunicipioId: number | "";
  setSelectedMunicipioId: (value: number | "") => void;
  selectedMunicipioNome: string;
  setSelectedMunicipioNome: (value: string) => void;
  bairro: string;
  setBairro: (value: string) => void;
  logradouro: string;
  setLogradouro: (value: string) => void;
  numero: string;
  setNumero: (value: string) => void;
  complemento: string;
  setComplemento: (value: string) => void;
  referencia: string;
  setReferencia: (value: string) => void;
  latitude: string;
  setLatitude: (value: string) => void;
  longitude: string;
  setLongitude: (value: string) => void;
  isLoadingOffline?: boolean;
}

export function Localizacao(props: LocalizacaoProps) {
  const [bairros, setBairros] = useState<string[]>([]);
  const [forceManualLocationInput, setForceManualLocationInput] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);

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
      .then(props.setMunicipios)
      .catch((err) => console.error("Erro ao buscar municípios IBGE:", err));
  }, []);

  useEffect(() => {
    if (!props.selectedMunicipioId) {
      setBairros([]);
      return;
    }
    fetchBairrosFromOSM(String(props.municipios.find((m) => m.id === props.selectedMunicipioId)?.nome))
      .then((data: any) => {
        setBairros(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar distritos IBGE:", err);
        setBairros([]);
      });
  }, [props.municipios, props.selectedMunicipioId]);

  const requiredLocationFilled =
    Boolean(props.selectedMunicipioId) &&
    props.bairro.trim() !== "" &&
    props.logradouro.trim() !== "" &&
    props.numero.trim() !== "";

  useEffect(() => {
    async function geocodeAddress() {
      if (!requiredLocationFilled || props.isLoadingOffline) return;
      const municipioNome = props.municipios.find((m) => m.id === props.selectedMunicipioId)?.nome || "";
      const q = `${props.logradouro}, ${props.numero}, ${props.bairro}, ${municipioNome}, Pernambuco, Brazil`;
      setIsGeocoding(true);
      try {
        const json = await fetchGeocode(q);
        if (Array.isArray(json) && json.length > 0) {
          props.setLatitude(json[0].lat);
          props.setLongitude(json[0].lon);
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
  }, [requiredLocationFilled, props.selectedMunicipioId, props.bairro, props.logradouro, props.numero, props.municipios, props.isLoadingOffline]);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não suportada pelo navegador.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        props.setLatitude(String(latitude));
        props.setLongitude(String(longitude));
        try {
          const data = await fetchReverseGeocode(latitude, longitude);
          if (data.address) {
            props.setLogradouro(data.address.road || "");
            props.setNumero(data.address.house_number || "");
            props.setBairro(data.address.suburb || data.address.neighbourhood || "");
            props.setComplemento("");
            props.setReferencia("");
            props.setSelectedMunicipioNome(data.address.city || data.address.town || data.address.municipality || "");
            
            // Tentar encontrar o município pelo nome
            const municipio = props.municipios.find((m) => 
              m.nome.toLowerCase() === data.address.city?.toLowerCase() ||
              m.nome.toLowerCase() === data.address.town?.toLowerCase() ||
              m.nome.toLowerCase() === data.address.municipality?.toLowerCase()
            );
            props.setSelectedMunicipioId(municipio ? municipio.id : "");
          }
          setForceManualLocationInput(false);
        } catch (err) {
          console.error("Erro no reverse geocoding:", err);
          setForceManualLocationInput(true);
          alert("Erro ao obter endereço. Preencha manualmente.");
        }
      },
      (err) => {
        console.error("Erro ao obter localização:", err);
        setForceManualLocationInput(true);
        alert("Não foi possível obter sua localização. Preencha os campos manualmente.");
      }
    );
  };

  return (
    <BoxInfo>
      <SectionTitle><MapPinIcon size={22} weight="fill" /> Localização</SectionTitle>
      <Grid>
        <Field>
          <label className="required">Município</label>
          {props.municipios.length > 0 && !forceManualLocationInput ? (
            <select
              value={props.selectedMunicipioId}
              onChange={(e) => {
                const id = e.target.value ? Number(e.target.value) : "";
                props.setSelectedMunicipioId(id);
                const nome = props.municipios.find(m => m.id === id)?.nome || "";
                props.setSelectedMunicipioNome(nome);
              }}
            >
              <option value="">Selecione o município (PE)</option>
              {props.municipios.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome}
                </option>
              ))}
            </select>
          ) : (
            <input
              placeholder="Informe o município"
              value={props.selectedMunicipioNome}
              onChange={(e) => props.setSelectedMunicipioNome(e.target.value)}
            />
          )}
        </Field>
        <Field>
          <label className="required">Bairro</label>
          {bairros.length > 0 && !forceManualLocationInput ? (
            <select value={props.bairro} onChange={(e) => props.setBairro(e.target.value)}>
              <option value="">Selecione o bairro</option>
              {bairros.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          ) : (
            <input placeholder="Informe o bairro" value={props.bairro} onChange={(e) => props.setBairro(e.target.value)} />
          )}
        </Field>
        <Field>
          <label className="required">Logradouro</label>
          <input placeholder="Ex: Av. Norte" value={props.logradouro} onChange={(e) => props.setLogradouro(e.target.value)} />
        </Field>
        <Field>
          <label className="required">Número</label>
          <input placeholder="Ex: 458" value={props.numero} onChange={(e) => props.setNumero(e.target.value)} />
        </Field>
        <Field>
          <label>Complemento</label>
          <input placeholder="Ex: apt 101" value={props.complemento} onChange={(e) => props.setComplemento(e.target.value)} />
        </Field>
        <Field>
          <label>Referência</label>
          <input
            placeholder="Ex: Em frente ao Hospital Agamenon Magalhães"
            value={props.referencia}
            onChange={(e) => props.setReferencia(e.target.value)}
          />
        </Field>
        <Field>
          <label>Latitude</label>
          <input
            value={props.latitude}
            onChange={(e) => props.setLatitude(e.target.value)}
            placeholder=""
            readOnly
          />
        </Field>
        <Field>
          <label>Longitude</label>
          <input
            value={props.longitude}
            onChange={(e) => props.setLongitude(e.target.value)}
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
            {props.latitude && props.longitude ? (
              <MapContainer
                center={[Number(props.latitude), Number(props.longitude)]}
                zoom={17}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[Number(props.latitude), Number(props.longitude)]} />
              </MapContainer>
            ) : (
              <MapPlaceholder>
                Use o botão "Usar Localização" ou preencha os campos obrigatórios
                {isGeocoding && " (buscando coordenadas...)"}
              </MapPlaceholder>
            )}
          </MapFullBox>
        </Field>
      </Grid>
    </BoxInfo>
  );
}