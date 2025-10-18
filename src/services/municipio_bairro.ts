export type Municipio = { id: number; nome: string };

export async function fetchMunicipiosPE(): Promise<Municipio[]> {
  const res = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados/PE/municipios");
  if (!res.ok) throw new Error(`IBGE error: ${res.status}`);
  const data = await res.json() as Array<{ id: number; nome: string }>;
  const mapped: Municipio[] = data.map((m) => ({ id: m.id, nome: m.nome }));
  mapped.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  return mapped;
}

export async function fetchDistritosByMunicipio(municipioId: number): Promise<string[]> {
  const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${municipioId}/distritos`);
  if (!res.ok) return [];
  const data = await res.json() as Array<{ nome: string }>;
  if (!Array.isArray(data)) return [];
  return data.map((d) => d.nome);
}

export async function fetchBairrosFromOSM(municipioNome: string): Promise<string[]> {
  const query = `[out:json][timeout:25];
area["name"="${municipioNome}"]["boundary"="administrative"]->.a;
(
  node["place"="neighbourhood"](area.a);
  way["place"="neighbourhood"](area.a);
  relation["place"="neighbourhood"](area.a);
  node["place"="suburb"](area.a);
  way["place"="suburb"](area.a);
  relation["place"="suburb"](area.a);
);
out tags;`;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
    headers: { "Content-Type": "text/plain" },
  });
  if (!res.ok) throw new Error(`Overpass error: ${res.status}`);
  const data = await res.json();
  const names = new Set<string>();
  (data.elements || []).forEach((el: unknown) => {
    if (typeof el === "object" && el !== null) {
      const maybe = el as { tags?: Record<string, unknown> | undefined };
      const tags = maybe.tags;
      if (tags && typeof tags === "object") {
        const name = (tags as Record<string, unknown>).name;
        if (typeof name === "string") {
          names.add(name);
        }
      }
    }
  });
  return Array.from(names).sort((a, b) => a.localeCompare(b, "pt-BR"));
}