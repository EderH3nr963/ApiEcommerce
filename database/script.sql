-- Active: 1745354864518@@127.0.0.1@3306
CREATE DATABASE IF NOT EXISTS ecommerce;

DROP DATABASE ecommerce;

USE ecommerce;

CREATE TABLE usuario (
    id_usuario INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(14) NOT NULL,
    password VARCHAR(150) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE endereco (
    id_endereco INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    numero INT NOT NULL,
    logradouro VARCHAR(50) NOT NULL,
    complemento VARCHAR(20),
    bairro VARCHAR(20),
    cidade VARCHAR(50) NOT NULL,
    cep VARCHAR(9) NOT NULL,
    uf CHAR(2) NOT NULL,
    estado VARCHAR(20) NOT NULL,
    id_usuario INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
);

CREATE TABLE produto (
    id_produto INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome_produto VARCHAR(100),
    descricao TEXT,
    price DECIMAL(13, 2),
    qtd_estoque INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE imagem_produto (
    id_imagem INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome_imagem VARCHAR(150) NOT NULL,
    id_produto INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_produto) REFERENCES produto (id_produto)
);

CREATE TABLE avaliacao (
    id_avaliacao INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    valor_avaliacao INT NOT NULL DEFAULT 0,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    id_produto INT NOT NULL,
    id_usuario INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_produto) REFERENCES produto (id_produto),
    FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
);

CREATE TABLE imagem_avaliacao (
    id_imagem INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome_imagem VARCHAR(150) NOT NULL,
    id_avaliacao INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_avaliacao) REFERENCES avaliacao (id_avaliacao)
);

CREATE TABLE compra (
    id_compra INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    chave_rastreio VARCHAR(30),
    status_compra ENUM(
        'pendente',
        'paga',
        'entregue',
        'cancelada'
    ) NOT NULL,
    quantidade INT NOT NULL,
    id_usuario INT NOT NULL,
    id_produto INT NOT NULL,
    id_endereco INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario),
    FOREIGN KEY (id_produto) REFERENCES produto (id_produto),
    FOREIGN KEY (id_endereco) REFERENCES endereco (id_endereco)
);