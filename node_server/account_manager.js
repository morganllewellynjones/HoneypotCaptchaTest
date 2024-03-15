import {readFileSync, writeFileSync} from "fs";

export function createAccount(username, password) {
  const data = JSON.parse(readFileSync("./data/account_data.json"));
  const updated = data[username] ? data : { ...data, [username]: password };
  writeFileSync("./data/account_data.json", JSON.stringify(updated));
  return updated;
}

export function removeAccount(username) {
  const data = JSON.parse(readFileSync("./data/account_data.json"));
  delete data.username;
  writeFileSync("./data/account_data.json", JSON.stringify(data));
  return data;
}

export function resetAccountData() {
  const data = { mj: "passwd", connie: "yoyo", ash: "kickin'", jay: "bird" };
  writeFileSync("./data/account_data.json", JSON.stringify(data));
  return data;
}

// Log ip of user to refuse future connections.
async function requestListener() {
  return fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        console.log("Incoming Login Attempt : " + data.ip);
        return data.ip
      });
}

export async function authenticateLogin(data) {

  console.log(`Login attempted with data: ${data}`);
  //let source = await requestListener();
  let source = await requestListener();
  // Screen bots
  if (data.acceptTerms) {
    // Blacklist stuff here
    blacklistIP(source + "\n");
    console.log("Denied Connection : " + source);
    return false;
  }

  console.log(data);

  const accounts = JSON.parse(readFileSync("./data/account_data.json"));
  const password = accounts[data.username];
  return password ? password === data.password : false;
}

export function blacklistIP(target) {
  // Open file for appending if it exists, if not, create it and append.
  writeFileSync('./data/blacklist.txt', target, {encoding: "utf-8", flag: 'a'});
}

export function logAccessAttempt(data) {
  writeFileSync(`./`);
}

export function logAccountCreation(data) {}
