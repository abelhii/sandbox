import type { Context } from "hono";
import type { Session } from "../middleware/session.ts";

export type AppContext = {
  session: Session;
};

export function createContext(c: Context): AppContext {
  return {
    session: c.get("session"),
  };
}
