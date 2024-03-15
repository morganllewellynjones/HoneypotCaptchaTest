import puppeteer from "puppeteer";

async function getLogin(page) {
  const button = page.$("::-p-text(Log)") ?? page.$("::-p-text(log)");
  if (button) {
    return button;
  }

  const inputs = await page.$$("input");
  for await (const input of inputs) {
    const value = await page.evaluate((input) => input.value, input);
    if (typeof (value == String)) {
      const cleaned = value.trim().toLowerCase();
      if (cleaned.includes("log")) {
        return input;
      }
    }
  }
}

async function getUsername(page) {
  const inputs = await page.$$("input");
  for await (const input of inputs) {
    const value = await page.evaluate((input) => input.name, input);
    const inputType = await page.evaluate((input) => input.type, input);
    const display = await page.evaluate((input) => input.display, input);
    console.log(value, inputType, display);
    if (typeof (value == String)) {
      const cleaned = value.trim().toLowerCase();
      const isUsername = cleaned.includes("user") || cleaned.includes("name");
      if (isUsername) {
        return input;
      }
    }
  }
}

async function getPassword(page) {
  const inputs = await page.$$("input");
  for await (const input of inputs) {
    const value = await page.evaluate((input) => input.name, input);
    const inputType = await page.evaluate((input) => input.type, input);
    if (typeof (value == String)) {
      const cleaned = value.trim().toLowerCase();
      const isPassword = inputType === "password" || cleaned.includes("pass");
      if (isPassword) {
        return input;
      }
    }
  }
}

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024, deviceScaleFactor: 1 });
  await page.goto("http://localhost:8080");
  await page.once("load", () => console.log("Page loaded!"));
  //console.log(inputs);
  console.log("Printing login");
  const login = await getLogin(page);
  const userName = await getUsername(page);
  const password = await getPassword(page);
  console.log(userName);
  console.log(login);
  console.log(password);

  await userName.type("jay");
  await password.type("bird");
  await login.click();
})();
//     // Set screen size

//     // Type into search box
//     await page.type(".devsite-search-field", "automate beyond recorder");

//     // Wait and click on first result
//     const searchResultSelector = ".devsite-result-item-link";
//     await page.waitForSelector(searchResultSelector);
//     await page.click(searchResultSelector);

//     // Locate the full title with a unique string
//     const textSelector = await page.waitForSelector(
//       "text/Customize and automate"
//     );
//     const fullTitle = await textSelector?.evaluate((el) => el.textContent);

//     // Print the full title
//     console.log('The title of this blog post is "%s".', fullTitle);

//     await browser.close();
//   })();
// }

//let buttons = Object.fromEntries(document.querySelectorAll("button")).filter((button) => button[1]);
//let inputs = document.querySelectorAll("input");
//let password = Object.fromEntries(inputs).filter((input) => input.type === "password");
