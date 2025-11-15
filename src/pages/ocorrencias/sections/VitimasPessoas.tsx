// File: src/components/sections/VitimasPessoas.tsx
import { useEffect, useState } from "react";
import { UserIcon } from "@phosphor-icons/react";
import axios from "axios";
import { BoxInfo, SectionTitle, Grid, PersonCard, PersonCardHeader, PersonRemoveButton, Field, FullField } from "../../../components/EstilosPainel.styles";
import { formatCPF } from "../../../utils/formatCPF";
import { Button } from "../../../components/Button";

type Pessoa = {
  id: number;
  nome: string;
  sexo?: string;
  etnia?: string;
  idade?: number;
  cpf: string;
  tipoAtendimento: string;
  observacoes: string;
  condicao: string;
  destinoVitima?: string;
  condicaoVitima?: number;
};

interface VitimasPessoasProps {
  pessoas: Pessoa[];
  addPessoa: () => void;
  updatePessoa: (id: number, patch: Partial<Pessoa>) => void;
  removePessoa: (id: number) => void;
}

export function VitimasPessoas(props: VitimasPessoasProps) {
  const [condicoesVitima, setCondicoesVitima] = useState<
    { id: number; tipoLesao: string }[]
  >([]);
  const [loadingCondicaoVitima, setLoadingCondicaoVitima] = useState<boolean>(true);

  useEffect(() => {
    const fetchCondicaoVitima = async () => {
      try {
        const response = await axios.get("https://backend-chama.up.railway.app/lesoes");
        setCondicoesVitima(response.data);
      } catch (error) {
        console.error("Erro ao carregar condições da vítima:", error);
        alert("Erro ao carregar condições da vítima");
      } finally {
        setLoadingCondicaoVitima(false);
      }
    };
    fetchCondicaoVitima();
  }, []);

  return (
    <BoxInfo>
      <SectionTitle><UserIcon size={22} weight="fill" /> Vítimas e Pessoas Envolvidas</SectionTitle>
      <BoxInfo>
        <Grid>
          {props.pessoas.length === 0 && (
            <div style={{ gridColumn: "1 / -1", color: "#64748b", padding: 12, justifyContent: "center", display: "flex" }}>
              Nenhuma pessoa adicionada
            </div>
          )}
          {props.pessoas.map((p, idx) => (
            <PersonCard key={p.id}>
              <PersonCardHeader>
                <strong>Pessoa {idx + 1}</strong>
                <PersonRemoveButton
                  type="button"
                  onClick={() => props.removePessoa(p.id)}
                >
                  Remover
                </PersonRemoveButton>
              </PersonCardHeader>
              <Grid>
                <Field>
                  <label>Nome Completo</label>
                  <input value={p.nome} onChange={(e) => props.updatePessoa(p.id, { nome: e.target.value })} />
                </Field>
                <Field>
                  <label>Idade</label>
                  <input
                    type="number"
                    value={p.idade ?? ""}
                    onChange={(e) =>
                      props.updatePessoa(p.id, { idade: e.target.value === "" ? undefined : Number(e.target.value) })
                    }
                  />
                </Field>
                <Field>
                  <label>Sexo</label>
                  <select
                    value={p.sexo || ""}
                    onChange={(e) => props.updatePessoa(p.id, { sexo: e.target.value })}
                  >
                    <option value="">Selecione o sexo</option>
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                  </select>
                </Field>
                <Field>
                  <label>Etnia</label>
                  <select
                    value={p.etnia || ""}
                    onChange={(e) => props.updatePessoa(p.id, { etnia: e.target.value })}
                  >
                    <option value="">Selecione a etnia</option>
                    <option value="branca">Branca</option>
                    <option value="preta">Preta</option>
                    <option value="parda">Parda</option>
                    <option value="amarela">Amarela</option>
                    <option value="indigena">Indígena</option>
                    <option value="outro">Outro</option>
                  </select>
                </Field>
                <Field>
                  <label>CPF</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={p.cpf}
                    onChange={(e) => props.updatePessoa(p.id, { cpf: formatCPF(e.target.value) })}
                    maxLength={14}
                  />
                </Field>
                <Field>
                  <label>Tipo de Atendimento</label>
                  <input value={p.tipoAtendimento || ""} onChange={(e) => props.updatePessoa(p.id, { tipoAtendimento: e.target.value })} />
                </Field>
                <Field>
                  <label className="required">Condição</label>
                  {loadingCondicaoVitima ? (
                    <select disabled>
                      <option>Carregando condição da vítima...</option>
                    </select>
                  ) : (
                    <select
                      value={p.condicao || ""}
                      onChange={(e) => props.updatePessoa(p.id, { condicao: e.target.value })}
                      required
                    >
                      <option value="">Selecione</option>
                      {condicoesVitima.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.tipoLesao}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
                <Field>
                  <label>Destino da Vítima</label>
                  <input
                    value={p.destinoVitima || ""}
                    onChange={(e) => props.updatePessoa(p.id, { destinoVitima: e.target.value })}
                  />
                </Field>
                <FullField>
                  <label>Observações</label>
                  <textarea
                    placeholder="Anotações sobre a pessoa, estado, etc."
                    value={p.observacoes || ""}
                    onChange={(e) => props.updatePessoa(p.id, { observacoes: e.target.value })}
                  />
                </FullField>
              </Grid>
            </PersonCard>
          ))}
          <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "center" }}>
            <Button text="+ Adicionar Pessoa" onClick={props.addPessoa} />
          </div>
        </Grid>
      </BoxInfo>
    </BoxInfo>
  );
}