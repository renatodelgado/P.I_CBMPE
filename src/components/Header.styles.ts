import styled from "styled-components";

export const Container = styled.header`
  background-color: #1E293B;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 5%;
  z-index: 10;

`;

export const Logo = styled.img`
  max-height: 50%;
  cursor: pointer;
`;

export const Menu = styled.nav`
  display: flex;
  gap: 16px;

  /* Mobile */
  @media (max-width: 768px) {
    gap: 8px;
  }

  /* Mobile Small */
  @media (max-width: 480px) {
    gap: 4px;
  }
`;

export const MenuItem = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: #e63939;
    background-color: rgba(255, 255, 255, 0.1);
  }

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 12px;
    padding: 6px 8px;
  }

  /* Mobile Small */
  @media (max-width: 480px) {
    font-size: 11px;
    padding: 4px 6px;
  }
`;
