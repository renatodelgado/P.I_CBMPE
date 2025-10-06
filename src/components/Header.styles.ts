import styled from "styled-components";

export const Container = styled.header`
  background-color: #1E293B;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 40px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 10;
`;

export const Logo = styled.img`
  width: 45px;
  cursor: pointer;
`;

export const Menu = styled.nav`
  display: flex;
  gap: 24px;
`;

export const MenuItem = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #e63939;
  }
`;
