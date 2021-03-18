'use strict';

require("dotenv").config();
const express = require("express");
const router = require("./src/routes");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use('/api/v1', router);

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
