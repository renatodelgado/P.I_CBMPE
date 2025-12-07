import { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  DropdownContainer,
  ProfileButton,
  ProfileInfo,
  Divider,
  ProfileName,
  ProfileRole,
  DropdownMenu,
  DropdownItem,
    Avatar,
} from "./UserDropdown.styles.ts";
import {
  GearSixIcon,
  QuestionIcon,
  InfoIcon,
  LockIcon,
  SignOutIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import { fetchPerfis } from "../../services/api";

export function UserDropdown() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const auth = useContext(AuthContext);

  const showComingSoon = (message?: string) => {
    setOpen(false);
    try {
      window.alert(message || "Funcionalidade será adicionada em breve.");
    } catch (e) {
      console.error("Erro ao exibir alerta:", e);
      console.info(message || "Funcionalidade será adicionada em breve.");
    }
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // helper to get a field from user object even if nested or differently named
  const getField = (u: Record<string, unknown> | undefined | null, keys: string[]): unknown => {
    if (!u) return undefined;
    // common nested wrappers
    const candidates = [u, u.usuario || u.user || u.data || u.userData];
    for (const c of candidates) {
      if (!c || typeof c !== "object") continue;
      const obj = c as Record<string, unknown>;
      for (const k of keys) {
        if (k in obj && obj[k]) return obj[k];
      }
    }
    for (const k of keys) {
      if (k in u && u[k]) return u[k];
    }
    return undefined;
  };

  // try fetch perfis list so we can resolve perfilId -> perfil.nome
  const [perfisMap, setPerfisMap] = useState<Record<number, string>>({});
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const ps = await fetchPerfis();
        if (!mounted) return;
        const map: Record<number, string> = {};
        if (Array.isArray(ps)) {
          ps.forEach((p: Record<string, unknown>) => {
            if (p && typeof p.id !== "undefined") map[Number(p.id)] = (p.nome as string) || (p.name as string) || String(p.id);
          });
        }
        setPerfisMap(map);
      } catch (error) {
        console.error("Erro ao buscar perfis:", error);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const username = (getField(auth?.user, ["nome", "name", "fullName", "usuarioNome", "matricula", "username"]) as string) || "Usuário";

  // try to obtain the user's profile/role in this order:
  // 1) user.perfil?.nome (common backend shape)
  // 2) perfilNome / perfil_name fields
  // 3) patente / funcao / role / cargo
  // 4) fallback to status (Ativo/Inativo) or generic "Usuário"
  const ua = auth?.user as Record<string, unknown>;
  const perfilObj = (ua?.perfil || ua?.profile || ua?.userProfile) as Record<string, unknown> | undefined;
  const perfilNome = (perfilObj?.nome || perfilObj?.name || ua?.perfilNome || ua?.perfil_name || (ua?.perfil as Record<string, unknown>)?.nome) as string | undefined;

  const perfilId = getField(auth?.user, ["perfilId", "perfil_id", "perfilId", "perfil"]);
  let role = perfilNome || undefined;
  if (!role && perfilId) {
    // caso o backend já envie o nome do perfil (ex: "Administrador"), use diretamente
    if (typeof perfilId === "string" && isNaN(Number(perfilId))) {
      role = perfilId as string;
    } else {
      const idNum = typeof perfilId === "object" ? (perfilId as Record<string, unknown>).id : Number(perfilId);
      if (!Number.isNaN(Number(idNum)) && perfisMap && perfisMap[Number(idNum)]) {
        role = perfisMap[Number(idNum)];
      } else {
        // talvez perfisMap contenha o nome como valor — tentar casar por valor
        if (typeof perfilId === "string") {
          const found = Object.values(perfisMap).find(v => v === perfilId);
          if (found) role = found;
        }
      }
    }
  }
  if (!role) role = (getField(auth?.user, ["patente", "funcao", "role", "cargo"]) as string) || undefined;
  if (!role) {
    if (typeof ua?.status === "boolean") {
      role = ua.status ? "Ativo" : "Inativo";
    } else {
      role = "Usuário";
    }
  }

  useEffect(() => {
    try {
      const resolvedPerfilId = getField(auth?.user, ["perfilId", "perfil_id", "perfil"]);
      console.debug("[UserDropdown] auth.user:", auth?.user);
      console.debug("[UserDropdown] resolvedPerfilId:", resolvedPerfilId);
      console.debug("[UserDropdown] perfisMap:", perfisMap);
    } catch (e) {
      console.debug("[UserDropdown] debug error", e);
    }
  }, [auth?.user, perfisMap]);

  const initials = String(username)
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <DropdownContainer ref={ref}>
      <ProfileButton onClick={() => setOpen((prev) => !prev)}>
        <Avatar>{initials}</Avatar>
        <ProfileInfo>
          <ProfileName>{username}</ProfileName>
          <ProfileRole>{role}</ProfileRole>
        </ProfileInfo>
      </ProfileButton>

      {open && (
        <DropdownMenu>
          <DropdownItem as={Link} to="/perfil">
            <UserCircleIcon size={18} /> Meu Perfil
          </DropdownItem>
          <DropdownItem onClick={() => showComingSoon("Alterar senha: funcionalidade será adicionada em breve.") }>
            <LockIcon size={18} /> Alterar Senha
          </DropdownItem>
          <DropdownItem onClick={() => showComingSoon("Preferências: funcionalidade será adicionada em breve.") }>
            <GearSixIcon size={18} /> Preferências
          </DropdownItem>
          <Divider />
          <DropdownItem onClick={() => showComingSoon("Ajuda: funcionalidade será adicionada em breve.") }>
            <QuestionIcon size={18} /> Ajuda
          </DropdownItem>
          <DropdownItem as={Link} to="/sobre">
            <InfoIcon size={18} /> Sobre o Sistema
          </DropdownItem>
          <Divider />
          <DropdownItem
            onClick={() => {
              // perform logout via context then redirect to login
              if (auth && typeof auth.logout === "function") auth.logout();
              setOpen(false);
              navigate("/", { replace: true });
            }}
            $danger
          >
            <SignOutIcon size={18} /> Sair
          </DropdownItem>
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
}
