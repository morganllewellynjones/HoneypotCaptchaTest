import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { authenticateLogin } from "./account_manager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();
const port = 8080;

server.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

server.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "/home.html"));
});

server.use(express.json());

// Load static files (CSS/Images/etc) for service
server.use(express.static(path.join(__dirname, 'public')));

server.post("/login", (req, res) => {
  res.json(authenticateLogin(req.body));
});

server.listen(port, (req, res) => {});
