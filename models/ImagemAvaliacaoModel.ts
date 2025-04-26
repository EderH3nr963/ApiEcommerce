import {
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  Model,
  CreationOptional,
} from "sequelize";
import sequelize from "../config/database";

class ImagemAvaliacaoModel extends Model<
  InferAttributes<ImagemAvaliacaoModel>,
  InferCreationAttributes<ImagemAvaliacaoModel>
> {
    public id_imagem!: CreationOptional<number>;
    public nome_imagem!: string;
    public id_avaliacao!: number;
}

ImagemAvaliacaoModel.init(
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
    id_avaliacao: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "avaliacao",
        key: "id_avaliacao",
      },
    },
  },
  {
    tableName: "imagem_avaliacao",
    sequelize,
  }
);

export default ImagemAvaliacaoModel;