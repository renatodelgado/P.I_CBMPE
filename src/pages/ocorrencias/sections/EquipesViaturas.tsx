/* eslint-disable @typescript-eslint/no-explicit-any */
// File: src/components/sections/EquipesViaturas.tsx
import { useEffect, useState } from "react";
import { FireTruckIcon } from "@phosphor-icons/react";
import { BoxInfo, SectionTitle, Grid, Field } from "../../../components/EstilosPainel.styles";
import {
  TeamSection,
  TeamLabel,
  TeamColumns,
  TeamColumn,
  TeamSearchWrapper,
  TeamSearchInput,
  TeamResults,
  TeamBox,
  TeamChip,
  TeamPlaceholder,
} from "../../../components/EstilosPainel.styles";
import { fetchViaturas, fetchUnidadesOperacionais, fetchUsuarios } from "../../../services/api";
import type { Usuario } from "../../../services/api";



interface EquipesViaturasProps {
  unidade: string;
  setUnidade: (value: string) => void;
  numeracaoViatura: string;
  setNumeracaoViatura: (value: string) => void;
  onTeamMembersChange?: (members: Usuario[]) => void;
  initialTeamMembers?: Usuario[];
}

export function EquipesViaturas(props: EquipesViaturasProps) {
  const [unidadesOperacionais, setUnidadesOperacionais] = useState<
    { id: number; nome: string; sigla: string; pontoBase: string }[]
  >([]);
  const [loadingUnidades, setLoadingUnidades] = useState<boolean>(true);
  const [viaturas, setViaturas] = useState<any[]>([]);
  const [loadingNumeracaoViatura, setLoadingNumeracaoViatura] = useState(false);
  // busca / seleção de equipe (agora dentro deste componente)
  const [allUsers, setAllUsers] = useState<Usuario[]>([]);
  const [teamQuery, setTeamQuery] = useState("");
const [teamMembers, setTeamMembers] = useState<Usuario[]>(
    props.initialTeamMembers || []
  );
  useEffect(() => {
    props.onTeamMembersChange?.(teamMembers);
  }, [teamMembers, props]);

  // Carrega usuários apenas uma vez
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const users = await fetchUsuarios();
        if (mounted) setAllUsers(Array.isArray(users) ? users : []);
      } catch (err) {
        console.error("Falha ao carregar usuários:", err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // notificar o componente pai quando a equipe mudar
  useEffect(() => {
    props.onTeamMembersChange?.(teamMembers);
  }, [props, teamMembers]);

  const filteredUsers = allUsers
    .filter(u => !teamMembers.find(m => m.id === u.id))
    .filter(u => {
      if (!teamQuery) return true;
      const q = teamQuery.toLowerCase();
      return (u.nome || "").toLowerCase().includes(q) ||
             (u.matricula || "").toLowerCase().includes(q) ||
             (u.email || "").toLowerCase().includes(q);
    })
    .slice(0, 8);

  const handleAddToTeam = (user: Usuario) => {
    if (!user || teamMembers.find(m => m.id === user.id)) return;
    setTeamMembers(prev => [...prev, user]);
    setTeamQuery("");
  };

  const handleRemoveTeamMember = (id?: number) => {
    if (!id) return;
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  useEffect(() => {
    const fetchViaturasData = async () => {
      try {
        const data = await fetchViaturas();
        setViaturas(data);
      } catch (error) {
        console.error("Erro ao carregar viaturas:", error);
        alert("Erro ao carregar viaturas");
      } finally {
        setLoadingNumeracaoViatura(false);
      }
    };
    fetchViaturasData();
  }, []);

  useEffect(() => {
    const fetchUnidadesData = async () => {
      try {
        const data = await fetchUnidadesOperacionais();
        setUnidadesOperacionais(data);
      } catch (error) {
        console.error("Erro ao carregar unidades:", error);
        alert("Erro ao carregar unidades operacionais");
      } finally {
        setLoadingUnidades(false);
      }
    };
    fetchUnidadesData();
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
<br/>
      <Grid>
<Field>
      <TeamSection>
        <TeamLabel>Equipe relacionada</TeamLabel>
        <TeamColumns>
          <TeamColumn minWidth={260}>
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
                    <div key={u.id} onClick={() => handleAddToTeam(u)} role="option" tabIndex={0}>
                      {u.nome} {u.matricula ? `- ${u.matricula}` : ""} {u.email ? `(${u.email})` : ""}
                    </div>
                  ))}
                </TeamResults>
              )}
            </TeamSearchWrapper>
          </TeamColumn>

          <TeamColumn minWidth={220}>
            <TeamBox>
              {teamMembers.length === 0 ? (
                <TeamPlaceholder>Nenhum membro adicionado</TeamPlaceholder>
              ) : (
                teamMembers.map((m) => (
                  <TeamChip key={m.id}>
                    <span>{m.nome}{m.matricula ? ` • ${m.matricula}` : ""}</span>
                    <button onClick={() => handleRemoveTeamMember(m.id)} aria-label="Remover membro">✕</button>
                  </TeamChip>
                ))
              )}
            </TeamBox>
          </TeamColumn>
        </TeamColumns>
      </TeamSection>
      </Field>
      </Grid>
    </BoxInfo>
  );
}