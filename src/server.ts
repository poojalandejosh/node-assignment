import app from "./app";
import connectDB from "./config/db";
import { initSocket } from "./socket/socketHandler";

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  initSocket(server);  // ← Socket.io connected here
});