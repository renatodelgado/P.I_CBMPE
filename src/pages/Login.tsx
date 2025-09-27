import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Container, Input, Button, Wrapper } from "./Login.styles";

export function Login() {
  const auth = useContext(AuthContext);
  const [username, setUsername] = useState("");

  if (!auth) return null;

  const handleLogin = () => auth.login(username);

  return (
    <Wrapper>
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
    
  );
}
