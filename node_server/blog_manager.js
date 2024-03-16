import {readFileSync, writeFileSync} from "fs";

export function loadBlog() {
  const blog_posts = JSON.parse(readFileSync("./data/blog_posts.json"));
  console.log("Loading Blog Posts...\n");
  console.log(blog_posts);
  return blog_posts;
}
