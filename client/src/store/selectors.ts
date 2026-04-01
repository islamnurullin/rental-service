import { State } from '../types/state';
import { AuthorizationStatusType } from '../types/authorization-status';


export const getAuthorizationStatus = (state: State): AuthorizationStatusType =>
 state.app.authorizationStatus;

export const getAuthorizationError = (state: State): string | null =>
  state.app.error;