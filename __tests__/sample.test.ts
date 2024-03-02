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
import Post from "../src/models/post";
dotenv.config();
const DB_URL = process.env.DB;
beforeAll(async () => {
  //await mongoose.connect(DB_URL as string)
  await mongoose.connect(DB_URL as string);
}, 100000);
afterAll(async () => {
  await mongoose.connection.close();
});
let token = "";
let blogId: any = "";
//jest tests

const post = {
  title: "test blog creation",
  image: "test-image.png",
  intro: "im testing blog intro",
  article: "blog article testing create",
};

describe("Authentication testing", () => {
  it(" user signingup with existing email", async () => {
    let blog = await Post.create(post);
    const response = await supertest(app).post("/api/signup").send({
      name: "ashley",
      email: "ashley250@gmail.com",
      password: "alshley250",
    });
    expect(response.statusCode).toBe(500);
    blogId = blog._id;
  });

  it(" user signingup  successful", async () => {
    let r = (Math.random() + 1).toString(36).substring(5);
    const response = await supertest(app)
      .post("/api/signup")
      .send({
        name: "Aline",
        email: r + "aline12250@gmail.com",
        password: "aline345",
      });
    expect(response.statusCode).toBe(200);
  });

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
    console.log(response.body);
    blogId = response.body.blog[0]._id;
    console.log(blogId);
  });

  it(" create comment without authentication", async () => {
    let id = "65cf22988827edb747def94a";
    const response = await supertest(app).post(`/api/blogs/${blogId}/comments`);
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
    console.log(blogId);
    let id = "65e1df85da1f73e39028fa1a";
    const response = await supertest(app).get(`/api/blogs/${id}`);
    expect(response.statusCode).toBe(200);
  });

  it(" get a  blog that does not exist", async () => {
    //console.log(blogId);
    let id = "65d4ad6d869d3fe2600698c4";
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
    const response = await supertest(app).get(`/api/blogs/${blogId}/comments`);
    expect(response.statusCode).toBe(200);
  });

  it("delete a blog unauthorised", async () => {
    const response = await supertest(app).delete(`/api/blogs/${blogId}`);

    expect(response.statusCode).toBe(401);
  });

  it("delete a blog unauthorised", async () => {
    const response = await supertest(app)
      .delete(`/api/blogs/${blogId}`)
      .set("Authorization", token);
    expect(response.statusCode).toBe(200);
  });

  it("delete a blog unexisting", async () => {
    const response = await supertest(app)
      .delete(`/api/blogs/${blogId}`)
      .set("Authorization", token);
    expect(response.statusCode).toBe(404);
  });

  it("deleteng unexisting blog with invalid id", async () => {
    let id = "60000111111d1b699d8dd001jjhhhhhhhhh";
    const response = await supertest(app)
      .delete(`/api/blogs/${id}`)
      .set("Authorization", token);
    expect(response.statusCode).toBe(500);
  });

  it(" commenting on blogid that is invalid", async () => {
    let id = "65cf22988827edb747def94a***";
    const response = await supertest(app)
      .post(`/api/blogs/${id}/comments`)
      .send({
        name: "janet",
        comment: "good work",
      })
      .set("Authorization", token);
    expect(response.statusCode).toBe(500);
  });

  let querryId: any = "";
  it(" creating a querry ", async () => {
    const response = await supertest(app)
      .post(`/api/queries`)
      .send({
        name: "test user",
        email: "test@gmail.com",
        message: "I am testing a querry",
      })
      .set("Authorization", token);
    expect(response.statusCode).toBe(200);
    console.log(response.body);
    querryId = response.body.queries._id;
  });

  it(" get a querry authorised", async () => {
    const response = await supertest(app)
      .get(`/api/queries`)
      .send({
        name: "test user",
        email: "test@gmail.com",
        message: "I am testing a querry",
      })
      .set("Authorization", token);
    expect(response.statusCode).toBe(200);
  });
  /*
it(" get a querry authorised", async () => {
  const response = await supertest(app).post(`/api/queries`).send({
    name:"test user",
    email:"t",
    message:"I am testing a querry",
 })
.set("Authorization", token);
 expect(response.statusCode).toBe(400);

});




it(" get  a single querry unauthorised ", async () => {
  const response = await supertest(app).get(`/api/queries/${querryId}`)
 expect(response.statusCode).toBe(401);
});

it(" get  a single querry authorised ", async () => {
  const response = await supertest(app).get(`/api/queries/${querryId}`)
  .set("Authorization", token);
 expect(response.statusCode).toBe(200);
 
});
*/
});
