import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "ecommerce",
  process.env.USER_DB || "root",
  process.env.PASS_DB || "",
  {
    host: process.env.HOST_DB || "localhost",
    dialect: "mysql",
  }
);

export default sequelize;
