import { useState, useRef, useEffect } from "react";
import { BellIcon } from "@phosphor-icons/react";
import { NotificationsDropdownContainer, BellButton, NotificationBadge, EmptyMessage, NotificationItem, NotificationText, NotificationTime, ViewAllButton, NotificationDivider, NotificationDropdownMenu } from "./NotificationsDropwdown.styles";

interface Notification {
  id: number;
  text: string;
  time: string;
  read?: boolean;
}

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // ⚙️ Fechar ao clicar fora
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // 🔔 Notificações simuladas (placeholder)
  const notifications: Notification[] = [
    { id: 1, text: "Novo usuário cadastrado", time: "Há 5 min" },
    { id: 2, text: "Atualização do sistema concluída", time: "Há 1 h" },
    { id: 3, text: "Relatório mensal disponível", time: "Ontem" },
    { id: 4, text: "Senha alterada com sucesso", time: "2 dias atrás" },
    { id: 5, text: "Backup automático executado", time: "3 dias atrás" },
    { id: 6, text: "Nova mensagem da administração", time: "1 semana atrás" },
  ];

  const maxToShow = 5;
  const visibleNotifications = notifications.slice(0, maxToShow);
  const unreadCount = 2;

  return (
    <NotificationsDropdownContainer ref={ref}>
      <BellButton onClick={() => setOpen((prev) => !prev)} aria-label="notificações">
        <BellIcon size={22} weight="bold" />
        {unreadCount > 0 && <NotificationBadge>{unreadCount}</NotificationBadge>}
      </BellButton>

      {open && (
        <NotificationDropdownMenu>
          {visibleNotifications.length === 0 ? (
            <EmptyMessage>Sem novas notificações</EmptyMessage>
          ) : (
            visibleNotifications.map((n) => (
              <NotificationItem key={n.id}>
                <NotificationText>{n.text}</NotificationText>
                <NotificationTime>{n.time}</NotificationTime>
              </NotificationItem>
            ))
          )}
          <NotificationDivider />
          <ViewAllButton>Ver todas as notificações</ViewAllButton>
        </NotificationDropdownMenu>
      )}
    </NotificationsDropdownContainer>
  );
}
