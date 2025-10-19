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
} from "./Header.styles";
import logoImg from "../../assets/logo.svg";
import { GaugeIcon, ChartBarIcon, PlusIcon, FileTextIcon, UserPlusIcon, PencilSimpleIcon, MagnifyingGlassIcon, ListIcon, XIcon } from "@phosphor-icons/react";
import { UserDropdown } from "../UserDropdown";
import { NotificationsDropdown } from "../NotificationsDropdown/NotificationsDropdown";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      to: "/dashboard",
      children: [
        { key: "overview", label: "Visão Geral", to: "/dashboard/overview", icon: <GaugeIcon size={16} weight="bold" /> },
        { key: "stats", label: "Estatísticas", to: "/dashboard/stats", icon: <ChartBarIcon size={16} weight="bold" /> },
      ],
    },
    {
      key: "ocorrencias",
      label: "Ocorrências",
      to: "/ocorrencias",
      children: [
        { key: "cadastrar", label: "Cadastrar Ocorrência", to: "/ocorrencias/cadastrar", icon: <PlusIcon size={16} weight="bold" /> },
      ],
    },
    {
      key: "relatorios",
      label: "Relatórios",
      to: "/relatorios",
      children: [
        { key: "rapido", label: "Relatório Rápido", to: "/relatorios/placeholder1", icon: <FileTextIcon size={16} weight="bold" /> },
      ],
    },
    {
      key: "usuario",
      label: "Usuário",
      to: "/usuario",
      children: [
        { key: "cadastrarUsuario", label: "Cadastrar Usuário", to: "/usuarios/cadastrar", icon: <UserPlusIcon size={16} weight="bold" /> },
        { key: "editarUsuario", label: "Editar Usuário", to: "/usuarios/editar", icon: <PencilSimpleIcon size={16} weight="bold" /> },
      ],
    },
    {
      key: "auditoria",
      label: "Auditoria",
      to: "/auditoria",
      children: [
        { key: "ver", label: "Visualizar Auditoria", to: "/auditoria/placeholder", icon: <MagnifyingGlassIcon size={16} weight="bold" /> },
      ],
    },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubs, setMobileSubs] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(menuItems.map((m) => [m.key, false]))
  );

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
      </MobileMenu>
    </Container>
  );
}
