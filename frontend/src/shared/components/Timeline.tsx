import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const TimelineRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TimelineLabel = styled.span`
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
`;

const TimelineValue = styled.span`
  color: ${props => props.theme.colors.text.secondary};
`;

const TimelineDuration = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
`;

const formatDuration = (duration: moment.Duration): string => {
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();

    if (days > 0) {
        return `${days}d ${hours}h`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
};

interface TimelineProps {
    fromDate?: string;
    toDate?: string;
    showDuration?: boolean;
    showLabels?: boolean;
    className?: string;
}

export default function Timeline({
    fromDate,
    toDate,
    showDuration = true,
    showLabels = true,
    className
}: TimelineProps) {
    if (!fromDate || !toDate) return null;

    const start = moment(fromDate);
    const end = moment(toDate);
    const duration = moment.duration(end.diff(start));

    return (
        <TimelineContainer className={className}>
            <TimelineRow>
                {showLabels && <TimelineLabel>Start:</TimelineLabel>}
                <TimelineValue>{start.format('MMM D, YYYY [at] h:mm A')}</TimelineValue>
            </TimelineRow>
            <TimelineRow>
                {showLabels && <TimelineLabel>End:</TimelineLabel>}
                <TimelineValue>{end.format('MMM D, YYYY [at] h:mm A')}</TimelineValue>
            </TimelineRow>
            {showDuration && (
                <TimelineRow>
                    {showLabels && <TimelineLabel>Duration:</TimelineLabel>}
                    <TimelineDuration>{formatDuration(duration)}</TimelineDuration>
                </TimelineRow>
            )}
        </TimelineContainer>
    );
} 