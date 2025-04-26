import {
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  Model,
  CreationOptional,
} from "sequelize";
import sequelize from "../config/database";

class ImagemProdutoModel extends Model<
  InferAttributes<ImagemProdutoModel>,
  InferCreationAttributes<ImagemProdutoModel>
> {
  public id_imagem!: CreationOptional<number>;
  public nome_imagem!: string;
  public id_poduto!: number;
}

ImagemProdutoModel.init(
  {
    id_imagem: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    nome_imagem: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    id_poduto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "produto",
        key: "id_produto",
      },
    },
  },
  {
    tableName: "imagem_produto",
    sequelize,
  }
);

export default ImagemProdutoModel;
