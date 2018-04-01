process.env.NODE_ENV = "integration";

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
    expect(response.statusCode).toBe(200);
    expect(userJson).toBeDefined();
    expect(userJson.email).toEqual(email);
    expect(userJson.token).toBeDefined();
    expect(userJson.token).not.toBeNull();
  });

  test("Login with missing user email", async () => {
    let password = fixtures.users.tom.password;
    let response = await request(app)
      .post("/api/users/login")
      .send({ user: { password } });
    expect(response.statusCode).toBe(422);
    let responseErrors = response.body.errors;
    expect(responseErrors["email"]).toEqual(["can't be blank"]);
  });

  test("Login with invalid user email", async () => {
    let email = "bogus";
    let password = fixtures.users.tom.password;
    let response = await request(app)
      .post("/api/users/login")
      .send({ user: { email, password } });
    expect(response.statusCode).toBe(422);
    let responseErrors = response.body.errors;
    expect(responseErrors["email or password"]).toEqual(["is invalid"]);
  });

  test("Login with missing user password", async () => {
    let email = fixtures.users.tom.email;
    let response = await request(app)
      .post("/api/users/login")
      .send({ user: { email } });
    expect(response.statusCode).toBe(422);
    let responseErrors = response.body.errors;
    expect(responseErrors["password"]).toEqual(["can't be blank"]);
  });

  test("Login with invalid password", async () => {
    let email = fixtures.users.tom.email;
    let password = "bogus";
    let response = await request(app)
      .post("/api/users/login")
      .send({ user: { email, password } });
    expect(response.statusCode).toBe(422);
    let responseErrors = response.body.errors;
    expect(responseErrors["email or password"]).toEqual(["is invalid"]);
  });
});
