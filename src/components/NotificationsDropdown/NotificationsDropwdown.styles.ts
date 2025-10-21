import styled from "styled-components";

export const NotificationsDropdownContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const BellButton = styled.button`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  color: #ffffff;
  padding: 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  svg {
    color: #ffffff;
  }

  /* touch target & spacing for small screens */
  @media (max-width: 480px) {
    padding: 10px;
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: 2px;
  right: 3px;
  background-color: #dc2626;
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  border-radius: 50%;
  width: 17px;
  height: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;

  @media (max-width: 480px) {
    top: 0;
    right: 0;
    width: 19px;
    height: 19px;
    font-size: 12px;
  }
`;

export const NotificationDropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: #ffffff;
  border-radius: 8px;
  min-width: 280px;
  box-shadow: 0 6px 24px rgba(15, 23, 42, 0.25);
  z-index: 2000;
  padding: 8px 0;
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

  /* Small screens: make dropdown full-width with side margins, limited height and scroll */
  @media (max-width: 600px) {
    position: fixed;
    left: 8px;
    right: 8px;
    top: 56px; /* adjust if your header is taller */
    min-width: unset;
    width: calc(100% - 16px);
    max-width: none;
    border-radius: 10px;
    max-height: calc(100vh - 96px);
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.32);
    padding: 6px 0;
    z-index: 9999;
  }

  /* Very small screens tweak */
  @media (max-width: 360px) {
    left: 6px;
    right: 6px;
    top: 52px;
  }
`;

export const NotificationItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 10px 14px;
  border-left: 3px solid transparent;
  cursor: pointer;
  transition: background 0.12s ease;

  &:hover {
    background: rgba(15, 23, 42, 0.04);
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    gap: 2px;
  }
`;

export const NotificationText = styled.span`
  font-size: 14px;
  color: #0f172a;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

export const NotificationTime = styled.span`
  font-size: 12px;
  color: #64748b;

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

export const NotificationDivider = styled.div`
  height: 1px;
  background: rgba(15, 23, 42, 0.08);
  margin: 6px 0;
`;

export const EmptyMessage = styled.div`
  text-align: center;
  font-size: 14px;
  color: #64748b;
  padding: 16px;

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 13px;
  }
`;

export const ViewAllButton = styled.button`
  width: 100%;
  border: none;
  background: none;
  color: #2563eb;
  font-weight: 500;
  font-size: 14px;
  padding: 10px 0;
  cursor: pointer;
  transition: background 0.12s ease;

  &:hover {
    background: rgba(37, 99, 235, 0.08);
  }

  @media (max-width: 480px) {
    padding: 9px 0;
    font-size: 13px;
  }
`;
