// src/components/sections/VitimasPessoas.tsx

import { useEffect, useState } from "react";
import { UserIcon } from "@phosphor-icons/react";
import { BoxInfo, SectionTitle, Grid, Field, FullField } from "../../../components/EstilosPainel.styles";
import { Button } from "../../../components/Button";
import { fetchLesoes } from "../../../services/api";

export interface VitimaEdicao {
  id: number;
  nome: string;
  cpfVitima?: string;
  idade?: number;
  sexo?: "M" | "F" | "O";
  etnia?: string;
  tipoAtendimento?: string;
  observacoes?: string;
  destinoVitima?: string;
  lesaoId?: number;
  lesao?: { id: number; tipoLesao: string };
  isNova?: boolean;
}

interface VitimasPessoasProps {
  vitimas: VitimaEdicao[];
  onChange: (vitimas: VitimaEdicao[]) => void;
}

export function VitimasPessoas({ vitimas, onChange }: VitimasPessoasProps) {
  const [lesoes, setLesoes] = useState<{ id: number; tipoLesao: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLesoes().then(data => {
      setLesoes(data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const addVitima = () => {
    onChange([...vitimas, {
      id: -Date.now(),
      nome: "",
      cpfVitima: "",
      idade: undefined,
      sexo: undefined,
      etnia: "",
      tipoAtendimento: "",
      observacoes: "",
      destinoVitima: "",
      lesaoId: undefined,
    }]);
  };

  const updateVitima = (id: number, patch: Partial<VitimaEdicao>) => {
    onChange(vitimas.map(v => v.id === id ? { ...v, ...patch } : v));
  };

  const removeVitima = (id: number) => {
    onChange(vitimas.filter(v => v.id !== id));
  };

  return (
    <BoxInfo>
      <SectionTitle><UserIcon size={22} weight="fill" /> Vítimas e Pessoas Envolvidas</SectionTitle>

      {vitimas.length === 0 ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
          Nenhuma vítima adicionada
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {vitimas.map((v, i) => (
            <div key={v.id} style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "1.5rem",
              position: "relative"
            }}>
              <div style={{ 
                position: "absolute", top: "12px", right: "12px", fontWeight: 600, color: "#475569" 
              }}>
                Vítima {i + 1}
              </div>

              <Grid style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                <Field>
                  <label>Nome Completo</label>
                  <input value={v.nome} onChange={e => updateVitima(v.id, { nome: e.target.value })} />
                </Field>
                <Field>
                  <label>CPF</label>
                  <input value={v.cpfVitima || ""} onChange={e => updateVitima(v.id, { cpfVitima: e.target.value })} placeholder="000.000.000-00" />
                </Field>
                <Field>
                  <label>Idade</label>
                  <input type="number" value={v.idade || ""} onChange={e => updateVitima(v.id, { idade: e.target.value ? Number(e.target.value) : undefined })} />
                </Field>

                <Field>
                  <label>Sexo</label>
                  <select value={v.sexo || ""} onChange={e => updateVitima(v.id, { sexo: (e.target.value || undefined) as "M" | "F" | "O" | undefined })}>
                    <option value="">Selecione</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="O">Outro</option>
                  </select>
                </Field>

                <Field>
                  <label>Etnia</label>
                  <input value={v.etnia || ""} onChange={e => updateVitima(v.id, { etnia: e.target.value })} />
                </Field>

                <Field>
                  <label className="required">Condição</label>
                  {loading ? (
                    <select disabled><option>Carregando...</option></select>
                  ) : (
                    <select
                      value={v.lesaoId || ""}
                      onChange={e => updateVitima(v.id, { lesaoId: Number(e.target.value) || undefined })}
                      required
                    >
                      <option value="">Selecione</option>
                      {lesoes.map(l => (
                        <option key={l.id} value={l.id}>{l.tipoLesao}</option>
                      ))}
                    </select>
                  )}
                </Field>

                <Field>
                  <label>Destino</label>
                  <input value={v.destinoVitima || ""} onChange={e => updateVitima(v.id, { destinoVitima: e.target.value })} />
                </Field>

                <Field>
                  <label>Tipo de Atendimento</label>
                  <input value={v.tipoAtendimento || ""} onChange={e => updateVitima(v.id, { tipoAtendimento: e.target.value })} />
                </Field>

                <FullField>
                  <label>Observações</label>
                  <textarea
                    rows={2}
                    value={v.observacoes || ""}
                    onChange={e => updateVitima(v.id, { observacoes: e.target.value })}
                    placeholder="Estado da vítima, sinais vitais, etc."
                  />
                </FullField>
              </Grid>

              <div style={{ marginTop: "1rem", textAlign: "right" }}>
                <Button text="Remover Vítima" variant="danger" onClick={() => removeVitima(v.id)} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
        <Button text="+ Adicionar Vítima" onClick={addVitima} variant="primary" />
      </div>
    </BoxInfo>
  );
}