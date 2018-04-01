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

async function loginAsTom() {
  let email = fixtures.users.tom.email;
  let password = fixtures.users.tom.password;
  let response = await request(app)
    .post("/api/users/login")
    .send({ user: { email, password } });
  jwtToken = response.body.user.token;
}

describe("Accessing User API without login", () => {
  test("Get information on the current user", async () => {
    let response = await request(app).get("/api/user");
    expect(response.statusCode).toBe(401);
  });
  test("Update user profile", async () => {
    const newBio = "new-bio";
    const newImage = "new-image";

    const updatedUser = {
      bio: newBio,
      image: newImage
    };
    let response = await request(app)
      .put("/api/user")
      .send({ user: updatedUser });
    expect(response.statusCode).toBe(401);
  });
});

describe("Accessing User API after login", () => {
  beforeAll(loginAsTom);

  test("Get information on the current user", async () => {
    let response = await request(app)
      .get("/api/user")
      .set("Authorization", "Token " + jwtToken);
    let userJson = response.body.user;
    expect(response.statusCode).toBe(200);
    expect(userJson).toBeDefined();
    expect(userJson.email).toEqual(fixtures.users.tom.email);
    expect(userJson.token).toBeDefined();
    expect(userJson.token).not.toBeNull();
  });

  test("Update user profile", async () => {
    const newBio = "new-bio";
    const newImage = "new-image";

    const updatedUser = {
      bio: newBio,
      image: newImage
    };
    let response = await request(app)
      .put("/api/user")
      .send({ user: updatedUser })
      .set("Authorization", "Token " + jwtToken);

    let userJson = response.body.user;
    expect(response.statusCode).toBe(200);
    expect(userJson).toBeDefined();
    expect(userJson.bio).toEqual(newBio);
    expect(userJson.image).toEqual(newImage);
  });

  test("Update user profile with no user information", async () => {
    let response = await request(app)
      .put("/api/user")
      .send({})
      .set("Authorization", "Token " + jwtToken);
    expect(response.statusCode).toBe(422);
  });
});
