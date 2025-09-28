import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Container, Input, Button, Wrapper, Background, LogoLogin, Header } from "./Login.styles";
import logoImg from "../assets/logo 1.png";

export function Login() {
  const auth = useContext(AuthContext);
  const [username, setUsername] = useState("");

  if (!auth) return null;

  const handleLogin = () => auth.login(username);

  return (
    <Background>
      <Wrapper>
        <LogoLogin src={logoImg} alt="Logo" />
        <Header>
          <h1>Chama</h1>
          <h2>Sistema de Gestão de Ocorrências CBMPE</h2>
        </Header>
        <Container>
      <h2>Matrícula</h2>
      <Input
        type="text"
        placeholder="Digite sua matrícula"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button onClick={handleLogin}>Entrar</Button>
    </Container>
    </Wrapper>
    </Background>
    
    
  );
}
