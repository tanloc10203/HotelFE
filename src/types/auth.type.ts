export interface LoginPayload {
  username: string;
  password: string;
}

export interface ChangePasswordPayload {
  password: string;
  newPassword: string;
  confirmPassword?: string;
}

export enum EndPointUser {
  Employee = "/Employee",
  Owner = "/Owner",
}

export interface AuthResponse {
  accessToken: string;
}

export type RoleStates = "OWNER" | "EMPLOYEE";

export interface ForgotPasswordPayload {
  username: string;
  email: string;
}
