process.env.NODE_ENV = "test";

const testDB = require("../test_helper/in_memory_mongodb_setup");
const fixtureLoader = require("../test_helper/fixtures");
const fixtures = require("../test_helper/fixtures").fixtures;
const request = require("supertest");
const app = require("../app");

beforeAll(testDB.setup);
beforeAll(fixtureLoader.load);

afterAll(testDB.teardown);

describe("User authentication", () => {
  test("User login successfully", async () => {
    let email = fixtures.users.tom.email;
    let password = fixtures.users.tom.password;
    let response = await request(app)
      .post("/api/users/login")
      .send({ user: { email, password } });

    let userJson = response.body.user;
    let jwtToken = response.body.token;
    expect(response.statusCode).toBe(200);
    expect(userJson).toBeDefined();
    expect(userJson.email).toEqual(email);
    expect(jwtToken).toBeDefined();
    expect(jwtToken).not.toBeNull();
  });

  test("Login with missing user email", async () => {
    let password = fixtures.users.tom.password;
    let response = await request(app)
      .post("/api/users/login")
      .send({ user: { password } });
    expect(response.statusCode).toBe(401);
    let message = response.body.msg;
    expect(message).toMatch(/email/);
  });

  test("Login with invalid user email", async () => {
    let email = "bogus";
    let password = fixtures.users.tom.password;
    let response = await request(app)
      .post("/api/users/login")
      .send({ user: { email, password } });
    expect(response.statusCode).toBe(401);
    let message = response.body.msg;
    expect(message).toMatch(/invalid/);
  });

  test("Login with missing user password", async () => {
    let email = fixtures.users.tom.email;
    let response = await request(app)
      .post("/api/users/login")
      .send({ user: { email } });
    expect(response.statusCode).toBe(401);
    let message = response.body.msg;
    expect(message).toMatch(/password/);
  });

  test("Login with invalid password", async () => {
    let email = fixtures.users.tom.email;
    let password = "bogus";
    let response = await request(app)
      .post("/api/users/login")
      .send({ user: { email, password } });
    expect(response.statusCode).toBe(401);
    let message = response.body.msg;
    expect(message).toMatch(/invalid/);
  });
});
