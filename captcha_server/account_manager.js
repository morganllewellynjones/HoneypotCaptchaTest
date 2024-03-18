import {readFileSync, writeFileSync} from "fs";

// Creates a new account entry in the account_data.json file.
export function createAccount(username, password) {
  const data = JSON.parse(readFileSync("./data/account_data.json"));
  const updated = { ...data, username: password };
  writeFileSync("./data/account_data.json", JSON.stringify(updated));
  return updated;
}

// Removes target account entry in the account_data.json file.
export function removeAccount(username) {
  const data = JSON.parse(readFileSync("./data/account_data.json"));
  delete data.username;
  writeFileSync("./data/account_data.json", JSON.stringify(data));
  return data;
}

// Resets account data back to a fresh state.
export function resetAccountData() {
  const data = { mj: "passwd", connie: "yoyo", ash: "kickin", jay: "bird" };
  writeFileSync("./data/account_data.json", JSON.stringify(data));
  return data;
}

// Log ip of user to refuse future connections.
export async function requestListener() {
  return fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        console.log("Incoming Login Attempt : " + data.ip);
        return data.ip
      });
}

async function containsHoneypotFields(data) {
  console.log(`Login attempted with data: ${JSON.stringify(data)}`);
  let source = await requestListener();
  // Screen bots
  if (data.question.toLowerCase() !== "c") {
    // Blacklist stuff here
    logSpamIP(source);
    console.log("Denied Connection : " + source);
    return true;
  }
  return false;
}


// Authenticate login attempt. Checks to see if honeypot fields have been filled, if so, denies connection otherwise allows connection.
// Regardless if honeypot fields are filled or not, will return true to make bot believe it was successful.
export async function authenticateLogin(data) {

  // Check honeypot fields
  if (await containsHoneypotFields(data)) {
    return false;
  }

  const accounts = JSON.parse(readFileSync("./data/account_data.json"));
  const password = accounts[data.username];

  if (password === data.password) {
    // Log if login attempt was fully successful
    console.log("Login Successful : " + data.username);
    logSuccessfulAttempt(data);
    return true;
  } else {
    // Log if attempt made it past the spam protection, but failed credential check
    logDeniedCredentials(data);
    console.log("Denied request to human user : " + data.username);
    return false;
  }
}

// Logs any denied logins to log for measurement
export function logSpamIP(target) {
  // Open file for appending if it exists, if not, create it and append.
  writeFileSync('./data/spam_log.csv', `${target}, ${Date.now()}\n`, {encoding: "utf-8", flag: 'a'});
}

// Logs an attempt that made it through the spam filter, but failed due to bad credentials
export function logDeniedCredentials(data) {
  writeFileSync('./data/wrong_login_log.csv', `${data.username},${Date.now()}\n`, {encoding: "utf-8", flag: 'a'});
}

// Logs any successful logins to log for measurement
export function logSuccessfulAttempt(data) {
  writeFileSync(`./data/login_log.csv`, `${data.username},${Date.now()}\n`, {encoding: "utf-8", flag: 'a'});
}
