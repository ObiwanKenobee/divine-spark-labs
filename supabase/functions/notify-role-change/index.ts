import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RoleChangeNotification {
  userEmail: string;
  userName: string;
  action: "assigned" | "removed";
  role: string;
  changedBy: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Role change notification function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, userName, action, role, changedBy }: RoleChangeNotification = await req.json();
    
    console.log(`Sending role change notification to ${userEmail}`);
    console.log(`Action: ${action}, Role: ${role}, Changed by: ${changedBy}`);

    const actionText = action === "assigned" ? "assigned to you" : "removed from your account";
    const subject = action === "assigned" 
      ? `You've been assigned the ${role} role` 
      : `Your ${role} role has been removed`;

    const emailResponse = await resend.emails.send({
      from: "Admin <onboarding@resend.dev>",
      to: [userEmail],
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #18181b; font-size: 24px; margin-bottom: 24px;">
              Role ${action === "assigned" ? "Assigned" : "Removed"}
            </h1>
            <p style="color: #3f3f46; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
              Hello ${userName || "User"},
            </p>
            <p style="color: #3f3f46; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              The <strong style="color: #18181b;">${role}</strong> role has been ${actionText}.
            </p>
            <div style="background-color: #f4f4f5; border-radius: 6px; padding: 16px; margin-bottom: 24px;">
              <p style="color: #71717a; font-size: 14px; margin: 0;">
                Changed by: ${changedBy}
              </p>
              <p style="color: #71717a; font-size: 14px; margin: 8px 0 0 0;">
                Date: ${new Date().toLocaleString()}
              </p>
            </div>
            <p style="color: #71717a; font-size: 14px; line-height: 1.6;">
              If you did not expect this change, please contact an administrator immediately.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending role change notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
