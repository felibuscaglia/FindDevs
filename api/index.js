const server = require("./src/app.js");
const { conn } = require("./src/db.js");

const PORT = process.env.PORT || 5001;

conn.sync({ force: false }).then(() => {
  server.listen((PORT, '0.0.0.0'), () => {
    console.log(`%s listening at ${PORT}`); 
  });
});