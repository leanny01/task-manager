import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TaskViewWrapper from '../containers/TaskViewWrapper';
import TodayTasksView from '../views/TodayTasksView';
import UpcomingTasksView from '../views/UpcomingTasksView';
import CompletedTasksView from '../views/CompletedTasksView';
import AllTasksView from '../views/AllTasksView';

export default function TaskListPage() {
    return (
        <TaskViewWrapper>
            {({ tasks, onToggleComplete, onDeleteTask, onEditTask }) => (
                <Routes>
                    <Route path="/" element={<Navigate to="all" replace />} />
                    <Route path="all" element={
                        <AllTasksView
                            tasks={tasks}
                            onToggleComplete={onToggleComplete}
                            onDeleteTask={onDeleteTask}
                            onEditTask={onEditTask}
                        />
                    } />
                    <Route path="today" element={
                        <TodayTasksView
                            tasks={tasks}
                            onToggleComplete={onToggleComplete}
                            onDeleteTask={onDeleteTask}
                            onEditTask={onEditTask}
                        />
                    } />
                    <Route path="upcoming" element={
                        <UpcomingTasksView
                            tasks={tasks}
                            onToggleComplete={onToggleComplete}
                            onDeleteTask={onDeleteTask}
                            onEditTask={onEditTask}
                        />
                    } />
                    <Route path="completed" element={
                        <CompletedTasksView
                            tasks={tasks}
                            onToggleComplete={onToggleComplete}
                            onDeleteTask={onDeleteTask}
                            onEditTask={onEditTask}
                        />
                    } />
                </Routes>
            )}
        </TaskViewWrapper>
    );
} 