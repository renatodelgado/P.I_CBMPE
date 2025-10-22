
import styled, { css } from "styled-components";

export const PerfilCardContainer = styled.div<{ $ativo?: boolean; $color?: string }>`
  border: 1.8px solid ${({ $ativo, $color }) => ($ativo ? $color || "#dc2625" : "#e2e8f0")};
  background: ${({ $ativo }) => ($ativo ? "#fef2f2" : "#fff")};
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  &:hover {
    border-color: ${({ $color }) => $color || "#dc2625"};
    background: ${({ $ativo }) => ($ativo ? "#fee2e2" : "#f8fafc")};
  }

  ${({ $ativo }) =>
    $ativo &&
    css`
      box-shadow: 0 0 0 3px rgba(220, 38, 37, 0.15);
    `}
`;

export const PerfilTitulo = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
`;

export const PerfilDescricao = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #475569;
  line-height: 1.4;
`;
