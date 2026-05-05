import app from "./app.js";
import { ENV } from "./config/env.js";
import { ensureDatabaseSchema } from "./config/database.js";

const PORT = ENV.PORT;

const startServer = async () => {
  await ensureDatabaseSchema();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
