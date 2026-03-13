export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "hr" | "manager" | "employee";
  createdAt: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: StoredUser["role"];
}

const USERS_KEY = "qbt_users";
const SESSION_KEY = "qbt_session";
const SESSION_EXPIRY_KEY = "qbt_session_expiry";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

export function hashPassword(password: string, salt: string): string {
  const combined = salt + password + "qbt_secret_2026";
  let result = combined;
  for (let i = 0; i < 3; i++) {
    result = btoa(result).replace(/=/g, "").split("").reverse().join("");
  }
  return result;
}

export function generateSalt(): string {
  return btoa(Math.random().toString(36) + Date.now().toString(36)).slice(0, 16);
}

export function getStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function seedAdmin(): void {
  const users = getStoredUsers();
  const adminExists = users.some((u) => u.email === "admin@quibotech.com");
  if (!adminExists) {
    const salt = generateSalt();
    const adminUser: StoredUser = {
      id: "admin_001",
      name: "Administrator",
      email: "admin@quibotech.com",
      passwordHash: `${salt}:${hashPassword("admin123", salt)}`,
      role: "admin",
      createdAt: new Date().toISOString(),
    };
    saveUsers([adminUser, ...users]);
  }
}

export function loginUser(email: string, password: string): SessionUser | null {
  const users = getStoredUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;
  const [salt, storedHash] = user.passwordHash.split(":");
  if (!salt || !storedHash) return null;
  const attemptHash = hashPassword(password, salt);
  if (attemptHash !== storedHash) return null;
  const session: SessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem(SESSION_EXPIRY_KEY, String(Date.now() + SESSION_DURATION_MS));
  return session;
}

export function getSession(): SessionUser | null {
  try {
    const expiry = localStorage.getItem(SESSION_EXPIRY_KEY);
    if (!expiry || Date.now() > Number(expiry)) {
      clearSession();
      return null;
    }
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_EXPIRY_KEY);
}