export async function sendInviteEmail({
  to,
  inviteUrl,
  companyName,
  role,
}: {
  to: string;
  inviteUrl: string;
  companyName: string;
  role: string;
}) {
  // Mock or real email logic
  console.log(`Sending invite email to ${to}: ${inviteUrl}`);

  // If using a real provider (like Resend, SendGrid, Postmark, etc.)
  // await resend.emails.send({ to, subject, html, ... });
}
