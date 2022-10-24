const fs = require("fs");
const path = require("path");

const dbPath = "db.json";
const rawData = fs.readFileSync(path.join(__dirname, dbPath));

const db = JSON.parse(rawData);

exports.db = db;
