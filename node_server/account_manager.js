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

export function authenticateLogin(data) {
  // Screen bots
  if (data.usercode) {
    // Blacklist stuff here
    blacklistIP("someIP\n");
    return false;
  }
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
