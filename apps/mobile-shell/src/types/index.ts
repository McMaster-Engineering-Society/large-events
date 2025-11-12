import type { AuthUser, InstanceResponse } from '@large-event/api-types';

/**
 * Props passed to team components by the mobile-shell
 */
export interface TeamComponentProps {
  user: AuthUser;
  token: string;
  instances: InstanceResponse[];
  onNavigateBack?: () => void;
}

/**
 * Navigation param types
 */
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  TeamPortal: {
    teamId: string;
    teamName: string;
  };
};

export type MainTabParamList = {
  Home: undefined;
  Events: undefined;
  Vendors: undefined;
  Venues: undefined;
};

export type DrawerParamList = {
  MainTabs: undefined;
  Profile: undefined;
};
