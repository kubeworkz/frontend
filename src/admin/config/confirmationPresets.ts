import { ConfirmationOptions } from '../../components/Confirmation/ConfirmationProvider';

export const ConfirmationPresets: Record<string, ConfirmationOptions> = {
  MakeUserAnAdmin: {
    header: 'Are you sure you want to make this user an admin?',
    text: 'They will be able to access the admin panel.',
  },
};
