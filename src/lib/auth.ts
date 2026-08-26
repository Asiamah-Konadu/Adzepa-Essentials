import { cookies } from "next/headers";

// Uses the Web Crypto API (globalThis.crypto.subtle) rather than Node's
// "crypto" module so this file works identically in the Node.js runtime
// (API routes, server components) and the Edge runtime (middleware).

const COOKIE_NAME = "adzepa_admin_session";
const SESSION_LENGTH_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set. Add it to your environment variables."
    );
  }
  return secret;
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Verifies the submitted admin credentials against environment variables.
 * This is intentionally simple for an MVP — for a growing team, replace with
 * a proper hashed-password AdminUser table (already modeled in schema.prisma
 * but not wired up here) plus rate limiting on the login route.
 */
export function verifyAdminCredentials(email: string, password: string): boolean {
  const validEmail = process.env.ADMIN_EMAIL;
  const validPassword = process.env.ADMIN_PASSWORD;
  if (!validEmail || !validPassword) return false;
  return email === validEmail && password === validPassword;
}

export async function createSessionCookieValue(email: string): Promise<string> {
  const expires = Date.now() + SESSION_LENGTH_MS;
  const payload = `${email}.${expires}`;
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

export async function isValidSessionValue(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 3) return false;
  const [email, expiresStr, signature] = parts;
  const payload = `${email}.${expiresStr}`;
  const expectedSignature = await sign(payload);
  if (signature !== expectedSignature) return false;
  const expires = Number(expiresStr);
  if (Number.isNaN(expires) || Date.now() > expires) return false;
  return true;
}

export async function getAdminSession(): Promise<boolean> {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  return isValidSessionValue(value);
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
export const ADMIN_COOKIE_MAX_AGE = Math.floor(SESSION_LENGTH_MS / 1000);

/**
 * Guard for admin API routes. Returns true if the request carries a valid
 * admin session cookie. Every /api/admin/* route must call this before
 * touching the database.
 */
export async function requireAdmin(): Promise<boolean> {
  return getAdminSession();
}
