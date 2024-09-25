require('dotenv').config();
const express = require("express");
const app = express();

const port = process.env.PORT || 8000

app.listen(8000, () =>{
  console.log(" app listening on port ", port)
})
