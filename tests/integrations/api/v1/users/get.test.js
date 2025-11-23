import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitforAllServices();
  await orchestrator.clearDatabase();
});

describe("GET /api/v1/users", () => {
  describe("Anonymous User", () => {
    test("Running Pending migrations", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations");
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThan(0);
    });
  });
});
