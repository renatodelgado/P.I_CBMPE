import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownContainer,
  ProfileButton,
  ProfileInfo,
  Divider,
  ProfileName,
  ProfileRole,
  DropdownMenu,
  DropdownItem,
    Avatar,
} from "./UserDropdown.styles.ts";
import {
  GearSixIcon,
  QuestionIcon,
  InfoIcon,
  LockIcon,
  SignOutIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";

export function UserDropdown() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleOutsideClick = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const username = "Roberto Almeida";
  const role = "Administrador";
  const initials = username
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <DropdownContainer ref={ref}>
      <ProfileButton onClick={() => setOpen((prev) => !prev)}>
        <Avatar>{initials}</Avatar>
        <ProfileInfo>
          <ProfileName>{username}</ProfileName>
          <ProfileRole>{role}</ProfileRole>
        </ProfileInfo>
      </ProfileButton>

      {open && (
        <DropdownMenu>
          <DropdownItem as={Link} to="/perfil">
            <UserCircleIcon size={18} /> Meu Perfil
          </DropdownItem>
          <DropdownItem as={Link} to="/alterar-senha">
            <LockIcon size={18} /> Alterar Senha
          </DropdownItem>
          <DropdownItem as={Link} to="/preferencias">
            <GearSixIcon size={18} /> Preferências
          </DropdownItem>
          <Divider />
          <DropdownItem as={Link} to="/ajuda">
            <QuestionIcon size={18} /> Ajuda
          </DropdownItem>
          <DropdownItem as={Link} to="/sobre">
            <InfoIcon size={18} /> Sobre o Sistema
          </DropdownItem>
          <Divider />
          <DropdownItem
            onClick={() => {
              navigate("/logout");
            }}
            $danger
          >
            <SignOutIcon size={18} /> Sair
          </DropdownItem>
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
}
