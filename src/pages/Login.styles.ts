import styled from "styled-components";

export const Background = styled.body`
  background-color: #1E293B;
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
  margin-right: 20px;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  h2 {
    margin: 10px 0; 
    font-size: 16px;
    font-weight: 600;
  }
`;

export const ContainerContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`
export const Label = styled.h2`
  align-self: flex-start; 
  font-size: 16px;
  font-weight: 600;
`;

export const LogoLogin = styled.img`
  width: 60px;
  display: block;
  margin: 0 auto 2px auto;
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 8px;
`;

export const InputIcon = styled.img`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-75%);
  width: 18px;
  height: 18px;
  opacity: 0.6;
`;

export const Input = styled.input`
  width: 100%;
  height: 40px;
  line-height: 40px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  padding: 0 8px 0 35px;
  margin-bottom: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

export const RememberMe = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-bottom: 16px;
  p{
    font-size: 14px;}
`
export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #2563eb;
  margin-right: 8px;
`

export const Button = styled.button`
  width: 100%;
  background-color: #DC2625;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #e63939; 
  }
  
  &:active {
    transform: scale(0.98); /* afunda levemente */
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); /* sombra menor */
  }
`;
