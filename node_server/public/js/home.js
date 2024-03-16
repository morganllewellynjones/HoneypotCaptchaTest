(function(window) {
    async function constructBlogPost(post) {
        const blogPost = new DocumentFragment();

        const postDiv = await document.createElement("div");
        const postId = await document.createElement("h4")
        const postContentBox = await document.createElement("div");
        const postContent = await document.createElement("p");

        const postDate = new Date(post.date).toLocaleString();
        postId.innerText = `${post.username} - ${postDate}`;
        postContent.innerText = post.message;

        postContentBox.appendChild(postContent);
        postDiv.appendChild(postId);
        postDiv.appendChild(postContentBox);
        blogPost.appendChild(postDiv);

        document.querySelector(".blog").appendChild(blogPost);

        postDiv.classList.add("blog_post");
        postId.classList.add("blog_post_id");
        postContentBox.classList.add("blog_post_content_box");
        postContent.classList.add("blog_post_content");
    }

    async function loadBlog() {
        const response = await fetch("http://localhost:8080/blog");
        const blog_posts = await response.json();
        for (const post of blog_posts) {
            constructBlogPost(post);
        }
    };

    addEventListener("DOMContentLoaded", (e) => loadBlog());
})(window)
