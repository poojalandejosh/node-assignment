import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { UniqueConstraintError } from "sequelize";
import * as customerService from "../../src/assignment-05/services/customer.service";
import customerRoutes from "../../src/assignment-05/routes/customer.routes";

vi.mock("../../src/assignment-05/services/customer.service", () => ({
  createCustomer: vi.fn(),
  getCustomer: vi.fn(),
  updateCustomer: vi.fn(),
  deletCustomer: vi.fn(),
}));

vi.mock("../../src/assignment-05/middleware/auth.middleware", () => ({
  authMiddleware: (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ) => {
    (req as express.Request & { user: { id: number } }).user = { id: 1 };
    next();
  },
}));

const app = express();
app.use(express.json());
app.use("/customer", customerRoutes);

const validCustomer = {
  first_name: "Jane",
  last_name: "Doe",
  email: "jane@example.com",
  password: "secret123",
};

describe("POST /customer/create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/customer/create")
      .send({ first_name: "Jane" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: "first_name, last_name, email and password are required",
    });
    expect(customerService.createCustomer).not.toHaveBeenCalled();
  });

  it("returns 201 when customer is created successfully", async () => {
    vi.mocked(customerService.createCustomer).mockResolvedValue({
      id: 1,
    } as Awaited<ReturnType<typeof customerService.createCustomer>>);

    const res = await request(app)
      .post("/customer/create")
      .send(validCustomer);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      message: "Employee created successfully",
      employeeId: 1,
    });
    expect(customerService.createCustomer).toHaveBeenCalledWith(
      validCustomer.first_name,
      validCustomer.last_name,
      validCustomer.email,
      validCustomer.password
    );
  });

  it("returns 409 when email already exists", async () => {
    vi.mocked(customerService.createCustomer).mockRejectedValue(
      new UniqueConstraintError({ message: "Validation error", errors: [] })
    );

    const res = await request(app)
      .post("/customer/create")
      .send(validCustomer);

    expect(res.status).toBe(409);
    expect(res.body).toEqual({ message: "Email already exists" });
  });

  it("returns 500 on unexpected errors", async () => {
    vi.mocked(customerService.createCustomer).mockRejectedValue(
      new Error("Database error")
    );

    const res = await request(app)
      .post("/customer/create")
      .send(validCustomer);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "Internal server error" });
  });
});

describe("GET /customer/", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with customer list", async () => {
    const customers = [
      {
        id: 1,
        first_name: "Jane",
        last_name: "Doe",
        email: "jane@example.com",
      },
    ];
    vi.mocked(customerService.getCustomer).mockResolvedValue(
      customers as Awaited<ReturnType<typeof customerService.getCustomer>>
    );

    const res = await request(app).get("/customer/");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Employees fetched successfully",
      employee: customers,
    });
  });

  it("returns 500 on service error", async () => {
    vi.mocked(customerService.getCustomer).mockRejectedValue(
      new Error("Database error")
    );

    const res = await request(app).get("/customer/");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "Internal server error" });
  });
});

describe("PUT /customer/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 404 when customer is not found", async () => {
    vi.mocked(customerService.updateCustomer).mockResolvedValue(0);

    const res = await request(app)
      .put("/customer/99")
      .send(validCustomer);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Employee not found" });
  });

  it("returns 200 when customer is updated successfully", async () => {
    vi.mocked(customerService.updateCustomer).mockResolvedValue(1);

    const res = await request(app)
      .put("/customer/1")
      .send(validCustomer);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Employee updated successfully" });
    expect(customerService.updateCustomer).toHaveBeenCalledWith(
      1,
      validCustomer.first_name,
      validCustomer.last_name,
      validCustomer.email,
      validCustomer.password
    );
  });

  it("returns 500 on service error", async () => {
    vi.mocked(customerService.updateCustomer).mockRejectedValue(
      new Error("Database error")
    );

    const res = await request(app)
      .put("/customer/1")
      .send(validCustomer);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "Internal server error" });
  });
});

describe("DELETE /customer/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 404 when customer is not found", async () => {
    vi.mocked(customerService.deletCustomer).mockResolvedValue(0);

    const res = await request(app).delete("/customer/99");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Employee not found" });
  });

  it("returns 200 when customer is deleted successfully", async () => {
    vi.mocked(customerService.deletCustomer).mockResolvedValue(1);

    const res = await request(app).delete("/customer/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Employee deleted successfully" });
    expect(customerService.deletCustomer).toHaveBeenCalledWith(1);
  });

  it("returns 500 on service error", async () => {
    vi.mocked(customerService.deletCustomer).mockRejectedValue(
      new Error("Database error")
    );

    const res = await request(app).delete("/customer/1");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      message: "Internal server error",
      error: "Database error",
    });
  });
});
