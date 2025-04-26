import { MercadoPagoConfig, Payment } from "mercadopago";
import { ProdutoModel, CompraModel, UsuarioModel } from "../models";
import sequelize from "../config/database";

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_TOKEN!,
});

class OrderService {
  static async processFlexiblePayment({
    id_produto,
    id_usuario,
    id_endereco,
    qtd_produto,
    email,
    payment_type_id,
    token,
    issuer_id,
    installments,
  }: {
    id_produto: number;
    id_usuario: number;
    id_endereco: number;
    qtd_produto: number;
    email: string;
    payment_type_id: "credit_card" | "pix" | "boleto";
    token?: string;
    issuer_id?: string;
    installments?: number;
  }) {
    const transaction = await sequelize.transaction();

    try {
      const produto = await ProdutoModel.findByPk(id_produto);
      const usuario = await UsuarioModel.findByPk(id_usuario);

      if (!produto || !usuario) {
        throw new Error("Produto ou usuário não encontrado.");
      }

      const total = produto.price * qtd_produto;

      const compra = await CompraModel.create(
        {
          id_produto,
          id_usuario,
          id_endereco,
          quantidade: qtd_produto,
          status_compra: "pendente",
        },
        { transaction }
      );

      const paymentData: any = {
        transaction_amount: total,
        description: produto.nome_produto,
        payment_type_id,
        payer: { email },
        external_reference: String(compra.id_compra),
      };

      if (payment_type_id === "credit_card") {
        paymentData.token = token;
        paymentData.issuer_id = issuer_id;
        paymentData.installments = installments;
        paymentData.payment_method_id = "visa"; // ou dinamicamente do frontend
      }

      const payment = await new Payment(mercadopago).create({
        body: paymentData,
      });

      // Atualiza status da compra
      compra.status_compra =
        payment.status === "approved" ? "aprovado" : "rejeitado";
      await compra.save({ transaction });

      await transaction.commit();

      return {
        compra,
        payment_status: payment.status,
        payment_method: payment.payment_method_id,
        payment_id: payment.id,
        pix_qr_code:
          payment.point_of_interaction?.transaction_data?.qr_code_base64 ||
          null,
        pix_copia_cola:
          payment.point_of_interaction?.transaction_data?.qr_code || null,
        boleto_url: payment.transaction_details?.external_resource_url || null,
      };
    } catch (e) {
      await transaction.rollback();
      console.error(e);
      throw new Error("Erro ao processar pagamento.");
    }
  }
}

export default OrderService;
