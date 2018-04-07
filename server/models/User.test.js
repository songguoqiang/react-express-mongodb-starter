const test_mongodb = require("../test_helper/in_memory_mongodb_setup");
const ValidationError = require("mongoose").ValidationError;

beforeAll(test_mongodb.setup);
afterAll(test_mongodb.teardown);

const User = require("./User");

describe("User model", () => {
  const name = "kevin";
  const email = "kevin@example.com";
  const newEmail = "gordon@example.com";

  let user = new User({ name, email });

  it("can be saved", async () => {
    await expect(user.save()).resolves.toBe(user);
  });

  it("should have createdAt and updatedAt timestamp after being saved", () => {
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
  });

  it("can be searched by _id", async () => {
    let searchResult = await User.findById(user._id);
    expect(searchResult.name).toEqual(name);
    expect(searchResult.email).toEqual(email);
  });

  it("can be searched by name", async () => {
    let searchResult = await User.findOne({ name });
    expect(searchResult.name).toEqual(name);
    expect(searchResult.email).toEqual(email);
  });

  it("can be searched by email", async () => {
    let searchResult = await User.findOne({ email });
    expect(searchResult.name).toEqual(name);
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

describe("Users have unique emails", () => {
  const name1 = "kevin";
  const email1 = "kevin@example.com";

  const name2 = "gordon";
  const email2 = "gordon@example.com";

  let user1 = new User({ name: name1, email: email1 });

  beforeEach(async () => await user1.save());

  it("should not allow two users with the same email", async () => {
    let userWithSameEmail = new User({ name: name2, email: email1 });
    await expect(userWithSameEmail.save()).rejects.toThrow(ValidationError);
  });

  it("should allow to create another user with unique email", async () => {
    let uniqueUser = new User({ name: name2, email: email2 });
    await expect(uniqueUser.save()).resolves.toBe(uniqueUser);
  });
});

describe("Two different users can have same names", () => {
  const name1 = "thomas";
  const email1 = "thomas@example.com";

  const email2 = "ben@example.com";

  let user1 = new User({ name: name1, email: email1 });

  beforeEach(async () => await user1.save());

  it("can allow two users with the same name", async () => {
    let userWithSameName = new User({ name: name1, email: email2 });
    await expect(userWithSameName.save()).resolves.toBe(userWithSameName);
  });
});

describe("The User model has some required fields", () => {
  const name1 = "peter";

  test("email is required", async () => {
    let userWithoutEmail = new User({
      name: name1
    });
    await expect(userWithoutEmail.save()).rejects.toThrow(ValidationError);
  });
});

describe("Users can have some optional attributes", () => {
  const email = "david@example.com";

  let user = new User({
    email: email
  });

  beforeEach(async () => await user.save());

  it("can have optional name field", async () => {
    user.name = "david";
    const savedUser = await user.save();
    expect(savedUser.name).toEqual("david");
  });

  it("can have optional picture field", async () => {
    const picture = "http://location-of-my-picture.jpg";
    user.picture = picture;
    const savedUser = await user.save();
    expect(savedUser.picture).toEqual(picture);
  });

  test("the picture field should be strings", async () => {
    user.picture = {};
    await expect(user.save()).rejects.toThrow(ValidationError);
  });
});

describe("Some fields in User model are case insensitive", () => {
  const name1 = "joe";
  const email1 = "joe@example.com";

  const name2 = "jack";
  const email2 = "jack@example.com";

  let user1 = new User({ name: name1, email: email1 });

  beforeEach(async () => await user1.save());

  test("email is case insensitive", async () => {
    let userWithSameEmailButDifferentCase = new User({
      name: name2,
      email: email1.toUpperCase()
    });
    await expect(userWithSameEmailButDifferentCase.save()).rejects.toThrow(
      ValidationError
    );
  });
});

describe("Some of the fields in User Model have required format", () => {
  test("email should follow the normal email format", async () => {
    let userWithInvalidEmail = new User({
      name: "jessie",
      email: "myemailexample.com" // missing @
    });
    await expect(userWithInvalidEmail.save()).rejects.toThrow(ValidationError);
  });
});

describe("Setting and validation of password field on User model", () => {
  const name = "kate";
  const email = "kate@example.com";
  const password = "mypassword";

  let user = new User({ name, email });

  beforeEach(async () => {
    await user.save();
  });

  it("should save user passwords into hashedPassword of User model", async () => {
    expect(user.hashedPassword).toBeUndefined();

    user.setPassword(password);

    expect(user.hashedPassword).toBeDefined();
    expect(user.hashedPassword).not.toBeNull();
  });

  it("should be able to verify user password afterwards", () => {
    expect(user.validPassword(password)).toBeTruthy();
  });
});

describe("JWT tokens", () => {
  const name = "jeff";
  const email = "jeff@example.com";

  let user = new User({ name, email });

  beforeEach(async () => {
    await user.save();
  });
  test("JWT tokens can be generated and verified", () => {
    const token = user.generateJWT();
    expect(user.verifyJWT(token)).toBeTruthy();
  });

  test("invalid JWT tokens cannot be verified", () => {
    expect(user.verifyJWT("invalid token")).toBeFalsy();
  });
});

describe("Generate user profile as JSON", () => {
  const name = "luke";
  const email = "luke@example.com";
  const picture = "user picture";

  let user = new User({ name, email, picture });

  beforeEach(async () => {
    await user.save();
  });

  it("should exclude JWT token in the response, if a request is neither for login nor sign up", () => {
    const userProfile = user.toJSON();
    expect(userProfile.name).toEqual(name);
    expect(userProfile.email).toEqual(email);
    expect(userProfile.picture).toEqual(picture);
    expect(userProfile.gravatar).toBeDefined();
    expect(userProfile.passwordResetToken).not.toBeDefined();
  });
});
