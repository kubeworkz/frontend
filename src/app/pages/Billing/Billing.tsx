import React from 'react';
import { Billing } from '../../components/Billing/Billing';
import { BillingProvider } from './context';

export const BillingPage = () => (
  <BillingProvider>
    <Billing />
  </BillingProvider>
);
