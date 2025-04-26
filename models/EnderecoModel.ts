import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
} from "sequelize";
import sequelize from "../config/database";

class EnderecoModel extends Model<
  InferAttributes<EnderecoModel>,
  InferCreationAttributes<EnderecoModel>
> {
  public id_endereco!: CreationOptional<number>;
  public numero!: number;
  public logradouro!: string;
  public complemento!: string;
  public bairro!: string;
  public cidade!: string;
  public cep!: string;
  public uf!: string;
  public estado!: string;
  public id_usuario!: number;
}

EnderecoModel.init(
  {
    id_endereco: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    logradouro: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    complemento: {
      type: DataTypes.STRING(20)
    },
    bairro: {
      type: DataTypes.STRING(20),
    },
    cidade: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    cep: {
      type: DataTypes.STRING(9),
      allowNull: false
    },
    uf: {
      type: DataTypes.CHAR(2),
      allowNull: false
    },
    estado: {
      type: DataTypes.CHAR(2),
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
  },
  {
    tableName: "endereco",
    sequelize,
  }
);

export default EnderecoModel;
