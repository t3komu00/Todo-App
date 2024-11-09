/* eslint-disable jest/valid-expect */
import { expect } from "chai";
import { before } from "mocha";
import fetch from "node-fetch";
import { getToken, initializeTestDb, insertTestUser } from "./helper/test.js";

const base_url = "http://localhost:3001/";

describe("GET Tasks", () => {
  before(() => {
    initializeTestDb();
  });

  it("should get all tasks", async () => {
    const response = await fetch(base_url);
    const data = await response.json();

    expect(response.status).to.equal(200);
    expect(data).to.be.an("array").that.is.not.empty;
    expect(data[0]).to.include.all.keys("id", "description");
  });
});

describe("POST task", () => {
  // before(() => {
  //   initializeTestDb();
  // });
  const email = "post@foo.com";
  const password = "post123";
  insertTestUser(email, password);
  const token = getToken(email);
  it("should post a task", async () => {
    const response = await fetch(base_url + "create", {
      method: "post",
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ description: "Task from Unit test" }),
    });
    const data = await response.json();
    expect(response.status).to.equal(200);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("id");
  });

  it("should not post a task without description", async () => {
    const response = await fetch(base_url + "create", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ description: null }),
    });

    const data = await response.json();
    expect(response.status).to.equal(400);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("error");
  });
});

describe("DELETE task", () => {
  // const email = "post@foo.com";
  // const password = "post123";
  // insertTestUser(email, password);
  // const token = getToken(email);
  it("should delete a task", async () => {
    const response = await fetch(base_url + "delete/1", {
      method: "delete",
      headers: {
        "Content-type": "application/json",
        // Authorization: token,
      },
      body: JSON.stringify({ id: 2 }),
    });
    const data = await response.json();
    expect(response.status).to.equal(200);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("id");
  });

  it("should not delete a task with SQL injection", async () => {
    const response = await fetch(base_url + "delete/id=0 or id > 0", {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    expect(response.status).to.equal(500);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("error");
  });
});

describe("POST register", () => {
  before(() => {
    initializeTestDb();
  });
  const email = "register@foo.com";
  const password = "register123";

  it("should register with valid email and password", async () => {
    const response = await fetch(base_url + "user/register", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    const data = await response.json();
    expect(response.status).to.equal(201, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("id", "email");
  });

  it("should not register with less than 8 character password", async () => {
    const email = "register@foo.com";
    const password = "short1";
    const response = await fetch(base_url + "user/register", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });

    const data = await response.json();
    expect(response.status).to.equal(400, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("error");
  });
});

describe("POST login", () => {
  beforeEach(async () => {
    await insertTestUser(email, password);
  });
  const email = "login@foo.com";
  const password = "login123";
  insertTestUser(email, password);

  it("should login with valid credentials", async () => {
    const response = await fetch(base_url + "user/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });

    const data = await response.json();

    expect(response.status).to.equal(200, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("id", "email", "token");
  });
});
