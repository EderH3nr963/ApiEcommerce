import session from "express-session";

interface TentativaLogin {
  count: number;
  email: string;
}

declare module "express-session" {
  interface SessionData {
    id_usuario?: number;
    is_admin?: boolean;
    tentativa_login?: TentativaLogin;
  }
}
