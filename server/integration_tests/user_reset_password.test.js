process.env.NODE_ENV = "test";

const lolex = require("lolex");

const testDB = require("../test_helper/in_memory_mongodb_setup");
const fixtureLoader = require("../test_helper/fixtures");
const fixtures = require("../test_helper/fixtures").fixtures;
const request = require("supertest");
const User = require("../models/User");

const mockEmailService = {
  sendText: jest.fn()
};

jest.mock("../utils/email_service.js", () => {
  return mockEmailService;
});

const app = require("../app");

beforeAll(testDB.setup);
beforeAll(fixtureLoader.load);

afterAll(testDB.teardown);

async function generateResetPasswordToken(email) {
  let response = await request(app)
    .post("/api/user/forgot-password")
    .send({ user: { email } });

  expect(response.statusCode).toBe(200);
  expect(mockEmailService.sendText).toHaveBeenCalledTimes(1);
  expect(mockEmailService.sendText.mock.calls[0][1]).toEqual(email);
  mockEmailService.sendText.mockClear();
}

async function resetPassword(email, passwordResetToken, newPassword) {
  let response = await request(app)
    .post("/api/user/reset-password/" + passwordResetToken)
    .send({ user: { password: newPassword } });

  expect(response.statusCode).toBe(200);
  expect(mockEmailService.sendText).toHaveBeenCalledTimes(1);
  expect(mockEmailService.sendText.mock.calls[0][1]).toEqual(email);
  mockEmailService.sendText.mockClear();
}

async function getPasswordResetToken(email) {
  let tom = await User.findOne({ email });
  expect(tom.passwordResetToken).toBeTruthy();
  return tom.passwordResetToken;
}

async function login(email, password) {
  let response = await request(app)
    .post("/api/users/login")
    .send({ user: { email, password } });

  expect(response.statusCode).toBe(200);
}

describe("User forgets and resets his password", () => {
  test("Reset password successfully", async () => {
    let email = fixtures.users.tom.email;
    await generateResetPasswordToken(email);
    const passwordResetToken = await getPasswordResetToken(email);
    const newPassword = "I won't forget again";
    await resetPassword(email, passwordResetToken, newPassword);
    await login(email, newPassword);
  });
});

describe("Password reset token is only valid for one hour", () => {
  let clock;
  beforeEach(() => {
    clock = lolex.install();
  });
  afterEach(() => {
    clock = clock.uninstall();
  });

  test("Reset password after the password reset token expires", async () => {
    let email = fixtures.users.tom.email;
    await generateResetPasswordToken(email);
    const passwordResetToken = await getPasswordResetToken(email);
    const newPassword = "I won't forget again";

    // one hour later
    clock.tick("01:00:00");

    let response = await request(app)
      .post("/api/user/reset-password/" + passwordResetToken)
      .send({ user: { password: newPassword } });

    expect(response.statusCode).toBe(400);
    const message = response.body.msg;
    expect(message).toEqual("Password reset token is invalid or has expired.");
  });
});

describe("Hacker tries to hack this system", () => {
  test("Don't tell hacker if an email is registered with the system or not", async () => {
    const email = "bogus";
    let response = await request(app)
      .post("/api/user/forgot-password")
      .send({ user: { email } });

    expect(response.statusCode).toBe(200);
  });

  test("Reset password with invalid token", async () => {
    const passwordResetToken = "bogus";
    const newPassword = "I won't forget again";
    let response = await request(app)
      .post("/api/user/reset-password/" + passwordResetToken)
      .send({ user: { password: newPassword } });

    expect(response.statusCode).toBe(400);
  });
});
