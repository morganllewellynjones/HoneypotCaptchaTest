(function (window) {
    const form = document.querySelector("#login_form");
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

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        submitData().then((r) => {
            console.log("Form Submitted");
        });
    });
})(window);