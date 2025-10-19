import styled from "styled-components";

export const Avatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.95rem;
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.1;
`;

export const ProfileName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
`;

export const ProfileRole = styled.span`
  font-size: 12px;
  color: #cbd5e1;
`;

export const DropdownContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  /* Responsividade: em telas pequenas mostrar só avatar (esconder nome/cargo) */
  @media (max-width: 720px) {
    ${ProfileInfo} {
      display: none;
    }

    ${Avatar} {
      width: 34px;
      height: 34px;
      font-size: 0.85rem;
    }
  }
`;

export const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: #fff;
  padding: 4px 8px;
  border-radius: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: #ffffff;
  border-radius: 8px;
  min-width: 210px;
  box-shadow: 0 6px 24px rgba(15, 23, 42, 0.25);
  z-index: 2000;
  padding: 6px 0;
  animation: fadeIn 0.15s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Ajuste em telas pequenas para não estourar a largura */
  @media (max-width: 480px) {
    right: 8px;
    min-width: 160px;
  }
`;

export const DropdownItem = styled.a<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ $danger }) => ($danger ? "#dc2626" : "#0f172a")};
  font-size: 14px;
  padding: 10px 14px;
  text-decoration: none;
  transition: background 0.12s ease;
  cursor: pointer;

  &:hover {
    background: rgba(15, 23, 42, 0.04);
  }

  svg {
    flex-shrink: 0;
  }
`;

export const Divider = styled.div`
  height: 1px;
  background: rgba(15, 23, 42, 0.08);
  margin: 4px 0;
`;