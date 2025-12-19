export interface DecodedAccessToken {
  userId: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  sub: string;
  iss: string;
  iat: number;
  exp: number;
  aud?: string;
}

export interface UserInfo {
  id: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  roles?: string[];
}

export enum IssuerType {
  LOCAL = 'local',
  MOODLE = 'moodle',
}
