const test_mongodb = require("../test_helper/in_memory_mongodb_setup");
const ValidationError = require("mongoose").ValidationError;

beforeAll(test_mongodb.setup);
afterAll(test_mongodb.teardown);

const User = require("./User");

describe("User model", () => {
  const username = "kevin";
  const email = "kevin@example.com";
  const newEmail = "gordon@example.com";

  let user = new User({ username, email });

  it("can be saved", async () => {
    await expect(user.save()).resolves.toBe(user);
  });

  it("should have createdAt and updatedAt timestamp after being saved", () => {
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
  });

  it("can be searched by _id", async () => {
    let searchResult = await User.findById(user._id);
    expect(searchResult.username).toEqual(username);
    expect(searchResult.email).toEqual(email);
  });

  it("can be searched by username", async () => {
    let searchResult = await User.findOne({ username });
    expect(searchResult.username).toEqual(username);
    expect(searchResult.email).toEqual(email);
  });

  it("can be searched by email", async () => {
    let searchResult = await User.findOne({ email });
    expect(searchResult.username).toEqual(username);
    expect(searchResult.email).toEqual(email);
  });

  it("can be updated", async () => {
    user.email = newEmail;
    await user.save();
    let searchResult = await User.findById(user._id);
    expect(searchResult.email).toEqual(newEmail);
  });

  it("can be deleted", async () => {
    await user.remove();
    let searchResult = await User.findById(user._id);
    expect(searchResult).toBeNull();
  });
});

describe("Unique fields in User model", () => {
  const username1 = "kevin";
  const email1 = "kevin@example.com";

  const username2 = "gordon";
  const email2 = "gordon@example.com";

  let user1 = new User({ username: username1, email: email1 });

  beforeEach(async () => await user1.save());

  it("should not allow two users with the same name", async () => {
    let userWithSameName = new User({ username: username1, email: email2 });
    await expect(userWithSameName.save()).rejects.toThrow(ValidationError);
  });

  it("should not allow two users with the email", async () => {
    let userWithSameEmail = new User({ username: username2, email: email1 });
    await expect(userWithSameEmail.save()).rejects.toThrow(ValidationError);
  });

  it("should allow to create another user with unique name and email", async () => {
    let uniqueUser = new User({ username: username2, email: email2 });
    await expect(uniqueUser.save()).resolves.toBe(uniqueUser);
  });
});

describe("Some fields in User model are case insensitive", () => {
  const username1 = "joe";
  const email1 = "joe@example.com";

  const username2 = "jack";
  const email2 = "jack@example.com";

  let user1 = new User({ username: username1, email: email1 });

  beforeEach(async () => await user1.save());

  test("username is case insensitive", async () => {
    let userWithSameNameButDifferentCase = new User({
      username: username1.toUpperCase(),
      email: email2
    });
    await expect(userWithSameNameButDifferentCase.save()).rejects.toThrow(
      ValidationError
    );
  });

  test("email is case insensitive", async () => {
    let userWithSameEmailButDifferentCase = new User({
      username: username2,
      email: email1.toUpperCase()
    });
    await expect(userWithSameEmailButDifferentCase.save()).rejects.toThrow(
      ValidationError
    );
  });
});

describe("Some of the fields in User model are required", () => {
  const username1 = "peter";
  const email1 = "peter@example.com";

  test("username is required", async () => {
    let userWithoutName = new User({
      email: email1
    });
    await expect(userWithoutName.save()).rejects.toThrow(ValidationError);
  });

  test("email is required", async () => {
    let userWithoutEmail = new User({
      username: username1
    });
    await expect(userWithoutEmail.save()).rejects.toThrow(ValidationError);
  });
});

describe("Some of the fields in User Model have required format", () => {
  test("username can only contain alphanumeric alphabets", async () => {
    let userWithInvalidName = new User({
      username: "Tom_Peter", // _ is not allowed here
      email: "myemail@example.com"
    });
    await expect(userWithInvalidName.save()).rejects.toThrow(ValidationError);
  });

  test("email should follow the normal email format", async () => {
    let userWithInvalidEmail = new User({
      username: "jessie",
      email: "myemailexample.com" // missing @
    });
    await expect(userWithInvalidEmail.save()).rejects.toThrow(ValidationError);
  });
});

describe("Setting and validation of password field on User model", () => {
  const username = "kate";
  const email = "kate@example.com";
  const password = "mypassword";

  let user = new User({ username, email });

  beforeEach(async () => {
    await user.save();
  });

  it("should save user passwords into hash and salt fields of User model", async () => {
    expect(user.salt).toBeUndefined();
    expect(user.hash).toBeUndefined();

    user.setPassword(password);

    expect(user.salt).toBeDefined();
    expect(user.salt).not.toBeNull();
    expect(user.hash).toBeDefined();
    expect(user.hash).not.toBeNull();
  });

  it("should be able to verify user password afterwards", () => {
    expect(user.validPassword(password)).toBeTruthy();
  });
});

describe("JWT tokens", () => {
  const username = "jeff";
  const email = "jeff@example.com";

  let user = new User({ username, email });

  beforeEach(async () => {
    await user.save();
  });
  test("JWT tokens can be generated and verified", () => {
    const token = user.generateJWT();
    expect(user.verifyJWT(token)).toBeTruthy();
  });

  test("invalid JWT toekns cannot be verified", () => {
    expect(user.verifyJWT("invalid token")).toBeFalsy();
  });
});

describe("Generate user profile as JSON", () => {
  const username = "luke";
  const email = "luke@example.com";
  const bio = "user bio";
  const image = "image location";

  let user = new User({ username, email, bio, image });

  beforeEach(async () => {
    await user.save();
  });
  it("should return user profile as JSON (after user login)", () => {
    const userProfile = user.toAuthJSON();
    expect(userProfile.username).toEqual(username);
    expect(userProfile.email).toEqual(email);
    expect(userProfile.bio).toEqual(bio);
    expect(userProfile.image).toEqual(image);
    expect(userProfile.token).toBeDefined();
  });
});
