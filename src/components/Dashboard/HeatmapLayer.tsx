import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

interface HeatmapLayerProps {
  points: [number, number, number?][];
}

export default function HeatmapLayer({ points }: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) return;

    const normalizedPoints = points.map(
      ([lat, lng, intensity = 1]) => [lat, lng, intensity * 0.2]
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const heatLayer = (L as any).heatLayer(normalizedPoints, {
      radius: 40,
      blur: 45,
      maxZoom: 12,
      minOpacity: 0.04,
      max: 0.7,
      gradient: {
        0.2: "#00f",
        0.4: "#0ff",
        0.6: "#0f0",
        0.8: "#ff0",
        1.0: "#f00",
      }
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}
