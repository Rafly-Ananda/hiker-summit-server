if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// ? Server Dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// ? Routes
const userRoute = require("./server/routes/user");
const authRoute = require("./server/routes/auth");
const destinationRoute = require("./server/routes/destination");
const reviewRoute = require("./server/routes/review");
const bookRoute = require("./server/routes/book");
const orderRoute = require("./server/routes/order");

// ? Configs
const { API_VERSION } = require("./server/config");

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
app.use(`/api/${API_VERSION}/auth`, authRoute);
app.use(`/api/${API_VERSION}/users`, userRoute);
app.use(`/api/${API_VERSION}/destinations`, destinationRoute);
app.use(`/api/${API_VERSION}/reviews`, reviewRoute);
app.use(`/api/${API_VERSION}/book`, bookRoute);
app.use(`/api/${API_VERSION}/order`, orderRoute);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Database Connection Established . . .");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`);
});
