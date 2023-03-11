import { IconName } from '../../components/SvgIcon/SvgIcon';

export type AuthProvider = 'github' | 'google' | 'hasura';

export type AuthProviderDetails = {
  id: AuthProvider;
  name: string;
  partner: boolean;
  icon: IconName;
};

export const providers: AuthProviderDetails[] = [
  {
    id: 'github', name: 'Github', partner: false, icon: 'mark-github_34',
  },
  {
    id: 'google', name: 'Google', partner: false, icon: 'mark-google_34',
  },
  {
    id: 'hasura', name: 'Hasura', partner: true, icon: 'hasura_84',
  },
];
