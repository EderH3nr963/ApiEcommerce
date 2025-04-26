import {
  InferAttributes,
  CreationOptional,
  InferCreationAttributes,
  Model,
  DataTypes,
} from "sequelize";
import sequelize from "../config/database";
import AvaliacaoModel from "./AvaliacaoModel";

class ProdutoModel extends Model<
  InferCreationAttributes<ProdutoModel>,
  InferAttributes<ProdutoModel>
> {
  public id_produto!: CreationOptional<number>;
  public nome_produto!: string;
  public qtd_estoque!: number;
  public price!: number;
  public descricao!: string;
  public avaliacoes?: AvaliacaoModel[];
}

ProdutoModel.init(
  {
    id_produto: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    nome_produto: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    qtd_estoque: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(13, 2),
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "produto",
    sequelize,
  }
);

export default ProdutoModel;