(function (window) {
    // Get login form
    const form = document.querySelector("#login_form");

    // Submit login form and send that data to the server
    async function submitData() {
        const formData = new FormData(form);
        const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));

        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                mode: "same-origin",
                credentials: "same-origin",
                cache: "no-cache",
                body: jsonData,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            sessionStorage.setItem("username", JSON.parse(jsonData).username);
	        const text = await response.text();
	        const html = await text.html();
        } catch (e) {
            console.error(e);
        }
    }
})(window);
