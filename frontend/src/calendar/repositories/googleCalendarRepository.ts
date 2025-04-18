import { Task } from "../../task/types/task";
import { Project } from "../../project/types/project";

interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}

export interface GoogleCalendarRepository {
  getEvents(
    calendarId: string,
    timeMin: string,
    timeMax: string
  ): Promise<GoogleCalendarEvent[]>;
  createEvent(
    calendarId: string,
    event: GoogleCalendarEvent
  ): Promise<GoogleCalendarEvent>;
  updateEvent(
    calendarId: string,
    eventId: string,
    event: GoogleCalendarEvent
  ): Promise<GoogleCalendarEvent>;
  deleteEvent(calendarId: string, eventId: string): Promise<void>;
  convertTaskToEvent(task: Task): GoogleCalendarEvent;
  convertProjectToEvent(project: Project): GoogleCalendarEvent;
}

export const createGoogleCalendarRepository = (): GoogleCalendarRepository => {
  const getEvents = async (
    calendarId: string,
    timeMin: string,
    timeMax: string
  ): Promise<GoogleCalendarEvent[]> => {
    // TODO: Implement actual Google Calendar API call
    return [];
  };

  const createEvent = async (
    calendarId: string,
    event: GoogleCalendarEvent
  ): Promise<GoogleCalendarEvent> => {
    // TODO: Implement actual Google Calendar API call
    return event;
  };

  const updateEvent = async (
    calendarId: string,
    eventId: string,
    event: GoogleCalendarEvent
  ): Promise<GoogleCalendarEvent> => {
    // TODO: Implement actual Google Calendar API call
    return event;
  };

  const deleteEvent = async (
    calendarId: string,
    eventId: string
  ): Promise<void> => {
    // TODO: Implement actual Google Calendar API call
  };

  const convertTaskToEvent = (task: Task): GoogleCalendarEvent => {
    return {
      summary: task.title,
      description: task.description,
      start: {
        dateTime: task.fromDate || new Date().toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: task.toDate || new Date(Date.now() + 3600000).toISOString(), // Default 1 hour duration
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };
  };

  const convertProjectToEvent = (project: Project): GoogleCalendarEvent => {
    return {
      summary: project.title,
      description: project.description,
      start: {
        dateTime: project.dueDate || new Date().toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime:
          project.dueDate || new Date(Date.now() + 3600000).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };
  };

  return {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    convertTaskToEvent,
    convertProjectToEvent,
  };
};
