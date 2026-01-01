import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RoleRequestNotification {
  userEmail: string;
  userName: string;
  role: string;
  action: "approved" | "rejected";
  reviewNotes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Role request notification function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, userName, role, action, reviewNotes }: RoleRequestNotification = await req.json();
    
    console.log(`Sending role request notification to ${userEmail}`);
    console.log(`Action: ${action}, Role: ${role}`);

    const isApproved = action === "approved";
    const subject = isApproved 
      ? `Your ${role} role request has been approved!` 
      : `Update on your ${role} role request`;

    const statusColor = isApproved ? "#22c55e" : "#ef4444";
    const statusText = isApproved ? "Approved" : "Rejected";
    const statusBgColor = isApproved ? "#dcfce7" : "#fef2f2";

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
              Role Request ${statusText}
            </h1>
            <p style="color: #3f3f46; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
              Hello ${userName || "User"},
            </p>
            <p style="color: #3f3f46; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              Your request for the <strong style="color: #18181b;">${role}</strong> role has been reviewed.
            </p>
            <div style="background-color: ${statusBgColor}; border-left: 4px solid ${statusColor}; border-radius: 6px; padding: 16px; margin-bottom: 24px;">
              <p style="color: ${statusColor}; font-size: 18px; font-weight: 600; margin: 0;">
                Status: ${statusText}
              </p>
              ${isApproved ? `
                <p style="color: #3f3f46; font-size: 14px; margin: 8px 0 0 0;">
                  Congratulations! The ${role} role has been added to your account and you now have access to the associated features.
                </p>
              ` : `
                <p style="color: #3f3f46; font-size: 14px; margin: 8px 0 0 0;">
                  Unfortunately, your request could not be approved at this time.
                </p>
              `}
            </div>
            ${reviewNotes ? `
              <div style="background-color: #f4f4f5; border-radius: 6px; padding: 16px; margin-bottom: 24px;">
                <p style="color: #71717a; font-size: 12px; text-transform: uppercase; margin: 0 0 8px 0;">
                  Admin Notes
                </p>
                <p style="color: #3f3f46; font-size: 14px; margin: 0;">
                  ${reviewNotes}
                </p>
              </div>
            ` : ''}
            <div style="background-color: #f4f4f5; border-radius: 6px; padding: 16px; margin-bottom: 24px;">
              <p style="color: #71717a; font-size: 14px; margin: 0;">
                Processed: ${new Date().toLocaleString()}
              </p>
            </div>
            ${!isApproved ? `
              <p style="color: #71717a; font-size: 14px; line-height: 1.6;">
                If you believe this decision was made in error or would like to provide additional information, please contact an administrator.
              </p>
            ` : ''}
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending role request notification:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
