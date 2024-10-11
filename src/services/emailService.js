const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (to, verificationLink) => {
  const msg = {
    to,
    from: "hardhead.nan@gmail.com", // Verifica tu dirección de Gmail en SendGrid y úsala aquí
    subject: "Verificación de correo electrónico",
    html: `
      <h1>Verificación de correo electrónico</h1>
      <p>Por favor haga clic en el siguiente enlace para verificar su correo:</p>
      <a href="${verificationLink}">Verificar mi correo</a>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log("Correo de verificación enviado a:", to);
  } catch (error) {
    console.error(
      "Error al enviar correo de verificación:",
      error.response ? error.response.body : error
    );
  }
};

const sendResetPasswordRequest = async (to, resetLink) => {
  const msg = {
    to,
    from: "hardhead.nan@gmail.com",
    subject: "Recuperación de contraseña",
    html: `
      <h1>Recuperación de contraseña</h1>
      <p>Por favor haga clic en el siguiente enlace para restablecer su contraseña:</p>
      <a href="${resetLink}">Restablecer contraseña</a>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log("Correo de recuperación enviado a:", to);
  } catch (error) {
    console.error(
      "Error al enviar correo de recuperación:",
      error.response ? error.response.body : error
    );
  }
};

module.exports = { sendVerificationEmail, sendResetPasswordRequest };
