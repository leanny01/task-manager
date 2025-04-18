import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Task } from '../types/task';
import { TaskPriority } from '../types/enums';
import { Input } from '../shared/components/forms/Input';
import { TextArea } from '../shared/components/forms/TextArea';
import { Button } from '../shared/components/buttons/Button';
import { Project } from '../../project/types/project';

interface EditTaskModalProps {
  task: Task;
  projects: Project[];
  onClose: () => void;
  onSave: (id: string, updates: Partial<Task>) => Promise<Task>;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  padding: 0.5rem;
  
  &:hover {
    color: ${props => props.theme.colors.text.primary};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const DateInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const DateInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const DateLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text.secondary};
  min-width: 120px;
`;

const DateInput = styled.input`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TimeInput = styled(DateInput)`
  width: 100px;
`;

const DateLink = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  
  &:hover {
    color: ${props => props.theme.colors.primaryHover};
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.375rem;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

export default function EditTaskModal({
  task,
  projects,
  onClose,
  onSave,
}: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState(task.priority);
  const [showDateInputs, setShowDateInputs] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [projectId, setProjectId] = useState(task.projectId || '');

  useEffect(() => {
    if (task.fromDate) {
      const fromMoment = moment(task.fromDate);
      setStartDate(fromMoment.format('YYYY-MM-DD'));
      setStartTime(fromMoment.format('HH:mm'));
      setShowDateInputs(true);
    }
    if (task.toDate) {
      const toMoment = moment(task.toDate);
      setEndDate(toMoment.format('YYYY-MM-DD'));
      setEndTime(toMoment.format('HH:mm'));
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let fromDate: string | undefined;
      let toDate: string | undefined;

      if (startDate) {
        const startMoment = moment(startDate);
        if (startTime) {
          const [hours, minutes] = startTime.split(':');
          startMoment.set({ hours: parseInt(hours), minutes: parseInt(minutes) });
        }
        fromDate = startMoment.toISOString();

        if (endDate) {
          const endMoment = moment(endDate);
          if (endTime) {
            const [hours, minutes] = endTime.split(':');
            endMoment.set({ hours: parseInt(hours), minutes: parseInt(minutes) });
          } else {
            // If no end time specified, set to end of day
            endMoment.endOf('day');
          }
          toDate = endMoment.toISOString();
        } else if (startTime) {
          // If start time specified but no end date, assume 1 hour duration
          const endMoment = moment(startMoment).add(1, 'hour');
          toDate = endMoment.toISOString();
        } else {
          // If only start date specified, set to end of day
          const endMoment = moment(startMoment).endOf('day');
          toDate = endMoment.toISOString();
        }
      }

      await onSave(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        fromDate,
        toDate,
        projectId: projectId || undefined
      });
      onClose();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Edit Task</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <Input
            label="Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={false}
            required
          />
          <TextArea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={false}
          />

          {!showDateInputs ? (
            <DateLink onClick={() => setShowDateInputs(true)}>
              Add date and time
            </DateLink>
          ) : (
            <DateInputGroup>
              <DateInputRow>
                <DateLabel>Start Date:</DateLabel>
                <DateInput
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={false}
                />
                <DateInput
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={false}
                />
              </DateInputRow>

              <DateInputRow>
                <DateLabel>End Date:</DateLabel>
                <DateInput
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={false}
                />
                <DateInput
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  disabled={false}
                />
              </DateInputRow>
            </DateInputGroup>
          )}

          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            <option value={TaskPriority.LOW}>Low Priority</option>
            <option value={TaskPriority.MEDIUM}>Medium Priority</option>
            <option value={TaskPriority.HIGH}>High Priority</option>
          </Select>

          <Select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            <option value="">No Project</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </Select>

          <ButtonGroup>
            <Button onClick={onClose} disabled={false}>
              Cancel
            </Button>
            <Button type="submit" disabled={false || !title.trim()}>
              Save Changes
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
} 