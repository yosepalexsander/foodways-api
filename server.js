'use strict';

require("dotenv").config();
const path = require("path");
const express = require("express");
const router = require("./src/routes");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use('/api/v1', router);
app.use('/uploads', express.static(path.join(__dirname, "uploads")))
app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
