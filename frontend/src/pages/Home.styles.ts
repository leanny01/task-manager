import styled from "styled-components";

export const AppContainer = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
  background: ${(props) => props.theme.colors.background.white};
`;

export const Sidebar = styled.aside`
  padding: 2rem 1rem;
  border-right: 1px solid ${(props) => props.theme.colors.border};
`;

export const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  padding: 0 1rem;
  color: ${(props) => props.theme.colors.text.primary};
`;

export const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const NavItem = styled.li`
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: transparent;
  color: ${(props) => props.theme.colors.text.primary};

  &.active {
    background: ${(props) => props.theme.colors.secondary};
  }

  &:hover {
    background: ${(props) => props.theme.colors.secondary};
  }
`;

export const MainContent = styled.main`
  padding: 1.5rem 2rem;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const SearchBar = styled.div`
  position: relative;
  width: 300px;
  margin-right: 2rem;

  input {
    width: 100%;
    padding: 0.75rem 1rem;
    padding-left: 2.5rem;
    border: 1px solid ${(props) => props.theme.colors.border};
    border-radius: 0.5rem;
    font-size: 1rem;

    &::placeholder {
      color: ${(props) => props.theme.colors.text.light};
    }
  }

  &::before {
    content: "🔍";
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${(props) => props.theme.colors.text.light};
  }
`;

export const UserProfile = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.border};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const AddTaskInput = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 0.5rem;

  input {
    width: 100%;
    padding: 0.5rem;
    border: none;
    font-size: 1rem;

    &::placeholder {
      color: ${(props) => props.theme.colors.text.light};
    }

    &:focus {
      outline: none;
    }
  }
`;

export const TaskContainer = styled.div`
  max-width: 800px;
`;

export const ErrorMessage = styled.p`
  color: ${(props) => props.theme.colors.text.primary};
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 0.375rem;
  font-size: 0.875rem;
`;

export const Section = styled.section`
  margin-bottom: 2rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0 0 1rem 0;
`;

export const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${(props) => props.theme.colors.text.primary};
`;

export const EmptyState = styled.div`
  text-align: center;
  color: ${(props) => props.theme.colors.text.light};
  padding: 2rem 0;
`;

export const AddTaskInputContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  background: ${(props) => props.theme.colors.background.white};
  border: 2px solid ${(props) => props.theme.colors.border};
  border-radius: 0.75rem;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(props) => `${props.theme.colors.primary}15`};
  }

  input {
    flex: 1;
    padding: 0.875rem 1rem;
    border: none;
    background: none;
    font-size: 1rem;
    color: ${(props) => props.theme.colors.text.primary};
    outline: none;

    &::placeholder {
      color: ${(props) => props.theme.colors.text.secondary};
    }
  }
`;

export const AddButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  color: ${(props) => props.theme.colors.text.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;
