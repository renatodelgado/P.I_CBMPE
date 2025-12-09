/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapPinIcon } from "@phosphor-icons/react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BoxInfo, SectionTitle, Grid, Field, MapFullBox, MapPlaceholder } from "../../../components/EstilosPainel.styles";

interface LocalizacaoViewProps {
  municipio: string;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  referencia: string;
  latitude?: number;
  longitude?: number;
}

export function LocalizacaoView(props: LocalizacaoViewProps) {
  // Configuração do ícone do marcador (mesma do componente original)
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

  const hasValidCoordinates = props.latitude && props.longitude;
  const mapCenter = hasValidCoordinates 
    ? [props.latitude, props.longitude] as [number, number]
    : [-8.0476, -34.8770] as [number, number];

  return (
    <BoxInfo>
      <SectionTitle><MapPinIcon size={22} weight="fill" /> Localização</SectionTitle>
      <Grid>
        <Field>
          <label className="required">Município</label>
          <input 
            type="text" 
            value={props.municipio || "Não informado"} 
            readOnly 
          />
        </Field>
        <Field>
          <label className="required">Bairro</label>
          <input 
            type="text" 
            value={props.bairro || "Não informado"} 
            readOnly 
          />
        </Field>
        <Field>
          <label className="required">Logradouro</label>
          <input 
            type="text" 
            value={props.logradouro || "Não informado"} 
            readOnly 
            placeholder="Ex: Av. Norte"
          />
        </Field>
        <Field>
          <label className="required">Número</label>
          <input 
            type="text" 
            value={props.numero || "Não informado"} 
            readOnly 
            placeholder="Ex: 458"
          />
        </Field>
        <Field>
          <label>Complemento</label>
          <input 
            type="text" 
            value={props.complemento || ""} 
            readOnly 
            placeholder="Ex: apt 101"
          />
        </Field>
        <Field>
          <label>Referência</label>
          <input 
            type="text" 
            value={props.referencia || ""} 
            readOnly 
            placeholder="Ex: Em frente ao Hospital Agamenon Magalhães"
          />
        </Field>
        <Field>
          <label>Latitude</label>
          <input 
            type="text" 
            value={props.latitude?.toString() || ""} 
            readOnly 
            placeholder=""
          />
        </Field>
        <Field>
          <label>Longitude</label>
          <input 
            type="text" 
            value={props.longitude?.toString() || ""} 
            readOnly 
            placeholder=""
          />
        </Field>
      </Grid>
      
      {/* Mapa - MESMO PADRÃO DO COMPONENTE ORIGINAL */}
      <Grid>
        <Field>
          <br />
          <MapFullBox>
            {hasValidCoordinates ? (
              <MapContainer
                center={mapCenter}
                zoom={17}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={mapCenter} />
              </MapContainer>
            ) : (
              <MapPlaceholder>
                Coordenadas não disponíveis para exibir o mapa
              </MapPlaceholder>
            )}
          </MapFullBox>
        </Field>
      </Grid>
    </BoxInfo>
  );
}