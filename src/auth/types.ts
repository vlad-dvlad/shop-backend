export type LoginPayload = {
  email: string;
  password: string;
};

export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}
