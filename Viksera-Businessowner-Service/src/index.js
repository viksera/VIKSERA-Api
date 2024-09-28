require('dotenv').config();
const express = require("express");
const app = express();
app.use(express.json()); 

const bannerRoutes = require("./routes/v1/banner")

const port = process.env.PORT || 8000


app.get("/", (req, res) => {
  res.send("app is live");
})

app.use("/api/v1/banner", bannerRoutes);

app.listen(8000, () =>{
  console.log(" app listening on port ", port)
})
