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
    const name = await page.evaluate(input => input.name, input);
    if (name.toLowerCase().includes("user") || name.toLowerCase().includes("name")) {
      return input
    }
  }
}

//async function isVisible(element) {
//  const display = await page.$("
//}

async function Login(page) {
  //const inputs = await page.$$("input");
  const password = await page.$("input[type='password']");
  const username = await getUsername(page);
  const submit = await page.$("input[type='submit']") ?? await page.$("button");
  await username.type("jay");
  await password.type("bird");
  console.log(submit);
  submit.click();
}

async function spamForm(formElement, page, message) {
  const inputs = await formElement.$$("input");
  const submit = await page.$("input[type='submit']") ?? page.$("input[type='button']");

  for await (const input of inputs) {
    const type = page.evaluate(input => input.type, input);
    console.log(type);

    //We want to finish stuffing form data before submitting
    if (type === "submit" || type === "button") {
      continue;
    }

    //Better safe than sorry, make sure we aren't missing a terms of agreement or some such
    if (type === "checkbox") {
      input.click();
      continue;
    }

    await input.type(message);
  }

}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024, deviceScaleFactor: 1 });
  await page.goto("http://localhost:8080");
  await page.once("load", () => console.log("Page loaded!"));

  const message = "SPAM! SPAM! SPAM!";

  const forms = await page.$$("form");
  for await (const form of forms) {
    const password = await form.$("input[type='password']");
    if (password) {
      Login(page);
    }
    else {
      spamForm(form, page, message);
    }
  }

  const emails = await page.$("::-p-text(@)");
  console.log(emails);
  
  const links = await page.$$("a");
  console.log(links);

  //console.log(inputs);
  //console.log("Printing login");
  //const login = await getLogin(page);
  //const userName = await getUsername(page);
  //const password = await getPassword(page);
  //await userName.type("jay");
  //await password.type("bird");
  //await login.click();
})();
