export function confirmationEmail(code: string, expiresInMinutes = 5) {
    const subject = `${code} is your Talker confirmation code`;

    const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Confirm your Talker account</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0"
                 style="max-width:480px; width:100%; background-color:#ffffff; border-radius:8px; font-family:Arial, Helvetica, sans-serif; color:#1f2933;">
            <tr>
              <td style="padding:32px 32px 8px 32px; font-size:24px; font-weight:bold;">
                Talker
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px; font-size:16px; line-height:24px;">
                <p style="margin:0 0 16px 0;">Welcome! Use the code below to confirm your account.</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:8px 32px 24px 32px;">
                <div style="display:inline-block; padding:16px 32px; background-color:#e8f7ee; border:1px solid #65d18e; border-radius:8px;
                            font-size:32px; font-weight:bold; letter-spacing:8px; font-family:'Courier New', monospace;">
                  ${code}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 8px 32px; font-size:14px; line-height:22px; color:#52606d;">
                This code expires in <b>${expiresInMinutes} minutes</b>. Unconfirmed accounts are deleted after 2 days.
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 32px 32px; font-size:13px; line-height:20px; color:#7b8794;">
                If you didn't try to create a Talker account, ignore this message and do not share the code with anyone.
                We will never ask you for it.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

    const text =
        `Welcome to Talker!\n\n` +
        `Your confirmation code: ${code}\n` +
        `It expires in ${expiresInMinutes} minutes.\n\n` +
        `If you didn't try to create a Talker account, ignore this message ` +
        `and do not share the code with anyone.`;

    return {subject, html, text};
}