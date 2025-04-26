import {
  InferAttributes,
  InferCreationAttributes,
  Model,
  DataTypes,
  CreationOptional,
} from "sequelize";
import sequelize from "../config/database";

class CompraModel extends Model<
  InferAttributes<CompraModel>,
  InferCreationAttributes<CompraModel>
> {
  public id_compra!: CreationOptional<number>;
  public chave_rastreio!: CreationOptional<string>;
  public status_compra!: string;
  public quantidade!: number;
  public id_usuario!: number;
  public id_produto!: number;
  public id_endereco!: number;
}

CompraModel.init(
  {
    id_compra: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    chave_rastreio: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    status_compra: {
      type: DataTypes.ENUM("pendente", "paga", "entregue", "cancelada"),
      allowNull: false,
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuario",
        key: "id_usuario",
      },
    },
    id_produto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "produto",
        key: "id_produto",
      },
    },
    id_endereco: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "endereco",
        key: "id_endereco",
      },
    },
  },
  {
    tableName: "compra",
    sequelize,
  }
);

export default CompraModel;
