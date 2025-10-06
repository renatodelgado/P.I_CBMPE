import { Container, Logo, Menu, MenuItem } from "./Header.styles";
import logoImg from "../assets/logo 1.png";
import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();

  return (
    <Container>
      <Logo src={logoImg} alt="Logo" onClick={() => navigate("/")} />
      <Menu>
        <MenuItem onClick={() => navigate("/dashboard")}>Dashboard</MenuItem>
        <MenuItem onClick={() => navigate("/ocorrencias")}>Ocorrências</MenuItem>
        <MenuItem onClick={() => navigate("/relatorios")}>Relatórios</MenuItem>
        <MenuItem onClick={() => navigate("/auditoria")}>Auditoria</MenuItem>
        <MenuItem onClick={() => navigate("/usuarios")}>Usuários</MenuItem>
      </Menu>
    </Container>
  );
}
