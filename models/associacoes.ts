import AvaliacaoModel from "./AvaliacaoModel";
import CompraModel from "./CompraModel";
import EnderecoModel from "./EnderecoModel";
import ImagemAvaliacaoModel from "./ImagemAvaliacaoModel";
import ImagemProdutoModel from "./ImagemProdutoModel";
import ProdutoModel from "./ProdutoModel";
import UsuarioModel from "./UsuarioModel";

// Usuario tem muitos endereços
UsuarioModel.hasMany(EnderecoModel, {
  as: "enderecos",
  foreignKey: "id_usuario",
});
EnderecoModel.belongsTo(UsuarioModel, {
  as: "usuario",
  foreignKey: "id_usuario",
});

// Produto tem muitas imagens
ProdutoModel.hasMany(ImagemProdutoModel, {
  as: "imagens_produto",
  foreignKey: "id_produto",
});
ImagemProdutoModel.belongsTo(ProdutoModel, {
  as: "produto",
  foreignKey: "id_produto",
});

// Produto tem muitas avaliações
ProdutoModel.hasMany(AvaliacaoModel, {
  as: "avaliacoes",
  foreignKey: "id_produto",
});
AvaliacaoModel.belongsTo(ProdutoModel, {
  as: "produto",
  foreignKey: "id_produto",
});

// Usuario tem muitas avaliações
UsuarioModel.hasMany(AvaliacaoModel, {
  as: "avaliacoes",
  foreignKey: "id_usuario",
});
AvaliacaoModel.belongsTo(UsuarioModel, {
  as: "usuario",
  foreignKey: "id_usuario",
});

// Avaliacao tem muitas imagens
AvaliacaoModel.hasMany(ImagemAvaliacaoModel, {
  as: "imagens_avaliacao",
  foreignKey: "id_avaliacao",
});
ImagemAvaliacaoModel.belongsTo(AvaliacaoModel, {
  as: "avaliacao",
  foreignKey: "id_avaliacao",
});

// Usuario tem muitas compras
UsuarioModel.hasMany(CompraModel, {
  as: "compras",
  foreignKey: "id_usuario",
});
CompraModel.belongsTo(UsuarioModel, {
  as: "usuario",
  foreignKey: "id_usuario",
});

// Produto tem muitas compras
ProdutoModel.hasMany(CompraModel, {
  as: "compras",
  foreignKey: "id_produto",
});
CompraModel.belongsTo(ProdutoModel, {
  as: "produto",
  foreignKey: "id_produto",
});

// Endereco tem muitas compras
EnderecoModel.hasMany(CompraModel, {
  as: "compras",
  foreignKey: "id_endereco",
});
CompraModel.belongsTo(EnderecoModel, {
  as: "endereco",
  foreignKey: "id_endereco",
});
