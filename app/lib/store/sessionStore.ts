"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Timesheets = {
  id: number;
};
// Types for sessions
export type Session = {
  id: number;
  userId: string;
  timesheetId: Timesheets[];
  startTime: string; // ISO string
  endTime?: string | null; // ISO string
  lastLocationSentAt?: number;
};

// Store type
export type SessionStoreState = {
  sessions: Session[];
  currentSessionId: number | null;
  // Tracking state
  isUserClockedIn: boolean;
  currentUserId: string | null;
  lastLocationSentAt: number | null;
  locationSendInProgress: boolean;
  watchId: string | null;
  isBackgroundTrackingActive: boolean;
  periodicSendTimer: any | null;
  lastKnownCoordinates: { lat: number; lng: number } | null;
  // Session management
  addSession: (session: Session) => void;
  updateSession: (id: number, session: Partial<Session>) => void;
  removeSession: (id: number) => void;
  getSession: (id: number) => Session | undefined;

  // Current session management
  setCurrentSession: (sessionId: number | null) => void;
  getCurrentSession: () => Session | undefined;
  // Timesheet management
  setTimesheetId: (sessionId: number, timesheetId: number) => void;
  clearSessions: () => void;
  // Location management
  setLastLocationSentAt: (sessionId: number, timestamp: number) => void;
  // Tracking state setters
  setIsUserClockedIn: (val: boolean) => void;
  setCurrentUserId: (val: string | null) => void;
  setLocationSendInProgress: (val: boolean) => void;
  setWatchId: (val: string | null) => void;
  setIsBackgroundTrackingActive: (val: boolean) => void;
  setPeriodicSendTimer: (val: any | null) => void;
  setLastKnownCoordinates: (val: { lat: number; lng: number } | null) => void;
};

export const useSessionStore = create<SessionStoreState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,

      // Tracking state
      isUserClockedIn: false,
      currentUserId: null,
      lastLocationSentAt: null,
      locationSendInProgress: false,
      watchId: null,
      isBackgroundTrackingActive: false,
      periodicSendTimer: null,
      lastKnownCoordinates: null,

      // Session management
      addSession: (session: Session) =>
        set((state) => ({
          sessions: [...state.sessions, session],
        })),

      updateSession: (id: number, sessionData: Partial<Session>) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === id ? { ...session, ...sessionData } : session
          ),
        })),

      removeSession: (id: number) =>
        set((state) => ({
          sessions: state.sessions.filter((session) => session.id !== id),
          currentSessionId:
            state.currentSessionId === id ? null : state.currentSessionId,
        })),

      getSession: (id: number) => {
        const state = get();
        return state.sessions.find((session) => session.id === id);
      },
      // Current session management
      setCurrentSession: (sessionId: number | null) =>
        set(() => ({
          currentSessionId: sessionId,
        })),

      getCurrentSession: () => {
        const state = get();
        return state.sessions.find(
          (session) => session.id === state.currentSessionId
        );
      },

      // Timesheet management
      setTimesheetId: (sessionId: number, timesheetId: number) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  timesheetId: [...session.timesheetId, { id: timesheetId }],
                }
              : session
          ),
        })),

      clearSessions: () =>
        set(() => ({
          sessions: [],
          currentSessionId: null,
        })),

      setLastLocationSentAt: (sessionId: number, timestamp: number) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? { ...session, lastLocationSentAt: timestamp }
              : session
          ),
          lastLocationSentAt: timestamp,
        })),

      // Tracking state setters
      setIsUserClockedIn: (val: boolean) =>
        set(() => ({ isUserClockedIn: val })),
      setCurrentUserId: (val: string | null) =>
        set(() => ({ currentUserId: val })),
      setLocationSendInProgress: (val: boolean) =>
        set(() => ({ locationSendInProgress: val })),
      setWatchId: (val: string | null) => set(() => ({ watchId: val })),
      setIsBackgroundTrackingActive: (val: boolean) =>
        set(() => ({ isBackgroundTrackingActive: val })),
      setPeriodicSendTimer: (val: any | null) =>
        set(() => ({ periodicSendTimer: val })),
      setLastKnownCoordinates: (val: { lat: number; lng: number } | null) =>
        set(() => ({ lastKnownCoordinates: val })),
    }),
    {
      name: "session-store",
    }
  )
);
