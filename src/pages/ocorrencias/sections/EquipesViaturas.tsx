/* eslint-disable @typescript-eslint/no-explicit-any */
// File: src/components/sections/EquipesViaturas.tsx
import { useEffect, useState } from "react";
import { FireTruckIcon } from "@phosphor-icons/react";
import axios from "axios";
import { BoxInfo, SectionTitle, Grid, Field } from "../../../components/EstilosPainel.styles";

interface EquipesViaturasProps {
  unidade: string;
  setUnidade: (value: string) => void;
  numeracaoViatura: string;
  setNumeracaoViatura: (value: string) => void;
}

export function EquipesViaturas(props: EquipesViaturasProps) {
  const [unidadesOperacionais, setUnidadesOperacionais] = useState<
    { id: number; nome: string; sigla: string; pontoBase: string }[]
  >([]);
  const [loadingUnidades, setLoadingUnidades] = useState<boolean>(true);
  const [viaturas, setViaturas] = useState<any[]>([]);
  const [loadingNumeracaoViatura, setLoadingNumeracaoViatura] = useState(false);

  useEffect(() => {
    const fetchViaturas = async () => {
      try {
        const response = await axios.get("https://backend-chama.up.railway.app/viaturas");
        setViaturas(response.data);
      } catch (error) {
        console.error("Erro ao carregar viaturas:", error);
        alert("Erro ao carregar viaturas");
      } finally {
        setLoadingNumeracaoViatura(false);
      }
    };
    fetchViaturas();
  }, []);

  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        const response = await axios.get("https://backend-chama.up.railway.app/unidadesoperacionais");
        setUnidadesOperacionais(response.data);
      } catch (error) {
        console.error("Erro ao carregar unidades:", error);
        alert("Erro ao carregar unidades operacionais");
      } finally {
        setLoadingUnidades(false);
      }
    };
    fetchUnidades();
  }, []);

  return (
    <BoxInfo>
      <SectionTitle><FireTruckIcon size={22} weight="fill" /> Equipes e Viaturas</SectionTitle>
      <Grid>
        <Field>
          <label className="required">Unidade Operacional</label>
          {loadingUnidades ? (
            <select disabled>
              <option>Carregando unidades...</option>
            </select>
          ) : (
            <select
              value={props.unidade}
              onChange={(e) => props.setUnidade(e.target.value)}
              required
            >
              <option value="">Selecione a unidade</option>
              {unidadesOperacionais.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome} ({u.pontoBase})
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field>
          <label className="required">Número da Viatura</label>
          {loadingNumeracaoViatura ? (
            <select disabled>
              <option>Carregando viaturas...</option>
            </select>
          ) : (
            <select
              value={props.numeracaoViatura}
              onChange={(e) => props.setNumeracaoViatura(e.target.value)}
              required
            >
              <option value="">Selecione a numeração da viatura</option>
              {viaturas.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.tipo} - {v.numero}
                </option>
              ))}
            </select>
          )}
        </Field>
      </Grid>
    </BoxInfo>
  );
}