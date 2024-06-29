// test/checkBody.test.js
const { checkBody } = require("../modules/checkBody");

test('checkBody returns true when all keys are present and not empty', () => {
   const body = { username: 'user', email: 'user@example.com', password: '123456' };
   const keys = ['username', 'email', 'password'];
   expect(checkBody(body, keys)).toBe(true);
});

test("checkBody returns false when a key is missing", () => {
  const body = { username: "user", email: "user@example.com" };
  const keys = ["username", "email", "password"];
  expect(checkBody(body, keys)).toBe(false);
});

test("checkBody returns false when a key is empty", () => {
  const body = { username: "", email: "user@example.com", password: "123456" };
  const keys = ["username", "email", "password"];
  expect(checkBody(body, keys)).toBe(false);
});