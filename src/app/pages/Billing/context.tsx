import React, { createContext, useEffect, useState } from 'react';

import { apiService, ConsumptionHistoryPeriod, Invoice } from '../../../api/publicv2';

export type BillingContext = {
  invoices: Invoice[];
  consumptionPeriods: ConsumptionHistoryPeriod[];
  isLoading: boolean;
};

const context = createContext<BillingContext>({
  invoices: [],
  consumptionPeriods: [],
  isLoading: true,
});

context.displayName = 'BillingContext';

export type BillingProviderProps = {
  children: React.ReactNode;
};
export const BillingProvider = ({ children }: BillingProviderProps) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [consumptionPeriods, setConsumptionPeriods] = useState<ConsumptionHistoryPeriod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiService.getCurrentUserConsumption({}).then((response) => {
        setConsumptionPeriods(response.data.periods);
      }),
      apiService.listBillingInvoices({}).then((response) => {
        setInvoices(response.data.invoices);
      }),
    ]).finally(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <context.Provider value={{
      invoices,
      consumptionPeriods,
      isLoading,
    }}
    >
      {children}

    </context.Provider>
  );
};

export const useBilling = () => React.useContext(context);
