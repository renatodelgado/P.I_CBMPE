import { PerfilCardContainer, PerfilTitulo, PerfilDescricao } from "./NewUserPerfilCard.styles";

type PerfilCardProps = {
  titulo: string;
  descricao: string;
  ativo?: boolean;
  onClick?: () => void;
  color?: string; // opcional, cor de destaque
};

export function PerfilCard({ titulo, descricao, ativo, onClick, color }: PerfilCardProps) {
  return (
    <PerfilCardContainer
      onClick={onClick}
      $ativo={ativo}
      $color={color}
    >
      <PerfilTitulo>{titulo}</PerfilTitulo>
      <PerfilDescricao>{descricao}</PerfilDescricao>
    </PerfilCardContainer>
  );
}
