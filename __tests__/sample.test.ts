import {
  test,
  it,
  describe,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";
import supertest from "supertest";
import { Request, Response } from "express";
import mongoose from "mongoose";
import app from "../src/app";

import dotenv from "dotenv";
dotenv.config();
const DB_URL = process.env.MONGO_DB_TEST;
beforeAll(async () => {
  //await mongoose.connect(DB_URL as string)
  await mongoose.connect(process.env.DB as string);
}, 100000);
afterAll(async () => {
  await mongoose.connection.close();
});
let token = "";
let blogId = "";
//jest tests
describe("Authentication testing", () => {
  it(" user signingup with existing email", async () => {
    const response = await supertest(app).post("/api/signup").send({
      name: "ashley",
      email: "ashley250@gmail.com",
      password: "alshley250",
    });
    expect(response.statusCode).toBe(500);
  });

  // it(" user signingup  successful", async () => {
  //   let r = (Math.random() + 1).toString(36).substring(5);
  //   const response = await supertest(app)
  //     .post("/api/signup")
  //     .send({
  //       "name":"Aline",
  //       "email":`aline12250@gmail.com`,
  //       "password":"aline345"
  //     });
  //   expect(response.statusCode).toBe(200);
  // });

  // it(" user signingup  without email", async () => {
  //   const response = await supertest(app).post("/api/signup").send({
  //     name: "ashley",
  //     // email: "janet250.gmail",
  //     password: "alshley250",
  //   });
  //   expect(response.statusCode).toBe(400);
  // });

  it(" user login  successful", async () => {
    const response = await supertest(app).post("/api/login").send({
      email: "barbie63@gmail.com",
      password: "life@250",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    token = response.body.token;
  });

  it(" user login  without all input fields", async () => {
    const response = await supertest(app).post("/api/login").send({
      email: "barbie63@gmail.com",
    });
    expect(response.statusCode).toBe(404);
  });

  it(" user login  when user not found", async () => {
    const response = await supertest(app).post("/api/login").send({
      email: "baaaaarbie63@gmail.com",
      password: "life@250",
    });
    expect(response.statusCode).toBe(404);
  });

  it(" password does not match", async () => {
    const response = await supertest(app).post("/api/login").send({
      email: "barbie63@gmail.com",
      password: "life@250janet",
    });
    expect(response.statusCode).toBe(404);
  });
  //getting blog
  it(" get blog", async () => {
    const response = await supertest(app).get("/api/blogs");
    expect(response.statusCode).toBe(200);
    console.log(response.body)
    blogId = response.body.blog[0]._id;
    console.log(blogId);
  });

  it(" create comment without authentication", async () => {
    let id = "65cf22988827edb747def94a";
    const response = await supertest(app).post(`/api/blogs/${id}/comments`);
    expect(response.statusCode).toBe(401);
  });

  it("  comment sucessfully", async () => {
    let id = "65cf22988827edb747def94a";
    const response = await supertest(app)
      .post(`/api/blogs/${blogId}/comments`)
      .send({
        name: "janet",
        comment: "good work",
      })
      .set("Authorization", token);
    expect(response.statusCode).toBe(200);
  });

  it("  comment validation", async () => {
    let id = "65cc9c44c21d1b699d7cc4f7";
    const response = await supertest(app)
      .post(`/api/blogs/${id}/comments`)
      .send({
        name: "janet",
        comment: "",
      })
      .set("Authorization", token);
    expect(response.statusCode).toBe(403);
  });

  it(" delete comment without authorization", async () => {
    let id = "65cf22988827edb747def94a";
    const response = await supertest(app).delete(`/api/comments/${id}`);
    expect(response.statusCode).toBe(401);
  });

  it(" posting like without authentication", async () => {
    let id = "65cf22988827edb747def94a";
    const response = await supertest(app).post(`/api/blogs/${id}/likes`);
    expect(response.statusCode).toBe(401);
  });
  it(" posting like with authentication", async () => {
    let id = "65cf22988827edb747def94a";
    const response = await supertest(app)
      .post(`/api/blogs/${id}/likes`)
      .set("Authorization", token);
    expect(response.statusCode).toBe(200);
  });
});

//blogs
describe("Blogs Testing", () => {
  it(" post blogs unauthorized user", async () => {
    const response = await supertest(app).post("/api/blogs");
    expect(response.statusCode).toBe(401);
  });



  it(" get single blog", async () => {
    let id = "65cf22988827edb747def94a";
    const response = await supertest(app).get(`/api/blogs/${id}`);
    expect(response.statusCode).toBe(200);
  });

  it(" get a  blog that does not exist", async () => {
    let id = "65cc9c44c21d1b699d7cc4f7";
    const response = await supertest(app).get(`/api/blogs/${id}`);
    expect(response.statusCode).toBe(404);
  });
  it(" get single blog with invalid id", async () => {
    let id = "65cf22988827edb747def94ajanetuwimana";
    const response = await supertest(app).get(`/api/blogs/${id}`);
    expect(response.statusCode).toBe(500);
  });
  it(" get  blog comment", async () => {
    let id = "65cf22988827edb747def94a";
    const response = await supertest(app).get(`/api/blogs/${id}/comments`);
    expect(response.statusCode).toBe(200);
  });
  // it("  commmet on blog id that does not exist", async () => {
  //   let id = "65cc9c44c21d1b699d8dd234";
  //   const response = await supertest(app).post(`/api/blogs/${id}/comments`).send({
  //     "name":"janet",
  
  //     "comment":"good work"
  //   })

  //   .set("Authorization", token);
  //   expect(response.statusCode).toBe(404);
  // });
  // it(" commenting on blogid that is invalid", async () => {
  //   let id = "65cf22988827edb747def94a***";
  //   const response = await supertest(app).post(`/api/blogs/${id}/comments`).send({
  //     "name":"janet",
  //     "comment":"good work"
  //   })
  //   .set("Authorization", token);
  //   expect(response.statusCode).toBe(500);
 // });
});
