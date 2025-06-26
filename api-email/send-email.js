import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { appointmentData } = req.body;

  if (!appointmentData) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const emailBody = `
    ✅ Nova Solicitação de Agendamento ✅

    Nome: ${appointmentData.fullName}
    Data de Nascimento: ${appointmentData.birthDate}
    Convênio: ${appointmentData.insurance}
    Tipo de Consulta: ${appointmentData.appointmentType === 'online' ? 'Online' : 'Presencial'}
    Telefone: ${appointmentData.phone}
    Especialidade: ${appointmentData.specialty}
    Data: ${appointmentData.date}
    Horário: ${appointmentData.time}
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Nova Consulta - ${appointmentData.fullName}`,
      text: emailBody,
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ message: 'Agendamento enviado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao enviar e-mail' });
  }
}
