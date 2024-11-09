import express from "express";
import cors from "cors";
import todoRouter from "./routes/todoRouter.js";
import userRouter from "./routes/userRouter.js";
import dotenv from "dotenv";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

dotenv.config();

const port = process.env.PORT;
app.use("/", todoRouter);
app.use("/user", userRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message });
});

app.listen(port, () => {
  console.log("Server started listening on port " + port);
});
