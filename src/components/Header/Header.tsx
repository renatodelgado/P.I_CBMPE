/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Brand,
  BrandLogo,
  BrandText,
  BrandTitle,
  BrandSubtitle,
  Menu,
  MenuItem,
  MenuItemContainer,
  Submenu,
  SubmenuItem,
  RightSection,
  MenuToggle,
  MobileMenu,
  MobileMenuItem,
  MobileSubmenu,
  SyncButton,
} from "./Header.styles";
import logoImg from "../../assets/logo.svg";
import { 
  PlusIcon, 
  UserPlusIcon, 
  PencilSimpleIcon, 
  ListIcon, 
  XIcon, 
  HouseSimpleIcon, 
  UsersIcon, 
  ChartBarIcon,
  CloudArrowUpIcon 
} from "@phosphor-icons/react";
import { UserDropdown } from "../UserDropdown/UserDropdown";
import { NotificationsDropdown } from "../NotificationsDropdown/NotificationsDropdown";
import { useOnlineStatus } from "../../utils/useOnlineStatus";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isOnline = useOnlineStatus();
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [draftsCount, setDraftsCount] = useState(0);

  const menuItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      to: "/dashboard",
      children: [
        { key: "home", label: "Início", to: "/dashboard", icon: <HouseSimpleIcon size={16} weight="bold" /> },
      ],
    },
    {
      key: "ocorrencias",
      label: "Ocorrências",
      to: "/ocorrencias",
      children: [
        { key: "listar", label: "Listar Ocorrências", to: "/ocorrencias", icon: <ChartBarIcon size={16} weight="bold" /> },
        { key: "cadastrar", label: "Cadastrar Ocorrência", to: "/ocorrencias/nova", icon: <PlusIcon size={16} weight="bold" /> },
        { key: "minhas", label: "Minhas Ocorrências", to: "/ocorrencias/minhas", icon: <UsersIcon size={16} weight="bold" /> },
      ],
    },
    {
      key: "usuarios",
      label: "Usuários",
      to: "/usuarios",
      children: [
        { key: "gestaoUsuarios", label: "Gestão de Usuários", to: "/usuarios", icon: <UsersIcon size={16} weight="bold" /> },
        { key: "cadastrarUsuario", label: "Cadastrar Usuário", to: "/usuarios/cadastrar", icon: <UserPlusIcon size={16} weight="bold" /> },
        { key: "editarUsuario", label: "Editar Usuário", to: "/usuarios/editar", icon: <PencilSimpleIcon size={16} weight="bold" /> },
      ],
    },
    {
      key: "auditoria",
      label: "Auditoria",
      to: "/auditoria",
      children: [],
    },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubs, setMobileSubs] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(menuItems.map((m) => [m.key, false]))
  );

  // Atualizar contagem de drafts periodicamente
  useEffect(() => {
    const updateDraftsCount = () => {
      try {
        const drafts = localStorage.getItem('ocorrenciaDrafts');
        const parsedDrafts = drafts ? JSON.parse(drafts) : [];
        setDraftsCount(parsedDrafts.length);
      } catch {
        setDraftsCount(0);
      }
    };

    updateDraftsCount();
    
    // Verificar a cada 2 segundos
    const intervalId = setInterval(updateDraftsCount, 2000);
    
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Fecha o menu mobile ao mudar de rota
    setMobileOpen(false);
    // opcional: fechar submenus quando navegar
    setMobileSubs(Object.fromEntries(menuItems.map((m) => [m.key, false])));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  function toggleSub(key: string) {
    setMobileSubs((s) => {
      // abre/fecha apenas o submenu alvo (útil em mobile)
      const next = { ...s };
      next[key] = !s[key];
      return next;
    });
  }

  const handleSyncClick = async () => {
    console.log("🔄 Botão de sync clicado");
    console.log("📡 Status online:", isOnline);
    
    if (isSyncing) {
      console.log("⏳ Sync já em andamento...");
      return;
    }
    
    if (!isOnline) {
      alert("📡 Você está offline. Conecte-se à internet para sincronizar.");
      return;
    }

    // Verificar se há drafts para sincronizar
    const drafts = localStorage.getItem('ocorrenciaDrafts');
    const parsedDrafts = drafts ? JSON.parse(drafts) : [];
    
    console.log("📋 Drafts encontrados:", parsedDrafts.length);
    
    if (parsedDrafts.length === 0) {
      alert("✅ Não há ocorrências pendentes para sincronizar.");
      return;
    }

    setIsSyncing(true);
    
    try {
      // Verificar se a função forceSync existe
      if (typeof (window as any).forceSync === 'function') {
        console.log("🚀 Chamando forceSync...");
        
        // Criar uma promise para aguardar a sincronização
        await new Promise((resolve, reject) => {
          const originalForceSync = (window as any).forceSync;
          
          // Substituir temporariamente a função para capturar o resultado
          (window as any).forceSync = async () => {
            try {
              await originalForceSync();
              resolve(true);
            } catch (error) {
              reject(error);
            } finally {
              // Restaurar a função original
              (window as any).forceSync = originalForceSync;
            }
          };
          
          // Chamar a função
          (window as any).forceSync();
        });
        
        console.log("✅ Sincronização concluída");
        alert(`✅ ${parsedDrafts.length} ocorrência${parsedDrafts.length > 1 ? 's' : ''} sincronizada${parsedDrafts.length > 1 ? 's' : ''} com sucesso!`);
        
      } else {
        console.error("❌ forceSync não encontrado no window");
        throw new Error("Função de sincronização não disponível. Recarregue a página.");
      }
    } catch (error) {
      console.error("❌ Erro ao sincronizar:", error);
      alert("❌ Erro ao sincronizar. Verifique o console para detalhes.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Função para debug - verificar se tudo está funcionando
  const checkSyncStatus = () => {
    console.log("=== DEBUG SYNC STATUS ===");
    console.log("📡 Online:", isOnline);
    console.log("🔄 Is Syncing:", isSyncing);
    console.log("📋 Drafts Count:", draftsCount);
    console.log("🔧 forceSync exists:", typeof (window as any).forceSync === 'function');
    console.log("💾 Drafts in localStorage:", localStorage.getItem('ocorrenciaDrafts'));
    console.log("========================");
  };

  // Expor função de debug no console
  useEffect(() => {
    (window as any).debugSync = checkSyncStatus;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Brand>
        <BrandLogo src={logoImg} alt="Logo" onClick={() => navigate("/")} />

        <BrandText>
          <BrandTitle>Chama</BrandTitle>
          <BrandSubtitle>Gestão de Ocorrências - CBMPE</BrandSubtitle>
        </BrandText>
      </Brand>

      {/* DESKTOP MENU */}
      <Menu aria-hidden={mobileOpen}>
        {menuItems.map((item) => (
          <MenuItemContainer key={item.key}>
            <MenuItem as={Link} to={item.to}>
              {item.label}
            </MenuItem>

            {item.children && item.children.length > 0 && (
              <Submenu>
                {item.children.map((child) => (
                  <SubmenuItem as={Link} key={child.key} to={child.to}>
                    {child.icon && <span className="icon">{child.icon}</span>}
                    {child.label}
                  </SubmenuItem>
                ))}
              </Submenu>
            )}
          </MenuItemContainer>
        ))}
      </Menu>

      {/* Right */}
      <RightSection>
        {/* Botão de Sincronização */}
        {draftsCount > 0 && (
          <SyncButton 
            onClick={handleSyncClick}
            title={`Sincronizar ${draftsCount} ocorrência${draftsCount > 1 ? 's' : ''} pendente${draftsCount > 1 ? 's' : ''}`}
            $isOnline={isOnline}
            $hasDrafts={draftsCount > 0}
            $isSyncing={isSyncing}
            disabled={!isOnline || isSyncing || draftsCount === 0}
          >
            <CloudArrowUpIcon 
              size={18} 
              weight={isOnline ? "fill" : "regular"} 
              className={isSyncing ? "spin" : ""} 
            />
            <span className="sync-text">
              {isSyncing ? 'Sincronizando...' : (isOnline ? 'Sincronizar' : 'Offline')}
            </span>
            {draftsCount > 0 && !isSyncing && (
              <span className="drafts-badge">
                {draftsCount}
              </span>
            )}
          </SyncButton>
        )}

        <NotificationsDropdown />

        <UserDropdown />

        <MenuToggle
          onClick={() => setMobileOpen((s) => !s)}
          aria-label="menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          {mobileOpen ? <XIcon size={20} weight="bold" /> : <ListIcon size={20} weight="bold" />}
        </MenuToggle>
      </RightSection>

      {/* MOBILE MENU */}
      <MobileMenu id="mobile-menu" open={mobileOpen} role="menu" aria-hidden={!mobileOpen}>
        {menuItems.map((item) => {
          const hasChildren = Array.isArray(item.children) && item.children.length > 0;
          return (
            <div key={item.key}>
              {hasChildren ? (
                <>
                  <MobileMenuItem onClick={() => toggleSub(item.key)}>
                    {item.label}
                    <span>{mobileSubs[item.key] ? "▴" : "▾"}</span>
                  </MobileMenuItem>
                  <MobileSubmenu open={mobileSubs[item.key]}>
                    {item.children!.map((child) => (
                      <SubmenuItem
                        as={Link}
                        key={child.key}
                        to={child.to}
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.icon && <span className="icon">{child.icon}</span>}
                        {child.label}
                      </SubmenuItem>
                    ))}
                  </MobileSubmenu>
                </>
              ) : (
                <MobileMenuItem as={Link} to={item.to} onClick={() => setMobileOpen(false)}>
                  {item.label}
                </MobileMenuItem>
              )}
            </div>
          );
        })}

        {/* Botão de Sincronização no Mobile Menu */}
        {draftsCount > 0 && (
          <div style={{ marginTop: '16px', padding: '0 16px' }}>
            <SyncButton 
              onClick={handleSyncClick}
              title={`Sincronizar ${draftsCount} ocorrência${draftsCount > 1 ? 's' : ''} pendente${draftsCount > 1 ? 's' : ''}`}
              $isOnline={isOnline}
              $hasDrafts={draftsCount > 0}
              $isSyncing={isSyncing}
              disabled={!isOnline || isSyncing || draftsCount === 0}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <CloudArrowUpIcon 
                size={18} 
                weight={isOnline ? "fill" : "regular"} 
                className={isSyncing ? "spin" : ""} 
              />
              <span className="sync-text">
                {isSyncing ? 'Sincronizando...' : (isOnline ? `Sincronizar (${draftsCount})` : `Offline (${draftsCount})`)}
              </span>
            </SyncButton>
          </div>
        )}
      </MobileMenu>
    </Container>
  );
}