export { };

declare module "express-session" {
  interface Session {
    user: {
      name: string;
      id: number;
    } | null;
  }
}
