import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Input,
  Button,
  Wrapper,
  Background,
  LogoLogin,
  Header,
  ContainerContent,
  Label,
  RememberMe,
  Checkbox,
  InputWrapper,
  InputIcon,
  DivLogin,
  ForgotPassword,
  RememberMeForgotPassword,
} from "./Login.styles";
import logoImg from "../assets/logo.svg";
import userIcon from "../assets/clipboard.svg";
import lockIcon from "../assets/lock.svg";
import { useNavigate } from "react-router-dom";

export function Login() {
  const auth = useContext(AuthContext);
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  if (!auth) return null;

  const handleLogin = async () => {
    if (!matricula || !senha) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    try {
      await auth.login(matricula, senha);
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Usuário ou senha inválidos.");
    }
  };

  return (
    <Background>
      <DivLogin>
        <Wrapper>
          <LogoLogin src={logoImg} alt="Logo" />
          <Header>
            <h1>Chama</h1>
            <h2>Sistema de Gestão de Ocorrências CBMPE</h2>
          </Header>

          <ContainerContent>
            <Label>Matrícula</Label>
            <InputWrapper>
              <InputIcon src={userIcon} alt="Ícone de usuário" />
              <Input
                type="text"
                placeholder="Digite sua matrícula"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
              />
            </InputWrapper>

            <Label>Senha</Label>
            <InputWrapper>
              <InputIcon src={lockIcon} alt="Ícone de cadeado" />
              <Input
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </InputWrapper>
          </ContainerContent>

          <RememberMeForgotPassword>
            <RememberMe>
              <Checkbox />
              <p>Lembrar de mim</p>
            </RememberMe>
            <ForgotPassword>
              <p style={{ marginLeft: "auto" }}>
                <a href="#">Esqueci minha senha</a>
              </p>
            </ForgotPassword>
          </RememberMeForgotPassword>

          <Button onClick={handleLogin}>Entrar</Button>
        </Wrapper>
      </DivLogin>
    </Background>
  );
}
