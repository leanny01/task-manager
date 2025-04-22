import styled from "styled-components";
import { DefaultTheme } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: calc(100vh - 4rem);

  @media (min-width: ${({ theme }) => theme.breakpoints?.sm || "640px"}) {
    padding: 2rem;
  }
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors?.background?.white || "#ffffff"};
  border-radius: ${({ theme }) => theme.borderRadius?.lg || "0.5rem"};
  box-shadow: ${({ theme }) =>
    theme.shadows?.sm || "0 1px 2px 0 rgba(0, 0, 0, 0.05)"};
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

export const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.text?.primary || "#000000"};
`;

export const Meta = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

export const Badge = styled.span<{ $status?: string; $priority?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  background-color: ${(props) => {
    if (props.$status === "active") return props.theme.colors.successLight;
    if (props.$status === "completed") return props.theme.colors.primary;
    if (props.$priority === "high") return props.theme.colors.errorLight;
    if (props.$priority === "medium") return props.theme.colors.warningLight;
    if (props.$priority === "low") return props.theme.colors.successLight;
    return props.theme.colors.background.light;
  }};
  color: ${(props) => {
    if (props.$status === "active") return props.theme.colors.success;
    if (props.$status === "completed") return props.theme.colors.primaryHover;
    if (props.$priority === "high") return props.theme.colors.error;
    if (props.$priority === "medium") return props.theme.colors.warning;
    if (props.$priority === "low") return props.theme.colors.success;
    return props.theme.colors.text.primary;
  }};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

export const BackButton = styled.button`
  padding: 0.5rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors?.text?.secondary || "#6b7280"};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors?.text?.primary || "#000000"};
  }
`;

export const ProjectInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const MetaSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const ProjectTimeline = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors?.background?.light || "#f3f4f6"};
  border-radius: ${({ theme }) => theme.borderRadius?.lg || "0.5rem"};
  border: 1px solid ${({ theme }) => theme.colors?.border || "#e5e7eb"};
`;

export const TimelineRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors?.text?.secondary || "#6b7280"};
`;

export const TimelineLabel = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors?.text?.primary || "#000000"};
`;

export const TimelineValue = styled.span`
  color: ${({ theme }) => theme.colors?.text?.secondary || "#6b7280"};
`;

export const TimelineDuration = styled.span`
  color: ${({ theme }) => theme.colors?.primary || "#3b82f6"};
  font-weight: 500;
`;
