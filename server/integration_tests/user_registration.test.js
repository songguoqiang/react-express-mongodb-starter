process.env.NODE_ENV = "test";

const testDB = require("../test_helper/in_memory_mongodb_setup");
const fixtureLoader = require("../test_helper/fixtures");
const fixtures = require("../test_helper/fixtures").fixtures;
const request = require("supertest");
const app = require("../app");

beforeAll(testDB.setup);
beforeAll(fixtureLoader.load);

afterAll(testDB.teardown);

describe("New user registration", () => {
  test("Register a new user successfully", async () => {
    const name = "luke";
    const email = "luke@example.com";
    const password = "mypassword";

    let response = await request(app)
      .post("/api/users/signup")
      .send({ user: { name, email, password } });
    let userJson = response.body.user;
    let jwtToken = response.body.token;

    expect(response.statusCode).toBe(200);
    expect(userJson).toBeDefined();
    expect(userJson.name).toEqual(name);
    expect(userJson.email).toEqual(email);
    expect(jwtToken).toBeDefined();
  });

  test("Register with duplicated email should fail", async () => {
    const name = "randomname";
    const email = fixtures.users.tom.email;
    const password = "mypassword";
    let response = await request(app)
      .post("/api/users/signup")
      .send({ user: { name, email, password } });

    expect(response.statusCode).toBe(422);
    const message = response.body.msg;
    expect(message).toMatch(/email/);
  });
});
