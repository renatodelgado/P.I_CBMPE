import styled from "styled-components";

export const Background = styled.div`
  background-color: #1E293B;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  `;

export const Wrapper = styled.div`             
  background-color: #f5f5f5; 
  width: 400px;
  padding: 20px;
  border-radius: 8px;
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;

  h1 {
    margin: 0; 
    font-size: 40px; 
    font-weight: 550;
  }

  h2 {
    margin: 5px 0 0 0; 
    font-size: 16px; 
    font-weight: normal; 
    max-width: 250px;
    margin-left: auto;
    margin-right: auto;
    font-weight: 640;
    
  }
`;

export const Container = styled.div`
  max-width: 400px;
  margin: 2px auto;
  padding: 5px;
`;

export const LogoLogin = styled.img`
  width: 60px;
  display: block;
  margin: 0 auto 2px auto;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

export const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #2563eb;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
