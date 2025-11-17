import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitforAllServices();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous User", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      expect(response.status).toBe(200);

      const ResponseBody = await response.json();
      expect(ResponseBody.update_date).toBeDefined();

      const UpdateAtParsed = new Date(ResponseBody.update_date).toISOString();
      expect(ResponseBody.update_date).toEqual(UpdateAtParsed);

      expect(ResponseBody.dependences.database.version).toEqual("18.0");
      expect(ResponseBody.dependences.database.max_connections).toEqual(100);
      expect(ResponseBody.dependences.database.open_connections).toEqual(1);
    });
  });
});
