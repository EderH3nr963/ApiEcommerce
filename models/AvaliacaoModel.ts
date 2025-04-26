import {
  InferAttributes,
  InferCreationAttributes,
  Model,
  DataTypes,
  CreationOptional,
} from "sequelize";
import sequelize from "../config/database";

class AvaliacaoModel extends Model<
  InferAttributes<AvaliacaoModel>,
  InferCreationAttributes<AvaliacaoModel>
> {
    public id_avaliacao!: CreationOptional<number>;
    public valor_avaliacao!: number;
    public titulo!: string;
    public descricao!: string;
    public id_produto!: number;
    public id_usuario!:number;
}

AvaliacaoModel.init({
    id_avaliacao: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    valor_avaliacao: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    titulo: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    id_produto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "produto",
            key: "id_produto"
        }
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "usuario",
            key: "id_usuario"
        }
    }
}, {
    tableName: "avaliacao",
    sequelize
});

export default AvaliacaoModel;
