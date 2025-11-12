import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import TeamComponentWrapper from '../../components/TeamComponentWrapper';
import { TeamDPlaceholder } from '@teamd/mobile-components';

/**
 * Team D Home Screen
 *
 * Integrated with Team D's mobile component package (@teamd/mobile-components).
 *
 * The TeamDPlaceholder component is imported from the @teamd/mobile-components package,
 * which is built from teams/teamD/src/mobile/ and linked as a workspace dependency.
 */
export default function TeamDHomeScreen() {
  const { user, token, instances } = useAuth();

  return (
    <TeamComponentWrapper
      user={user!}
      token={token!}
      instances={instances}
      teamName="Team D"
    >
      <TeamDPlaceholder user={user!} token={token!} instances={instances} />
    </TeamComponentWrapper>
  );
}
