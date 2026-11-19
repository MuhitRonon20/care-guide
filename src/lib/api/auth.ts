import { LoginFormData } from "@/lib/validations/auth";
import { mockDb } from "@/mock/mock-db";
import { User } from "@/types";
import { apiClient, IS_MOCK_MODE, simulateLatency } from "./client";

export async function loginApi(credentials: LoginFormData): Promise<User> {
  if (IS_MOCK_MODE) {
    await simulateLatency(300);
    // Development verification
    if (credentials.password === "error123") {
      throw new Error("Invalid email or password combination");
    }
    return mockDb.login(credentials.email);
  }

  return apiClient<User>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function logoutApi(): Promise<void> {
  if (IS_MOCK_MODE) {
    await simulateLatency(150);
    mockDb.logout();
    return;
  }

  await apiClient<{ success: boolean }>("/auth/logout", {
    method: "POST",
  });
}

export async function getCurrentUserApi(): Promise<User | null> {
  if (IS_MOCK_MODE) {
    await simulateLatency(100);
    return mockDb.getCurrentUser();
  }

  try {
    return await apiClient<User>("/auth/me", {
      method: "GET",
    });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "statusCode" in err && (err as { statusCode: number }).statusCode === 401) {
      return null;
    }
    throw err;
  }
}

