process.env.NODE_ENV = "integration";

const testDB = require("../test_helper/in_memory_mongodb_setup");
const fixtureLoader = require("../test_helper/fixtures");
const fixtures = require("../test_helper/fixtures").fixtures;
const loginAs = require("../test_helper/login");

const request = require("supertest");
const app = require("../app");

beforeAll(testDB.setup);
beforeAll(fixtureLoader.load);

afterAll(testDB.teardown);

describe("User profile", () => {
  test("Get user profile with unknown username", async () => {
    let response = await request(app).get("/api/profiles/badname");
    expect(response.status).toBe(404);
  });
  test("Get user profiles without login", async () => {
    let response = await request(app).get("/api/profiles/tom");
    expect(response.status).toBe(200);

    let userProfile = response.body.profile;
    expect(userProfile.username).toBe(fixtures.users.tom.username);
    expect(userProfile.image).toBeDefined();
    expect(userProfile.following).toBeDefined();
  });

  test("Get user profiles after login", async () => {
    let loginUser = fixtures.users.jacky;
    let loginResponse = await loginAs(app, loginUser.email, loginUser.password);
    let jwtToken = loginResponse.token;

    let response = await request(app)
      .get("/api/profiles/tom")
      .set("Authorization", "Token " + jwtToken);
    expect(response.status).toBe(200);

    let userProfile = response.body.profile;
    expect(userProfile.username).toBe(fixtures.users.tom.username);
    expect(userProfile.image).toBeDefined();
    expect(userProfile.following).toBeDefined();
  });
});
