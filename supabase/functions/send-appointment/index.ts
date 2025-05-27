import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import { SmtpClient } from "npm:@orama/smtp-client@2.1.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface AppointmentData {
  fullName: string;
  birthDate: string;
  insurance: string;
  appointmentType: 'online' | 'inperson';
  phone: string;
  specialty: string;
  date: string;
  time: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { appointmentData } = await req.json() as { appointmentData: AppointmentData };

    const smtp = new SmtpClient({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "agendamentoincom@gmail.com",
        pass: Deno.env.get("sudkpcyfvmvbykltae") || "",
      },
    });

    const emailBody = `
      Nova Solicitação de Agendamento

      Nome: ${appointmentData.fullName}
      Data de Nascimento: ${appointmentData.birthDate}
      Convênio: ${appointmentData.insurance}
      Tipo de Consulta: ${appointmentData.appointmentType === 'online' ? 'Online' : 'Presencial'}
      Telefone: ${appointmentData.phone}
      Especialidade: ${appointmentData.specialty}
      Data: ${appointmentData.date}
      Horário: ${appointmentData.time}
    `;

    await smtp.send({
      from: "agendamentoincom@gmail.com",
      to: "agendamentoincom@gmail.com",
      subject: `Nova Consulta - ${appointmentData.fullName}`,
      content: emailBody,
    });

    return new Response(
      JSON.stringify({ message: "Agendamento enviado com sucesso" }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erro ao processar agendamento" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
