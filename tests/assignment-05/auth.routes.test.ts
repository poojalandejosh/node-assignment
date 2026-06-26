import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import * as authService from "../../src/assignment-05/services/auth.service";
import authRoutes from "../../src/assignment-05/routes/auth.routes";

vi.mock("../../src/assignment-05/services/auth.service", () => ({
  login: vi.fn(),
}));

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

describe("POST /auth/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when email is missing", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ password: "secret123" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: "Email and password are required" });
    expect(authService.login).not.toHaveBeenCalled();
  });

  it("returns 400 when password is missing", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "user@example.com" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: "Email and password are required" });
    expect(authService.login).not.toHaveBeenCalled();
  });

  it("returns 401 when customer is not found", async () => {
    vi.mocked(authService.login).mockRejectedValue(
      new Error("Customer not found")
    );

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "missing@example.com", password: "secret123" });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Customer not found" });
  });

  it("returns 401 when password is invalid", async () => {
    vi.mocked(authService.login).mockRejectedValue(
      new Error("Invalid password")
    );

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "user@example.com", password: "wrong" });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Invalid password" });
  });

  it("returns 200 with token on successful login", async () => {
    vi.mocked(authService.login).mockResolvedValue({ token: "jwt-token" });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "user@example.com", password: "secret123" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Login successful",
      token: "jwt-token",
    });
    expect(authService.login).toHaveBeenCalledWith(
      "user@example.com",
      "secret123"
    );
  });

  it("returns 500 on unexpected errors", async () => {
    vi.mocked(authService.login).mockRejectedValue(
      new Error("Database connection failed")
    );

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "user@example.com", password: "secret123" });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "Internal server error" });
  });
});
