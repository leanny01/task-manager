import React from 'react';
import styled from 'styled-components';
import { Task } from '../../task/types/task';
import { Project } from '../../project/types/project';
import TaskItem from '../../task/components/TaskItem';

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

interface BaseTaskListProps {
    tasks?: Task[];
    onToggleComplete: (id: string) => void;
    onDeleteTask: (id: string) => void;
    onEditTask: (task: Task) => void;
}

interface ProjectTaskListProps extends BaseTaskListProps {
    context: 'project';
    project?: Project;
}

interface TaskTaskListProps extends BaseTaskListProps {
    context: 'task';
    onPromoteToProject?: (task: Task) => void;
}

type TaskListProps = ProjectTaskListProps | TaskTaskListProps;

export default function TaskList(props: TaskListProps) {
    const {
        tasks = [],
        onToggleComplete,
        onDeleteTask,
        onEditTask,
        context,
    } = props;

    return (
        <List>
            {tasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onDelete={onDeleteTask}
                    onEdit={onEditTask}
                    onPromoteToProject={context === 'task' ? props.onPromoteToProject : undefined}
                />
            ))}
        </List>
    );
} 