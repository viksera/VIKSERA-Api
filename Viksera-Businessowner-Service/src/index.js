require('dotenv').config();
const express = require("express");
const app = express();
app.use(express.json()); 

const bannerRoutes = require("./routes/v1/banner");
const categoryRoutes = require("./routes/v1/category");
const productRoutes = require("./routes/v1/products");

const port = process.env.PORT || 8000

app.get("/", (req, res) => {
  res.send("app is live");
})

app.use("/api/v1/banner", bannerRoutes);

app.use("/api/v1/category", categoryRoutes);

app.use("/api/v1/product", productRoutes);

app.listen(8000, () =>{
  console.log(" app listening on port ", port)
})
