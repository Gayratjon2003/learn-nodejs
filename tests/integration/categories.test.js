const request = require("supertest");
let server;
const { Category } = require("../../models/category");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
describe("/api/categories", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Category.deleteMany({});
  });
  describe("GET /", () => {
    it("should return all categories", async () => {
      await Category.collection.insertMany([
        { name: "dasturlash" },
        { name: "tarmoqlar" },
        { name: "dizayn" },
      ]);
      const response = await request(server).get("/api/categories");
      expect(response.status).toBe(200);
      // expect(response.body.length).toBe(3);
      expect(
        response.body.some((cat) => cat.name == "dasturlash")
      ).toBeTruthy();
    });
  });
  describe("GET /:id", () => {
    it("should return a category if valid id is given", async () => {
      const category = new Category({ name: "sun'iy idrok" });
      await category.save();

      const response = await request(server).get(
        "/api/categories/" + category._id
      );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("name", "sun'iy idrok");
    });
    it("should return 404  if invalid id is given", async () => {
      const response = await request(server).get("/api/categories/123");
      expect(response.status).toBe(404);
    });
    it("should return 404 if category with the passed id exist", async () => {
      const categoryId = new mongoose.Types.ObjectId();
      const response = await request(server).get(
        "/api/categories/" + categoryId
      );
      expect(response.status).toBe(404);
    });
  });
});

describe("POST /", () => {
  let token;
  let name;

  // testlar uchun ishlatiladigan funktsiyalar va bu yerda oldindan
  // aniqlab olamiz va uni har bir test ichida alohida chaqiramiz
  const execute = async () => {
    return await request(server)
      .post("/api/categories")
      .set("x-auth-token", token)
      .send({ name });
  };
  beforeEach(() => {
    token = new User().generateAuthToken();
    name = "dasturlash";
  });
  it("should return 401 if user is not logged in", async () => {
    token = "";
    const res = await execute();
    expect(res.status).toBe(401);
  });
  it("should return 400 if category name is less than 3 characters", async () => {
    name = "12";
    const res = await execute();
    expect(res.status).toBe(400);
  });
  it("should return 400 if category nam is more than 50 characters", async () => {
    name = new Array(52).join("g");
    const res = await execute();
    expect(res.status).toBe(400);
  });
  it("should save the category if it is valid", async () => {
    await execute();
    const category = await Category.find({ name: "dasturlash" });
    expect(category).not.toBeNull();
  });
});

describe("PUT /:id", () => {
  let token;

  const execute = async () => {
    return await request(server)
      .put("/api/categories")
      .set("x-auth-token", token)
      .send("{}");
  };
  beforeEach(() => {
    token = new User().generateAuthToken();
  });
  it("Should return 200 if user logged in", async () => {
    const res = await execute();
    expect(res.status).toBe(200);
  });
});
