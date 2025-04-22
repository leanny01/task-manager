import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectStatus, ProjectPriority } from '../types/project';
import { useProject } from '../hooks/useProject';
import { CheckIcon, AlertIcon, ClockIcon } from '../../shared/components/Icons';
import { Timeline } from '../../shared/components/Timeline';
import ProjectDetails from '../views/ProjectView';
import * as S from './ProjectDetailsPage.styles';
import ProjectViewWrapper from '../containers/ProjectViewWrapper';

export default function ProjectDetailsPage() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { project, isLoading, error } = useProject(projectId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !project) {
    return <div>Error: {error || 'Project not found'}</div>;
  }

  const calculateProjectTimeline = (tasks: any[]) => {
    if (tasks.length === 0) return null;

    const validTasks = tasks.filter(task => task.fromDate && task.toDate);
    if (validTasks.length === 0) return null;

    const startDates = validTasks.map(task => new Date(task.fromDate).getTime());
    const endDates = validTasks.map(task => new Date(task.toDate).getTime());

    const projectStart = new Date(Math.min(...startDates)).toISOString();
    const projectEnd = new Date(Math.max(...endDates)).toISOString();

    return {
      fromDate: projectStart,
      toDate: projectEnd
    };
  };

  const timeline = calculateProjectTimeline(project.tasks || []);

  return (
    <S.Container>
      <S.Header>
        <S.HeaderContent>
          <S.BackButton onClick={() => navigate('/projects')}>
            ←
          </S.BackButton>
          <S.ProjectInfo>
            <S.TitleSection>
              <S.Title>{project.title}</S.Title>
              <S.MetaSection>
                <S.Badge $status={project.status}>
                  {project.status === ProjectStatus.ACTIVE ? <CheckIcon /> : <ClockIcon />}
                  {project.status.toLowerCase()}
                </S.Badge>
                <S.Badge $priority={project.priority}>
                  {project.priority === ProjectPriority.HIGH ? <AlertIcon /> : <ClockIcon />}
                  {project.priority.toLowerCase()} priority
                </S.Badge>
              </S.MetaSection>
            </S.TitleSection>
            {timeline && (
              <S.ProjectTimeline>
                <Timeline
                  fromDate={timeline.fromDate}
                  toDate={timeline.toDate}
                  showLabels={true}
                />
              </S.ProjectTimeline>
            )}
          </S.ProjectInfo>
        </S.HeaderContent>
      </S.Header>
      <S.Layout>
        <ProjectViewWrapper>
          {({ projects, projectTasks, onEditProject, onDeleteProject, onProjectClick, onProjectAdded, onAddTask, onEditTask, onDeleteTask, onToggleTaskStatus, isLoading, error }) => (
            <ProjectDetails
              onAddTask={onAddTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onToggleTaskStatus={onToggleTaskStatus}
              onEditProject={onEditProject}
            />
          )}
        </ProjectViewWrapper>
      </S.Layout>
    </S.Container>
  );
} 