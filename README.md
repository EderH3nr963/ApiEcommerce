# API E-commerce

Uma API robusta para um sistema de e-commerce desenvolvida com Node.js, Express e TypeScript.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Ambiente de execução JavaScript
- **TypeScript** - Superset JavaScript com tipagem estática
- **Express** - Framework web para Node.js
- **Sequelize** - ORM para banco de dados
- **MySQL** - Sistema de gerenciamento de banco de dados
- **Redis** - Armazenamento em cache
- **MercadoPago** - Integração com pagamentos
- **Multer** - Manipulação de upload de arquivos
- **Nodemailer** - Envio de emails
- **Express Validator** - Validação de dados
- **Bcrypt** - Criptografia de senhas

## 📋 Funcionalidades

- **Autenticação**
  - Registro e login de usuários
  - Validação de dados
  - Middleware de autenticação
  - Controle de sessão com Redis

- **Usuários**
  - Gerenciamento de perfis
  - Controle de acesso (admin/usuário comum)

- **Produtos**
  - CRUD completo de produtos
  - Upload de imagens
  - Validação de dados
  - Categorização

- **Endereços**
  - Gerenciamento de endereços de entrega
  - Validação de dados

- **Pagamentos**
  - Integração com MercadoPago
  - Processamento de pagamentos

## 🛠️ Estrutura do Projeto

```
apiEcommerce/
├── middlewares/         # Middlewares de validação e autenticação
├── routes/             # Rotas da API
├── models/            # Modelos do banco de dados
├── controllers/       # Lógica de negócios
├── services/          # Serviços externos
└── config/            # Configurações do projeto
```

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```
DB_HOST=seu_host
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=seu_banco
REDIS_URL=sua_url_redis
SESSION_SECRET=seu_secret
MERCADOPAGO_ACCESS_TOKEN=seu_token
```

4. Inicie o servidor:
```bash
npm start
```

## 📝 Documentação da API

A documentação completa da API está disponível em [link-da-documentacao].

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, leia as diretrizes de contribuição antes de enviar um pull request.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 