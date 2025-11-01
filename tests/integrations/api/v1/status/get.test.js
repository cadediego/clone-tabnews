test("GET to /api/v1/status should return 200", async () => {
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
