import app from "./app.js";
import config from "./config/config.js";
import connectDb from "./config/db.js";

async function startServer() {
  try {
    const port = config.port;
    const mongo_url = config.mongo_url;

    connectDb(mongo_url);

    app.listen(port, () => {
      console.log(`Server Started on http://localhost:${port}`);
    });
  } catch (err) {
    console.log(`Server Error : ${err}`);
  }
}

startServer();
