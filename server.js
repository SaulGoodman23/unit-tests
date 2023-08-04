import app from "./app.js";

import dotenv from "dotenv";
import connectDatabase from "./config/database.js";

// Setting up config.env file variables
dotenv.config({ path: "./config/config.env" });

// Connecting to database
connectDatabase();

const PORT =  3000;

app.listen(PORT, () => {
  console.log(
    `Server started on port ${PORT}`
  );
});
