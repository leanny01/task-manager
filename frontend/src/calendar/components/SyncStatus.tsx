import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { useCalendar } from '../context/CalendarContext';

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: ${props => props.theme.colors.hover};
  }
`;

const StatusDot = styled.div<{ status: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => {
        switch (props.status) {
            case 'success':
                return '#059669'; // Hardcoded success color
            case 'error':
                return '#dc2626'; // Hardcoded error color
            case 'syncing':
                return props.theme.colors.primary;
            default:
                return props.theme.colors.text.light;
        }
    }};
`;

const SyncIcon = styled.div<{ status: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.text.secondary};
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
    ${props => props.status === 'syncing' && `
      animation: spin 1s linear infinite;
    `}
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const Tooltip = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: ${props => props.theme.colors.background.white};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.375rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.primary};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  opacity: ${props => props.$isVisible ? 1 : 0};
  visibility: ${props => props.$isVisible ? 'visible' : 'hidden'};
  transition: all 0.2s ease;
  z-index: 50;
  min-width: 200px;
  
  &::before {
    content: '';
    position: absolute;
    top: -0.25rem;
    right: 1rem;
    width: 0.5rem;
    height: 0.5rem;
    background: ${props => props.theme.colors.background.white};
    border-left: 1px solid ${props => props.theme.colors.border};
    border-top: 1px solid ${props => props.theme.colors.border};
    transform: rotate(45deg);
  }
`;

const TooltipContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TooltipStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.text.primary};
`;

const TooltipTime = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.75rem;
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.75rem;
`;

export default function SyncStatus() {
    const [showTooltip, setShowTooltip] = React.useState(false);
    const { getState } = useCalendar();
    const { status, lastSyncTime, error } = getState();

    const formatLastSync = () => {
        if (!lastSyncTime) return 'Never synced';
        return `Last synced ${moment(lastSyncTime).fromNow()}`;
    };

    const getStatusText = () => {
        switch (status) {
            case 'success':
                return 'Calendar synced';
            case 'error':
                return 'Sync failed';
            case 'syncing':
                return 'Syncing...';
            default:
                return 'Not synced';
        }
    };

    return (
        <StatusContainer
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <SyncIcon status={status}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 12c0-2.8 1.2-5.2 3.2-7.2C7.2 2.8 9.6 1.6 12.4 1.6M22 12c0 2.8-1.2 5.2-3.2 7.2-2 2-4.4 3.2-7.2 3.2" />
                </svg>
            </SyncIcon>
            <StatusDot status={status} />
            <Tooltip $isVisible={showTooltip}>
                <TooltipContent>
                    <TooltipStatus>
                        <StatusDot status={status} />
                        {getStatusText()}
                    </TooltipStatus>
                    <TooltipTime>{formatLastSync()}</TooltipTime>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                </TooltipContent>
            </Tooltip>
        </StatusContainer>
    );
} 