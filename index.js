const server = require("./src/app");
const { sequelize } = require("./src/db");

const port = 3000;

server.listen(port, () => {
  sequelize.sync({ force: true });
  console.log(`Server is running on http://localhost:${port}`);
});
