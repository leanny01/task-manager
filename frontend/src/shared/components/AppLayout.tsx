import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import SyncStatus from '../../calendar/components/SyncStatus';

interface AppLayoutProps {
    sidebar: React.ReactNode;
    children?: React.ReactNode;
}

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${props => props.theme.colors.background.primary};
`;

const Sidebar = styled.div`
  width: 240px;
  padding: 2rem;
  border-right: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background.secondary};
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background.secondary};
`;

const UserProfile = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  margin-left: 1rem;
`;

export const AppLayout: React.FC<AppLayoutProps> = ({ sidebar, children }) => {
    return (
        <LayoutContainer>
            <Sidebar>{sidebar}</Sidebar>
            <MainContent>
                <Header>
                    <SyncStatus />
                    <UserProfile />
                </Header>
                {children || <Outlet />}
            </MainContent>
        </LayoutContainer>
    );
} 