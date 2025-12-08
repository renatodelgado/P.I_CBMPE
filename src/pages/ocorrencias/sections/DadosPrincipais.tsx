/* eslint-disable @typescript-eslint/no-explicit-any */
// File: src/components/sections/DadosPrincipais.tsx
import { useEffect, useState } from "react";
import { FileTextIcon } from "@phosphor-icons/react";
import { BoxInfo, SectionTitle, Grid, Field, FullField } from "../../../components/EstilosPainel.styles";

// Import das funções de API do api.ts
import { fetchNaturezasOcorrencias, fetchGruposOcorrencias, fetchSubgruposOcorrencias } from "../../../services/api";

interface DadosPrincipaisProps {
  numeroOcorrencia: string;
  dataChamado: string;
  setDataChamado: (value: string) => void;
  statusAtendimento: string;
  setStatusAtendimento: (value: string) => void;
  motivoNaoAtendimento: string;
  setMotivoNaoAtendimento: (value: string) => void;
  descricao: string;
  setDescricao: (value: string) => void;
  natureza: string;
  setNatureza: (value: string) => void;
  grupo: string;
  setGrupo: (value: string) => void;
  subgrupo: string;
  setSubgrupo: (value: string) => void;
  formaAcionamento: string;
  setFormaAcionamento: (value: string) => void;
  eventoEspecial: boolean;
  setEventoEspecial: (value: boolean) => void;
}

export function DadosPrincipais(props: DadosPrincipaisProps) {
  const [naturezasOcorrencias, setNaturezasOcorrencias] = useState<
    { id?: number; nome?: string }[]
  >([]);
  const [loadingNaturezas, setLoadingNaturezas] = useState<boolean>(true);
  const [gruposOcorrencias, setGruposOcorrencias] = useState<
    { naturezaOcorrencia?: any; id?: number; nome?: string; }[]
  >([]);
  const [loadingGrupos, setLoadingGrupos] = useState<boolean>(true);
  const [subgruposOcorrencias, setSubgruposOcorrencias] = useState<
    { grupoOcorrencia?: any; id?: number; nome?: string; }[]
  >([]);
  const [loadingSubgrupos, setLoadingSubgrupos] = useState<boolean>(true);

  useEffect(() => {
    const fetchNaturezasData = async () => {
      try {
        const data = await fetchNaturezasOcorrencias();
        setNaturezasOcorrencias(data);
      } catch (error) {
        console.error("Erro ao carregar naturezas:", error);
        alert("Erro ao carregar naturezas de ocorrências");
      } finally {
        setLoadingNaturezas(false);
      }
    };
    fetchNaturezasData();
  }, []);

  useEffect(() => {
    const fetchGruposData = async () => {
      try {
        const data = await fetchGruposOcorrencias();
        setGruposOcorrencias(data);
      } catch (error) {
        console.error("Erro ao carregar grupos de ocorrências:", error);
        alert("Erro ao carregar grupos de ocorrências");
      } finally {
        setLoadingGrupos(false);
      }
    };
    fetchGruposData();
  }, []);

  useEffect(() => {
    const fetchSubgruposData = async () => {
      try {
        const data = await fetchSubgruposOcorrencias();
        setSubgruposOcorrencias(data);
      } catch (error) {
        console.error("Erro ao carregar subgrupos de ocorrências:", error);
        alert("Erro ao carregar subgrupos de ocorrências");
      } finally {
        setLoadingSubgrupos(false);
      }
    };
    fetchSubgruposData();
  }, []);

  return (
    <BoxInfo>
      <SectionTitle><FileTextIcon size={22} weight="fill" />Dados Principais</SectionTitle>
      <Grid>
        <Field>
          <label>Número da Ocorrência</label>
          <input type="text" value={props.numeroOcorrencia} readOnly />
        </Field>
        <Field>
          <label className="required">Data/Hora do Chamado</label>
          <input
            type="datetime-local"
            value={props.dataChamado}
            readOnly
          />
        </Field>
        <Field>
          <label>Status de Atendimento</label>
          <select value={props.statusAtendimento} onChange={(e) => {
            props.setStatusAtendimento(e.target.value);
            if (e.target.value !== "Não Atendida") props.setMotivoNaoAtendimento("");
          }}>
            <option>Pendente</option>
            <option>Em andamento</option>
            <option>Atendida</option>
            <option>Não Atendida</option>
          </select>
        </Field>
        {props.statusAtendimento === "Não Atendida" && (
          <FullField>
            <label>Motivo de Não Atendimento</label>
            <textarea
              placeholder="Descreva o motivo pelo qual a ocorrência não foi atendida."
              value={props.motivoNaoAtendimento}
              onChange={(e) => props.setMotivoNaoAtendimento(e.target.value)}
            />
          </FullField>
        )}
        <Field>
          <label className="required">Natureza da Ocorrência</label>
          {loadingNaturezas ? (
            <select disabled>
              <option>Carregando naturezas...</option>
            </select>
          ) : (
            <select
              value={props.natureza}
              onChange={(e) => props.setNatureza(e.target.value)}
              required
            >
              <option value="">Selecione a natureza</option>
              {naturezasOcorrencias.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.nome}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field>
          <label className="required">Grupo da Ocorrência</label>
          {loadingGrupos ? (
            <select disabled>
              <option>Carregando grupos...</option>
            </select>
          ) : (
            <select
              value={props.grupo}
              onChange={(e) => props.setGrupo(e.target.value)}
              required
            >
              <option value="">Selecione o grupo</option>
              {gruposOcorrencias
                .filter(g => String(g.naturezaOcorrencia?.id) === String(props.natureza))
                .map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nome}
                  </option>
                ))}
            </select>
          )}
        </Field>
        <Field>
          <label className="required">Subgrupo da Ocorrência</label>
          {loadingSubgrupos ? (
            <select disabled>
              <option>Carregando subgrupos...</option>
            </select>
          ) : (
            <select
              value={props.subgrupo}
              onChange={(e) => props.setSubgrupo(e.target.value)}
              required
            >
              <option value="">Selecione o subgrupo</option>
              {subgruposOcorrencias
                .filter(s => String(s.grupoOcorrencia?.id) === String(props.grupo))
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome}
                  </option>
                ))}
            </select>
          )}
        </Field>
        <Field>
          <label className="required">Forma de acionamento</label>
          <select value={props.formaAcionamento} onChange={(e) => props.setFormaAcionamento(e.target.value)}>
            <option>Telefone</option>
            <option>Aplicativo</option>
            <option>Pessoalmente</option>
          </select>
        </Field>
        <Field>
          <label>Evento Especial?</label>
          <select
            value={props.eventoEspecial ? "Sim" : "Não"}
            onChange={(e) => props.setEventoEspecial(e.target.value === "Sim")}
            disabled
          >
            <option value="Não">Não</option>
            <option value="Sim">Sim</option>
          </select>
        </Field>
        <FullField>
          <label>Descrição Resumida</label>
          <textarea
            placeholder="Ex: Incêndio em veículo na Av. Norte, vítima consciente."
            value={props.descricao}
            onChange={(e) => props.setDescricao(e.target.value)}
          />
        </FullField>
      </Grid>
    </BoxInfo>
  );
}