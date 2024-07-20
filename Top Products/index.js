import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`⚙️ Server is running at :${PORT}`);
}).on('error', (err) => {
  console.error('Error starting server:', err);
});
