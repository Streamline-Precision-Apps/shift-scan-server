// This will save the hours for the pay period for the home screen.

"use client";
import React, { createContext, useState, ReactNode, useContext } from "react";

type PayPeriodHoursProps = {
  payPeriodHours: string | null;
  setPayPeriodHours: (payPeriodHours: string | null) => void;
};

const PayPeriodHours = createContext<PayPeriodHoursProps | undefined>(
  undefined
);

export const PayPeriodHoursProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // creates a state
  const [payPeriodHours, setPayPeriodHours] = useState<string | null>(null);
  // when the provider is called it will return the value below
  return (
    <PayPeriodHours.Provider value={{ payPeriodHours, setPayPeriodHours }}>
      {children}
    </PayPeriodHours.Provider>
  );
};
// this is used to get the value
export const usePayPeriodHours = () => {
  const context = useContext(PayPeriodHours);
  if (context === undefined) {
    throw new Error(
      "PayPeriodHours must be used within a PayPeriodHoursProvider"
    );
  }
  return context;
};
