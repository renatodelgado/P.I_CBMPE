import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Container, Input, Button, Wrapper, Background, LogoLogin, Header, ContainerContent, Label, RememberMe, Checkbox, InputWrapper, InputIcon } from "./Login.styles";
import logoImg from "../assets/logo 1.png";
import userIcon from "../assets/clipboard.svg";
import lockIcon from "../assets/lock.svg";

export function Login() {
  const auth = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (!auth) return null;

  const handleLogin = () => auth.login(username, password);

  return (
    <Background>
      <Wrapper>
        <LogoLogin src={logoImg} alt="Logo" />
        <Header>
          <h1>Chama</h1>
          <h2>Sistema de Gestão de Ocorrências CBMPE</h2>
        </Header>
        <Container>
          <ContainerContent>
            <Label>Matrícula</Label>
            <InputWrapper>
              <InputIcon src={userIcon} alt="Ícone" />
              <Input
                type="text"
                placeholder="Digite sua matrícula"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </InputWrapper>

            <Label>Senha</Label>
            <InputWrapper>
              <InputIcon src={lockIcon} alt="Ícone" />
              <Input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            </InputWrapper>
            
          </ContainerContent>
          <RememberMe>
            <Checkbox />
            <p>Lembrar de mim</p>
            <p style={{ marginLeft: 'auto' }}>
              <a href="#">Esqueci minha senha</a>
            </p>
          </RememberMe>
          <Button onClick={handleLogin}>Entrar</Button>

        </Container>
      </Wrapper>
    </Background>


  );
}
