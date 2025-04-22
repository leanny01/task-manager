import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

const TimelineContainer = styled.div`
  width: 100%;
  height: 60px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;
  overflow: hidden;
  margin: 1rem 0;
`;

const TimelineBar = styled.div<{ $progress: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${({ $progress }) => `${$progress}%`};
  background: ${({ theme }) => theme.colors.primary};
  opacity: 0.2;
  transition: width 0.3s ease;
`;

const TimelineProgress = styled.div<{ $progress: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${({ $progress }) => `${$progress}%`};
  background: ${({ theme }) => theme.colors.primary};
  opacity: 0.8;
  transition: width 0.3s ease;
`;

const TimelineLabels = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
`;

interface TimelineProps {
    fromDate: string;
    toDate: string;
    showLabels?: boolean;
}

export const Timeline: React.FC<TimelineProps> = ({ fromDate, toDate, showLabels = true }) => {
    if (!fromDate || !toDate) return null;

    const start = moment(fromDate);
    const end = moment(toDate);
    const now = moment();
    const totalDuration = end.diff(start);
    const elapsedDuration = now.diff(start);
    const progress = Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100));

    return (
        <TimelineContainer>
            <TimelineBar $progress={100} />
            <TimelineProgress $progress={progress} />
            {showLabels && (
                <TimelineLabels>
                    <span>{start.format('MMM D, YYYY')}</span>
                    <span>{end.format('MMM D, YYYY')}</span>
                </TimelineLabels>
            )}
        </TimelineContainer>
    );
}; 