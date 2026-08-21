import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import app from "../app.mjs";

const validPost = {
  title: "My post",
  image: "https://example.com/cat.jpg",
  category_id: 1,
  description: "Introduction",
  content: "Full content",
  status_id: 1,
};

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

async function send(method, path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return {
    status: response.status,
    body: await response.json(),
  };
}

describe("POST /posts validation", () => {
  it("rejects when title is missing", async () => {
    const { title, ...payload } = validPost;
    const res = await send("POST", "/posts", payload);
    assert.equal(res.status, 400);
    assert.equal(res.body.message, "Title is required");
  });

  it("rejects when title is not a string", async () => {
    const res = await send("POST", "/posts", { ...validPost, title: 123 });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, "Title must be a string");
  });

  it("rejects when category_id is not a number", async () => {
    const res = await send("POST", "/posts", {
      ...validPost,
      category_id: "cats",
    });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, "Category id must be a number");
  });
});

describe("PUT /posts/:postId validation", () => {
  it("rejects when content is missing", async () => {
    const { content, ...payload } = validPost;
    const res = await send("PUT", "/posts/1", payload);
    assert.equal(res.status, 400);
    assert.equal(res.body.message, "Content is required");
  });

  it("rejects when status_id is not a number", async () => {
    const res = await send("PUT", "/posts/1", {
      ...validPost,
      status_id: "draft",
    });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, "Status id must be a number");
  });
});
