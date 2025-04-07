import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`

const Card = styled.div`
  max-width: 72rem;
  width: 100%;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  padding: 2rem;
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    padding: 3rem;
  }
`

const Title = styled.h1`
  font-size: 2.25rem;
  line-height: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 1rem;
  text-align: center;
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    font-size: 3.75rem;
    line-height: 1;
  }
`

const Subtitle = styled.p`
  font-size: 1.25rem;
  line-height: 1.75rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 2rem;
  text-align: center;
`

const Grid = styled.div`
  display: grid;
  gap: 2rem;
  margin-bottom: 3rem;
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

const FeatureCard = styled.div`
  background-color: #eff6ff;
  padding: 1.5rem;
  border-radius: 0.75rem;
`

const GetStartedCard = styled.div`
  background-color: ${props => props.theme.colors.secondary};
  padding: 1.5rem;
  border-radius: 0.75rem;
`

const CardTitle = styled.h2`
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  color: ${props => props.theme.colors.text.secondary};
`

const ListItem = styled.li`
  display: flex;
  align-items: center;
`

const Checkmark = styled.span`
  color: ${props => props.theme.colors.primary};
  margin-right: 0.5rem;
`

const Button = styled(Link)`
  display: block;
  width: 100%;
  text-align: center;
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
`

const PrimaryButton = styled(Button)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
`

const SecondaryButton = styled(Button)`
  background-color: white;
  color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary};
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const FooterText = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.text.light};
`

const StyledLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  &:hover {
    text-decoration: underline;
  }
`

export default function Welcome() {
    return (
        <Container>
            <Card>
                <Title>Welcome to Task Manager</Title>
                <Subtitle>
                    Organize your tasks efficiently and boost your productivity
                </Subtitle>

                <Grid>
                    <FeatureCard>
                        <CardTitle>Features</CardTitle>
                        <List>
                            <ListItem>
                                <Checkmark>✓</Checkmark>
                                Task Management
                            </ListItem>
                            <ListItem>
                                <Checkmark>✓</Checkmark>
                                Priority Levels
                            </ListItem>
                            <ListItem>
                                <Checkmark>✓</Checkmark>
                                Due Date Tracking
                            </ListItem>
                            <ListItem>
                                <Checkmark>✓</Checkmark>
                                Progress Monitoring
                            </ListItem>
                        </List>
                    </FeatureCard>

                    <GetStartedCard>
                        <CardTitle>Get Started</CardTitle>
                        <p>
                            Sign up now to start managing your tasks effectively and achieve your goals.
                        </p>
                        <ButtonGroup>
                            <PrimaryButton to="/signup">Sign Up</PrimaryButton>
                            <SecondaryButton to="/login">Log In</SecondaryButton>
                        </ButtonGroup>
                    </GetStartedCard>
                </Grid>

                <FooterText>
                    <p>Already have an account? <StyledLink to="/login">Log in</StyledLink></p>
                </FooterText>
            </Card>
        </Container>
    )
} 