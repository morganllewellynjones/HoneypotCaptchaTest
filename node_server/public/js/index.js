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
            console.log(await response.json());
        } catch (e) {
            console.error(e);
        }
    }

    // Add an event listener
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        submitData().then((r) => {
            console.log("Form Submitted");
        });
    });
})(window);