import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  min-height: calc(100vh - 4rem);

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    flex-direction: column;
  }
`;

export const LeftColumn = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    min-width: 100%;
  }
`;

export const RightColumn = styled.div`
  flex: 2;
  min-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    min-width: 100%;
  }
`;

export const Section = styled.section`
  background: ${(props) => props.theme.colors.background.white};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: 2rem;
  box-shadow: ${(props) => props.theme.shadows.sm};
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const TaskCount = styled.span`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.secondary};
  background: ${(props) => props.theme.colors.background.light};
  padding: 0.25rem 0.5rem;
  border-radius: ${(props) => props.theme.borderRadius.md};
`;

export const Divider = styled.div`
  height: 1px;
  background: ${(props) => props.theme.colors.border};
  margin: 1.5rem 0;
`;

export const Description = styled.p`
  margin: 0;
  color: ${(props) => props.theme.colors.text.light};
  font-size: 1.125rem;
  line-height: 1.6;
  white-space: pre-wrap;
`;

export const DescriptionInput = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0.5rem 0;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

export const EditButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.text.light};
  cursor: pointer;
  padding: 0.25rem;
  margin-left: 0.5rem;

  &:hover {
    color: ${(props) => props.theme.colors.text.primary};
  }
`;

export const TasksSection = styled.div`
  background: ${(props) => props.theme.colors.background.white};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: ${(props) => props.theme.shadows.sm};
`;

export const TaskListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const AddTaskInput = styled.div<{ $isSubmitting?: boolean }>`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;

  input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 1px solid ${(props) => props.theme.colors.border};
    border-radius: ${(props) => props.theme.borderRadius.md};
    font-size: 0.875rem;
    color: ${(props) => props.theme.colors.text.primary};
    background: ${(props) => props.theme.colors.background.white};
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: ${(props) => props.theme.colors.primary};
    }

    &::placeholder {
      color: ${(props) => props.theme.colors.text.secondary};
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  button {
    padding: 0.75rem 1.5rem;
    background-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.background.white};
    border: none;
    border-radius: ${(props) => props.theme.borderRadius.md};
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: ${(props) => props.theme.colors.primaryHover};
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  color: ${(props) => props.theme.colors.text.light};
  padding: 4rem 0;
  border: 2px dashed ${(props) => props.theme.colors.border};
  border-radius: 0.75rem;
  background: ${(props) => props.theme.colors.background.light};
`;

export const LoadingState = styled.div`
  text-align: center;
  color: ${(props) => props.theme.colors.text.light};
  padding: 2rem 0;
`;

export const ErrorState = styled.div`
  text-align: center;
  color: ${(props) => props.theme.colors.text.primary};
  padding: 2rem 0;
`;
