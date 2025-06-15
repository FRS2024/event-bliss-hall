
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

console.log("Edge function loaded - send-contact-email");

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Function invoked with method:", req.method);
  console.log("Request URL:", req.url);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing POST request");
    
    // Check if RESEND_API_KEY is available
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Email service not configured" 
        }),
        {
          status: 500,
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders 
          },
        }
      );
    }
    
    console.log("RESEND_API_KEY is configured");

    const requestBody = await req.text();
    console.log("Raw request body:", requestBody);
    
    const { name, email, subject, message }: ContactFormData = JSON.parse(requestBody);
    console.log("Parsed contact form data:", { name, email, subject, messageLength: message.length });

    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.error("Missing required fields:", { name: !!name, email: !!email, subject: !!subject, message: !!message });
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "All fields are required" 
        }),
        {
          status: 400,
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders 
          },
        }
      );
    }

    console.log("Sending admin notification email...");

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "EasyHall Contact <onboarding@resend.dev>",
      to: ["faresabdelbasset.boudra@gmail.com"],
      subject: `New Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>Reply to: ${email}</em></p>
      `,
    });

    console.log("Admin email response:", adminEmailResponse);

    if (adminEmailResponse.error) {
      console.error("Admin email failed:", adminEmailResponse.error);
      throw new Error(`Failed to send admin email: ${adminEmailResponse.error.message}`);
    }

    console.log("Sending user confirmation email...");

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "EasyHall <onboarding@resend.dev>",
      to: [email],
      subject: "Thank you for contacting EasyHall",
      html: `
        <h1>Thank you for reaching out, ${name}!</h1>
        <p>We have received your message about "${subject}" and will get back to you within 24 hours.</p>
        <p>Your message:</p>
        <blockquote style="border-left: 4px solid #e5e7eb; padding-left: 16px; margin: 16px 0; color: #6b7280;">
          ${message.replace(/\n/g, '<br>')}
        </blockquote>
        <p>Best regards,<br>The EasyHall Team</p>
        <hr>
        <p style="color: #9ca3af; font-size: 14px;">
          This is an automated confirmation. If you didn't send this message, please ignore this email.
        </p>
      `,
    });

    console.log("User email response:", userEmailResponse);

    if (userEmailResponse.error) {
      console.error("User email failed:", userEmailResponse.error);
      throw new Error(`Failed to send confirmation email: ${userEmailResponse.error.message}`);
    }

    console.log("Both emails sent successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Emails sent successfully",
        adminEmailId: adminEmailResponse.data?.id,
        userEmailId: userEmailResponse.data?.id
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    console.error("Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send email",
        details: error.stack
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

console.log("Starting server...");
serve(handler);
