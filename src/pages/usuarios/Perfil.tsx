// src/pages/Perfil/PerfilPage.tsx
import { useContext, useEffect, useState } from "react";
import {
  ContainerPainel,
  PageTitle,
  PageSubtitle,
  BoxInfo,
  ResponsiveRow,
  GridColumn,
  PageTopHeaderRow,
  PageTopHeaderColumn,
  ActionsRow,
} from "../../components/EstilosPainel.styles";
import { Button } from "../../components/Button";
import { AuthContext } from "../../context/AuthContext";
import { fetchUsuario } from "../../services/api";
import {
  User,
  Envelope,
  IdentificationCard,
  ShieldCheck,
  Buildings,
  CheckCircle,
  XCircle,
  Camera,
} from "@phosphor-icons/react";
import styled from "styled-components";

const AvatarWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Avatar = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  overflow: hidden;
  border: 5px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: #e2e8f0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CameraButton = styled.button`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: #dc2625;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;

  &:hover {
    background: #b91c1c;
    transform: scale(1.1);
  }
`;

const StatusBadge = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  background: ${(p) => (p.active ? "#dcfce7" : "#fee2e2")};
  color: ${(p) => (p.active ? "#166534" : "#991b1b")};
  font-weight: 600;
  font-size: 0.95rem;
  margin: 1.5rem auto;
  width: fit-content;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }

  svg {
    color: #64748b;
    width: 22px;
    height: 22px;
    flex-shrink: 0;
  }
`;

const InfoLabel = styled.span`
  font-weight: 500;
  color: #475569;
  display: block;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.span`
  color: #1e293b;
  font-weight: 600;
  display: block;
`;

export function PerfilPage() {
  const auth = useContext(AuthContext);
  const [usuario, setUsuario] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper seguro para ler campos dinâmicos sem usar `any`
  const getFromObject = (obj: unknown, key: string): unknown => {
    if (!obj || typeof obj !== "object") return undefined;
    const o = obj as Record<string, unknown>;
    if (key in o && o[key] !== undefined && o[key] !== null) return o[key];
    return undefined;
  };

  const getField = (keys: string[], source: Record<string, unknown> | null = auth?.user as Record<string, unknown> | null): unknown => {
    if (!source) return null;
    for (const key of keys) {
      const direct = getFromObject(source, key);
      if (direct !== undefined) return direct;

      const usuarioObj = getFromObject(source, "usuario");
      if (usuarioObj && typeof usuarioObj === "object") {
        const v = getFromObject(usuarioObj, key);
        if (v !== undefined) return v;
      }

      const userObj = getFromObject(source, "user");
      if (userObj && typeof userObj === "object") {
        const v = getFromObject(userObj, key);
        if (v !== undefined) return v;
      }
    }
    return null;
  };

  // helper to read from `usuario` state (which may come from fetchUsuario or from auth.user)
  const getUsuarioField = (keys: string[]): unknown => {
    if (!usuario) return getField(keys);
    for (const key of keys) {
      const direct = getFromObject(usuario, key);
      if (direct !== undefined) return direct;

      const usuarioObj = getFromObject(usuario, "usuario");
      if (usuarioObj && typeof usuarioObj === "object") {
        const v = getFromObject(usuarioObj, key);
        if (v !== undefined) return v;
      }

      const userObj = getFromObject(usuario, "user");
      if (userObj && typeof userObj === "object") {
        const v = getFromObject(userObj, key);
        if (v !== undefined) return v;
      }
    }
    return null;
  };

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const id = getField(["id", "usuarioId", "userId"]);
        if (!id) {
          setUsuario(auth?.user as Record<string, unknown> | null);
          return;
        }

        const data = await fetchUsuario(Number(id));
        setUsuario(data as Record<string, unknown> | null);
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
        // fallback para dados que já estão no AuthContext
        setUsuario(auth?.user as Record<string, unknown> | null);
      } finally {
        setLoading(false);
      }
    };

    carregarPerfil();
  }, [auth?.user]);

  if (loading) {
    return (
      <ContainerPainel>
        <p style={{ textAlign: "center", marginTop: "4rem" }}>Carregando perfil...</p>
      </ContainerPainel>
    );
  }

  if (!usuario) {
    return (
      <ContainerPainel>
        <p style={{ textAlign: "center", marginTop: "4rem", color: "#dc2625" }}>
          Usuário não encontrado
        </p>
      </ContainerPainel>
    );
  }

  const nome = (getUsuarioField(["nome", "name", "fullName", "username"]) as string) || "Usuário";
  const matricula = (getUsuarioField(["matricula", "registration"]) as string) || "Não informada";
  const email = (getUsuarioField(["email", "emailAddress"]) as string) || "Não informado";

  const perfilNomeRaw = getFromObject(usuario ?? auth?.user, "perfil") ?? getUsuarioField(["perfilNome", "role", "cargo"]);
  // perfil pode ser objeto { id, nome } ou id numérico ou string com nome
  let perfilNome = "Não definido";
  if (perfilNomeRaw) {
    if (typeof perfilNomeRaw === "object") {
      const pn = getFromObject(perfilNomeRaw, "nome") ?? getFromObject(perfilNomeRaw, "name");
      if (typeof pn === "string") perfilNome = pn;
    } else if (typeof perfilNomeRaw === "string") {
      perfilNome = perfilNomeRaw;
    } else if (typeof perfilNomeRaw === "number") {
      // tentaremos buscar pelo id via fetchPerfis no UserDropdown; aqui apenas mostraremos o id
      perfilNome = String(perfilNomeRaw);
    }
  }

  const unidadeNomeRaw = getFromObject(usuario ?? auth?.user, "unidadeOperacional") ?? getUsuarioField(["unidadeNome", "unidade"]);
  let unidadeNome = "Não definida";
  if (unidadeNomeRaw && typeof unidadeNomeRaw === "object") {
    const un = getFromObject(unidadeNomeRaw, "nome");
    if (typeof un === "string") unidadeNome = un;
  } else if (typeof unidadeNomeRaw === "string") {
    unidadeNome = unidadeNomeRaw;
  }

  const statusVal = getFromObject(usuario ?? auth?.user, "status");
  const status = Boolean(statusVal ?? true);
  const ultimoAcessoRaw = getFromObject(usuario ?? auth?.user, "ultimoAcesso");
  const ultimoAcesso = typeof ultimoAcessoRaw === "string" ? new Date(ultimoAcessoRaw).toLocaleString("pt-BR") : "Nunca acessou";

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    nome
  )}&background=dc2625&color=fff&bold=true&size=256`;

  return (
    <ContainerPainel>
      <PageTopHeaderRow>
        <PageTopHeaderColumn>
          <PageTitle>Meu Perfil</PageTitle>
          <PageSubtitle>Visualize e edite suas informações pessoais</PageSubtitle>
        </PageTopHeaderColumn>
      </PageTopHeaderRow>

      <ResponsiveRow>
        <GridColumn>
          <BoxInfo>
            {/* Avatar + Nome */}
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <AvatarWrapper>
                <Avatar>
                  <img src={avatarUrl} alt={nome} />
                </Avatar>
                {/* Botão de câmera (pode ser funcional no futuro) */}
                <CameraButton>
                  <Camera size={20} weight="fill" />
                </CameraButton>
              </AvatarWrapper>

              <h2 style={{ margin: "1rem 0 0.25rem", fontSize: "1.8rem", color: "#0b1220" }}>
                {nome}
              </h2>
              <p style={{ color: "#64748b", fontSize: "1rem" }}>{matricula}</p>
            </div>

            {/* Status */}
            <StatusBadge active={status}>
              {status ? (
                <>
                  <CheckCircle size={22} weight="fill" />
                  Ativo
                </>
              ) : (
                <>
                  <XCircle size={22} weight="fill" />
                  Inativo
                </>
              )}
            </StatusBadge>

            {/* Informações */}
            <div style={{ marginTop: "2rem" }}>
              <InfoRow>
                <IdentificationCard />
                <div style={{ flex: 1 }}>
                  <InfoLabel>Matrícula</InfoLabel>
                  <InfoValue>{matricula}</InfoValue>
                </div>
              </InfoRow>

              <InfoRow>
                <Envelope />
                <div style={{ flex: 1 }}>
                  <InfoLabel>E-mail</InfoLabel>
                  <InfoValue>{email}</InfoValue>
                </div>
              </InfoRow>

              <InfoRow>
                <ShieldCheck />
                <div style={{ flex: 1 }}>
                  <InfoLabel>Perfil de Acesso</InfoLabel>
                  <InfoValue>{perfilNome}</InfoValue>
                </div>
              </InfoRow>

              <InfoRow>
                <Buildings />
                <div style={{ flex: 1 }}>
                  <InfoLabel>Unidade Operacional</InfoLabel>
                  <InfoValue>{unidadeNome}</InfoValue>
                </div>
              </InfoRow>

              <InfoRow>
                <User />
                <div style={{ flex: 1 }}>
                  <InfoLabel>Último Acesso</InfoLabel>
                  <InfoValue>{ultimoAcesso}</InfoValue>
                </div>
              </InfoRow>
            </div>

            {/* Botão Editar */}
            <ActionsRow style={{ marginTop: "2rem" }}>
              <Button
                variant="danger"
                text="Editar Perfil"
                onClick={() => {
                  // futura rota de edição
                  alert("Funcionalidade de edição em desenvolvimento");
                }}
              />
            </ActionsRow>
          </BoxInfo>
        </GridColumn>
      </ResponsiveRow>
    </ContainerPainel>
  );
}