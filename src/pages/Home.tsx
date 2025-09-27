import { Button } from "../components/Button";

export function Home() {
  return (
    <div>
      <h1>Bem-vindo ao P.I.CBMPE 🚒</h1>
      <Button text="Clique aqui" onClick={() => alert("Funcionando!")} />
    </div>
  );
}
