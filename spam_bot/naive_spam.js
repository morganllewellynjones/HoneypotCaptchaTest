import puppeteer from "puppeteer";

/*
 * Author: Morgan Jones
 * Updated: 03/17/2024
 *
 * This program is designed to represent a bot that attempts to stuff spam onto any website form it can find.
 * We assume this program to be a file in a larger program, one which crawls the web looking for victim sites.
 * For obvious ethical and legal reasons we cannot test our spam bot on live sites. But hopefully you can imagine its place in a larger program.
 *
 * This spambot is naive because it doesn't check for honeypot CAPTCHA fields, and has limited ability to troubleshoot site navigation issues. It makes simple assumptions about how a login page is formatted, for example. Currently, this bot fails to bypass our honeypot CAPTCHA protected site in about three different ways. However, before implementing honeypot CAPTCHAs and our riddle CAPTCHA, this bot succeeded.
 */

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
    const name = await page.evaluate((input) => input.name, input);
    if (
      name.toLowerCase().includes("user") ||
      name.toLowerCase().includes("name")
    ) {
      return input;
    }
  }
}

const submitQueries = [
    "input[type='submit']",
    "button[type='submit']",
    "::-p-text('Log')",
    "::-p-text('Sign')",
    "::-p-text('log')",
    "::-p-text('sign')",
    "::-p-text('Submit')",
    "::-p-text('submit')",
    "button"]

async function stuffCredentials(page, usernameQuery, passwordQuery) {
  /*
   * We are assuming that the attacker has some method of stuffing credentials to get into an accounts.
   * Likely access to files of leaked credentials on the dark web.
   * Our test is not designed to analyze credential stuffing logistics.
   * For now we assume that the spambot was able to identify an account in a list and insert the credentials for a valid account.
   */
  try {
  await page.evaluate(() => document.querySelector("input").value = "jay");
  await page.evaluate(() => document.querySelector("input[type='password']").value = "bird");
  for await (const query of [
    "input[type='submit']",
    "button[type='submit']",
    "button"
    ]) {
    const submit = await page.$(query);
    if (submit) {
      await Promise.all([page.waitForNavigation(), submit.click()]);
      break;
    }
  };
  } catch {
    console.log("Unable to log in...");
  };
}

async function isVisible(element) {
  //Not implemented in this version.
  //This naive spambot is not actually checking to make sure that the page elements are honeypot fields.
  return false;
}

async function Login(page) {
  await stuffCredentials(page, "input", "input[type='password']");
  await debugSessionStorage(page);
}

async function debugSessionStorage(page) {
  await page.evaluate(() => console.log("Session storage is: " + JSON.stringify(window.sessionStorage)));
}

async function stuffForm(formElement, page, message) {
  console.log("Stuffing page with spam...");
  debugSessionStorage(page);
  const inputs = await formElement.$$("input");
  for await (const input of inputs) {
    const type = page.evaluate((input) => input.type, input);

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
  const textAreas = await formElement.$$("textarea");
  
  for await (const textArea of textAreas) {
    await textArea.type(message);
  }
  
  for await (const query of submitQueries) {
    const elem = await page.$(query);
    if (elem) {
      await elem.click();
      break;
    }
  }
}

async function stuffForms(page, message) {
  const forms = await page.$$("form");
  for await (const form of forms) {
    await stuffForm(form, page, message);
  }
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024, deviceScaleFactor: 1 });
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto("http://localhost:8080", {waitUntil: "load"});

  const message = "SPAM! SPAM! SPAM!";
  
  const emails = await page.$("::-p-text(@)");
  const links = await page.$$("a");
  const urls = await (async () => {
    const linkUrls = await Promise.all(await links.map(link => page.evaluate(link => link.href, link)));
    const pageUrl = await page.url();
    return linkUrls.filter(url => url !== pageUrl);
  })();

  const password = await page.$("input[type='password']");
  if (password) {
    console.log("Logging in...");
    await Login(page);
  }

  for await (const url of urls) {
    console.log(`Moving to url...${url}`);
    await page.goto(url, {waitUntil: "load"});
    console.log("Spamming form...");
    await stuffForms(page, message);
  }
})();
