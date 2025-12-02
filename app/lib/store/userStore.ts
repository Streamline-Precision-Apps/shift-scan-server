"use client";
// Pay period timesheet types
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PayPeriodTimesheets = {
  startTime: Date;
  endTime: Date;
};

type Contact = {
  id: string;
  userId: string;
  phoneNumber: string;
  emergencyContact: string;
  emergencyContactNumber: string;
  createdAt: string;
  updatedAt: string;
};

type UserSettings = {
  id: string;
  userId: string;
  language: string;
  generalReminders: boolean;
  personalReminders: boolean;
  cameraAccess: boolean;
  locationAccess: boolean;
  cookiesAccess: boolean;
  createdAt: string;
  lastUpdated: string;
};

type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  signature: string;
  DOB: string;
  truckView: boolean;
  tascoView: boolean;
  laborView: boolean;
  mechanicView: boolean;
  permission: "USER" | "MANAGER" | "ADMIN" | "SUPERADMIN";
  image: string;
  terminationDate: string | null;
  accountSetup: boolean;
  clockedIn: boolean;
  companyId: string;
  middleName: string | null;
  secondLastName: string | null;
  lastSeen: string;
  accountSetupToken: any;
  Contact: Contact;
  UserSettings: UserSettings;
};

type SetUserSetUpPayload = {
  email: string;
  DOB: string;
  Contact: {
    phoneNumber: string;
    emergencyContact: string;
    emergencyContactNumber: string;
  };
  UserSettings: {
    language: string;
  };
};

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  setLanguage: (language: string) => void;
  setUserSettings: (settings: Partial<UserSettings>) => void;
  setImage: (image: string) => void;
  setUserSetUp: (payload: SetUserSetUpPayload) => void;
  payPeriodTimeSheet: PayPeriodTimesheets[] | null;
  setPayPeriodTimeSheets: (
    payPeriodTimeSheets: PayPeriodTimesheets[] | null
  ) => void;
};

// Helper function to sanitize user data and remove any extra properties
const sanitizeUser = (user: any): User | null => {
  if (!user) return null;
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    signature: user.signature,
    DOB: user.DOB,
    truckView: user.truckView,
    tascoView: user.tascoView,
    laborView: user.laborView,
    mechanicView: user.mechanicView,
    permission: user.permission,
    image: user.image,
    terminationDate: user.terminationDate,
    accountSetup: user.accountSetup,
    clockedIn: user.clockedIn,
    companyId: user.companyId,
    middleName: user.middleName,
    secondLastName: user.secondLastName,
    lastSeen: user.lastSeen,
    accountSetupToken: user.accountSetupToken,
    Contact: user.Contact,
    UserSettings: user.UserSettings,
  };
};

export const useUserStore = create(
  persist<UserStore>(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user: sanitizeUser(user) }),
      clearUser: () => set({ user: null }),
      setLanguage: (language) => {
        const user = get().user;
        if (user) {
          set({
            user: { ...user, UserSettings: { ...user.UserSettings, language } },
          });
        }
      },
      setUserSettings: (settings) => {
        const user = get().user;
        if (user) {
          set({
            user: {
              ...user,
              UserSettings: { ...user.UserSettings, ...settings },
            },
          });
        }
      },
      setImage: (image) => {
        const user = get().user;
        if (user) {
          set({
            user: {
              ...user,
              image,
            },
          });
        }
      },
      setUserSetUp: (payload) => {
        const user = get().user;
        if (user) {
          set({
            user: {
              ...user,
              email: payload.email,
              DOB: payload.DOB,
              Contact: {
                ...user.Contact,
                phoneNumber: payload.Contact.phoneNumber,
                emergencyContact: payload.Contact.emergencyContact,
                emergencyContactNumber: payload.Contact.emergencyContactNumber,
              },
              UserSettings: {
                ...user.UserSettings,
                language: payload.UserSettings.language,
              },
            },
          });
        }
      },
      payPeriodTimeSheet: null,
      setPayPeriodTimeSheets: (payPeriodTimeSheets) =>
        set({ payPeriodTimeSheet: payPeriodTimeSheets }),
    }),
    {
      name: "user-store", // storage key
      partialize: (state: UserStore): UserStore => ({
        user: state.user,
        payPeriodTimeSheet: state.payPeriodTimeSheet,
        setUser: () => {},
        clearUser: () => {},
        setLanguage: () => {},
        setUserSettings: () => {},
        setImage: () => {},
        setUserSetUp: () => {},
        setPayPeriodTimeSheets: () => {},
      }),
    }
  )
);
