import { CaretLeftIcon } from "@phosphor-icons/react";
import styled from "styled-components";

const BreadcrumbContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #475569;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
`;

const BreadcrumbLink = styled.button`
  background: none;
  border: none;
  color: #dc2625;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  padding: 0;
  &:hover {
    text-decoration: underline;
  }
`;

const CurrentCrumb = styled.span`
  color: #334155;
  font-weight: 700;
`;

type Crumb = {
  label: string;
  onClick?: () => void;
};

type BreadcrumbProps = {
  items: Crumb[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <BreadcrumbContainer>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={index} style={{ display: "flex", alignItems: "center" }}>
            {!isLast ? (
              <>
                <BreadcrumbLink onClick={item.onClick}>
                  {item.label}
                </BreadcrumbLink>
                <CaretLeftIcon size={10} weight="bold" style={{ transform: "rotate(180deg)" }} />
              </>
            ) : (
              <CurrentCrumb>{item.label}</CurrentCrumb>

              
            )}
          </span>
        );
      })}
    </BreadcrumbContainer>
  );
}