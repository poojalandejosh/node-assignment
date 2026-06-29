import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import * as customerService from "../../src/assignment-05/services/customer.service";
import { createAssignment05App } from "../helpers/create-assignment-05-app";

vi.mock("../../src/assignment-05/services/customer.service", () => ({
  createCustomer: vi.fn(),
  getCustomer: vi.fn(),
  updateCustomer: vi.fn(),
  deletCustomer: vi.fn(),
}));

const app = createAssignment05App();

describe("Protected customer routes", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";
    vi.clearAllMocks();
  });

  it("returns 401 for POST /customer/create without token", async () => {
    const res = await request(app).post("/customer/create").send({
      first_name: "Jane",
      last_name: "Doe",
      email: "jane@example.com",
      password: "secret123",
    });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Unauthorized" });
    expect(customerService.createCustomer).not.toHaveBeenCalled();
  });

  it("returns 401 for GET /customer/ without token", async () => {
    const res = await request(app).get("/customer/");

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Unauthorized" });
    expect(customerService.getCustomer).not.toHaveBeenCalled();
  });

  it("returns 401 for PUT /customer/:id without token", async () => {
    const res = await request(app).put("/customer/1").send({
      first_name: "Jane",
      last_name: "Doe",
      email: "jane@example.com",
      password: "secret123",
    });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Unauthorized" });
    expect(customerService.updateCustomer).not.toHaveBeenCalled();
  });

  it("returns 401 for DELETE /customer/:id without token", async () => {
    const res = await request(app).delete("/customer/1");

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Unauthorized" });
    expect(customerService.deletCustomer).not.toHaveBeenCalled();
  });

  it("allows GET /customer/ with a valid token", async () => {
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET!);
    vi.mocked(customerService.getCustomer).mockResolvedValue([]);

    const res = await request(app)
      .get("/customer/")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(customerService.getCustomer).toHaveBeenCalled();
  });
});
