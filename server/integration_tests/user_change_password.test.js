process.env.NODE_ENV = "integration";

const testDB = require("../test_helper/in_memory_mongodb_setup");
const fixtureLoader = require("../test_helper/fixtures");
const fixtures = require("../test_helper/fixtures").fixtures;
const request = require("supertest");
const app = require("../app");

beforeAll(testDB.setup);
beforeAll(fixtureLoader.load);

afterAll(testDB.teardown);

let jwtToken;

async function loginAsTom(password) {
  let email = fixtures.users.tom.email;
  let response = await request(app)
    .post("/api/users/login")
    .send({ user: { email, password } });

  expect(response.statusCode).toBe(200);
  jwtToken = response.body.user.token;
}

test("Change password on the current user", async () => {
  await loginAsTom(fixtures.users.tom.password);

  const newPassword = "new-password";
  const updatedUser = {
    password: newPassword
  };

  let response = await request(app)
    .put("/api/user")
    .send({ user: updatedUser })
    .set("Authorization", "Token " + jwtToken);

  expect(response.statusCode).toBe(200);

  await loginAsTom(newPassword);
});
