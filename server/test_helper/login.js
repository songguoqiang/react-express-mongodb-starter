const request = require("supertest");

async function loginAs(app, email, password) {
  let response = await request(app)
    .post("/api/users/login")
    .send({ user: { email, password } });

  expect(response.statusCode).toBe(200);
  return response.body.token;
}

module.exports = loginAs;
