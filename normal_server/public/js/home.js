(function(window) {
    // Get blog post form
    const form = document.querySelector("#blog_form");

    // Construct blog post from file to display onto page
    async function constructBlogPost(post) {
        const blogPost = new DocumentFragment();

        const postDiv = await document.createElement("div");
        const postId = await document.createElement("h4");
        const postContentBox = await document.createElement("div");
        const postContent = await document.createElement("p");

        const postDate = new Date(post.date).toLocaleString();
        postId.innerText = `${post.username} - ${postDate}`;
        postContent.innerText = post.message;

        postContentBox.appendChild(postContent);
        postDiv.appendChild(postId);
        postDiv.appendChild(postContentBox);
        blogPost.appendChild(postDiv);

        document.querySelector(".blog_post_list").prepend(blogPost);

        postDiv.classList.add("blog_post");
        postId.classList.add("blog_post_id");
        postContentBox.classList.add("blog_post_content_box");
        postContent.classList.add("blog_post_content");
    }

    async function loadBlog() {
        const response = await fetch("http://localhost:8080/blog");
        const blog_posts = await response.json();
        for (const post of blog_posts) {
            await constructBlogPost(post);
        }
    }

    async function submitData() {
        const formData = new FormData(form);
	let formObject = Object.fromEntries(formData.entries());
	formObject.username = sessionStorage.getItem("username");
	const jsonData = JSON.stringify(formObject);
      
        try {
            const response = await fetch("http://localhost:8080/store_blog_post", {
                method: "POST",
                mode: "same-origin",
                credentials: "same-origin",
                cache: "no-cache",
                body: jsonData,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            constructBlogPost(await response.json());
        } catch (e) {
            console.error(e);
        }
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        submitData().then((r) => {
            console.log("Attempted to submit blog.");
        });
    });

    addEventListener("DOMContentLoaded", (e) => loadBlog());
})(window)
