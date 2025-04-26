import {
  InferAttributes,
  CreationOptional,
  InferCreationAttributes,
  Model,
  DataTypes,
} from "sequelize";
import sequelize from "../config/database";
const bcrypt = require("bcryptjs");

class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  public id_usuario!: CreationOptional<number>;
  public nome!: string;
  public email!: string;
  public telefone!: string;
  public password?: string;
  public is_admin!: CreationOptional<boolean>;
  public validPassword!: (password: string) => Promise<boolean>;
}

UserModel.init(
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    telefone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "usuario",
    sequelize,
  }
);

UserModel.addHook("beforeCreate", async (conta: any) => {
  const salt = await bcrypt.genSalt(10);
  conta.password = await bcrypt.hash(conta.password, salt);
});

UserModel.addHook("beforeUpdate", async (conta: any) => {
  if (conta.changed("password")) {
    const salt = await bcrypt.genSalt(10);
    conta.password = await bcrypt.hash(conta.password, salt);
  }
});

UserModel.prototype.validPassword = async function (password: string) {
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password);
};

export default UserModel;
