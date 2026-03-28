import { createMiddleware } from "hono/factory";
import { getCookie, setCookie } from "hono/cookie";
import { createHmac, randomUUID } from "crypto";

const SESSION_COOKIE = "anon_session";
const SECRET = process.env.SESSION_SECRET;

if (!SECRET) throw new Error("SESSION_SECRET env var is required");

export type Session = {
  sessionId: string;
  displayName: string;
};

// Extend Hono's context variables type so context.get('session') is typed
declare module "hono" {
  interface ContextVariableMap {
    session: Session;
  }
}

function sign(value: string): string {
  return createHmac("sha256", SECRET!).update(value).digest("hex");
}

function generateDisplayName(): string {
  const adjectives = [
    "Swift",
    "Quiet",
    "Brave",
    "Calm",
    "Wild",
    "Bold",
    "Keen",
  ];
  const animals = ["Fox", "Bear", "Wolf", "Hawk", "Lynx", "Deer", "Crow"];
  const num = Math.floor(Math.random() * 100);
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${adj} ${animal} ${num}`;
}

function parseSession(raw: string | undefined): Session | null {
  if (!raw) return null;
  try {
    const decoded = Buffer.from(raw, "base64").toString("utf8");
    const [sessionId, displayName, signature] = decoded.split("|");
    if (!sessionId || !displayName || !signature) return null;

    const expected = sign(`${sessionId}|${displayName}`);
    if (signature !== expected) return null; // tampered
    
    return { sessionId, displayName };
  } catch {
    return null;
  }
}

function createSession(): { session: Session; cookieValue: string } {
  const sessionId = randomUUID();
  const displayName = generateDisplayName();
  const signature = sign(`${sessionId}|${displayName}`);
  const cookieValue = Buffer.from(
    `${sessionId}|${displayName}|${signature}`,
  ).toString("base64");
  return { session: { sessionId, displayName }, cookieValue };
}

export const sessionMiddleware = createMiddleware(async (c, next) => {
  const raw = getCookie(c, SESSION_COOKIE);
  let session = parseSession(raw);

  if (!session) {
    const created = createSession();
    session = created.session;

    setCookie(c, SESSION_COOKIE, created.cookieValue, {
      httpOnly: true,
      sameSite: "Lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      secure: process.env.NODE_ENV === "production",
    });
  }

  c.set("session", session);
  await next();
});
