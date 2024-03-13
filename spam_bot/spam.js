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
  const maybeUsername = page.
  for await (const )
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("http://localhost:8080");
  await page.once("load", () => console.log("Page loaded!"));
  //console.log(inputs);
  console.log("Printing login");
  const login = await getLogin(page);
  console.log(login);
  //const login = await page.$("button ::-p-text(Log)");
  //await page.keyboard.press("Escape");

  //console.log(login);
  //await login.click();

  //const login = await page.locator("button").filter(button => button.innerText.includes("Log"));
  //const loginText = await page.evaluate(button => button.innerText, login);
  //console.log(loginText);
  //const buttons = await page.$$("button");
  //const login = await searchByText(buttons, page, "Log");
  //await login.click();
  //console.log(typeof(buttons));
  //console.log(await page.evaluate(button => button.innerText, login));
  //for await (const button of buttons) {
  //  console.log(await page.evaluate(button => button.innerText, button));
  //}
  //const buttons = await page.evaluate(() => document.querySelectorAll("button"));
  //const button = await page.$eval("button", button => page.evaluatei);
  //console.log(typeof(button));
  //buttons.forEach(button => console.log(button));
  //console.log(buttons);
  //buttons.forEach(button => console.log(button.textContent));
  //await browser.close();
})();

// function example() {
//   (async () => {
//     // Launch the browser and open a new blank page
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     // Navigate the page to a URL
//     await page.goto("https://chrome.com/");

//     // Set screen size
//     await page.setViewport({ width: 1080, height: 1024 });

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
