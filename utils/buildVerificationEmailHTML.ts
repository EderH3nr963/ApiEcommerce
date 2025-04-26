function buildVerificationEmailHTML(code: number): string {
  return `
      <div style="font-family: sans-serif; text-align: center;">
        <h2>Verificação de E-mail</h2>
        <p>Seu código de verificação é:</p>
        <h1 style="letter-spacing: 5px;">${code}</h1>
        <p>Esse código expira em 15 minutos.</p>
      </div>
    `;
}

export default buildVerificationEmailHTML;
