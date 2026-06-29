import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../../src/assignment-05/middleware/auth.middleware";

const createMockResponse = () => {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  } as unknown as Response;

  vi.mocked(res.status).mockReturnValue(res);
  vi.mocked(res.json).mockReturnValue(res);

  return res;
};

describe("authMiddleware", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";
    vi.clearAllMocks();
  });

  it("returns 401 when authorization header is missing", () => {
    const req = { headers: {} } as Request;
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when authorization header does not use Bearer scheme", () => {
    const req = { headers: { authorization: "Token abc" } } as Request;
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when bearer token is missing", () => {
    const req = { headers: { authorization: "Bearer " } } as Request;
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Auth token is missing" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when token is invalid", () => {
    const req = {
      headers: { authorization: "Bearer invalid-token" },
    } as Request;
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    expect(next).not.toHaveBeenCalled();
  });

  it("attaches decoded user and calls next for a valid token", () => {
    const token = jwt.sign({ id: 42 }, process.env.JWT_SECRET!);
    const req = {
      headers: { authorization: `Bearer ${token}` },
    } as Request & { user?: { id: number } };
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    authMiddleware(req, res, next);

    expect(req.user?.id).toBe(42);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
