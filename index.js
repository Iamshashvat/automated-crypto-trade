import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import tradeRoutes from "./routes/tradeRoutes.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use("/api/trade", tradeRoutes);

app.get("/", (req, res) => {
  res.send("API is running....");
});

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
