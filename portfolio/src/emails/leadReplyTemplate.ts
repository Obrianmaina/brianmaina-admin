export function buildLeadReplyHtml(body: string): string {
  const bodyHtml = body
    .split("\n")
    .map(line => `<p style="margin:0 0 8px 0;font-size:15px;line-height:26px;color:#1f2937;">${line || "&nbsp;"}</p>`)
    .join("");

  return `<!DOCTYPE html>
<html>
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
  <body style="background-color:#f0f0f0;font-family:sans-serif;color:#111827;margin:0;padding:0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:33px;border:1px solid #e5e7eb;overflow:hidden;max-width:600px;width:100%;">
            
            <tr>
              <td style="padding:0;line-height:0;">
                <img src="https://res.cloudinary.com/dsvexizbx/image/upload/v1775146878/og-image._c2l39z.png"
                  alt="Brian Maina" width="600"
                  style="display:block;width:100%;max-width:100%;height:auto;border:none;border-radius:33px 33px 0 0;" />
              </td>
            </tr>

            <tr>
              <td style="padding:32px 32px 24px 32px;">
                ${bodyHtml}
              </td>
            </tr>

            <tr>
              <td style="padding:0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background-color:#111827;padding:24px 32px;">
                      <table cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td style="width:56px;padding-right:16px;vertical-align:middle;">
                            <img src="https://res.cloudinary.com/dsvexizbx/image/upload/v1773137564/email_cocvb3.jpg"
                              alt="Brian Maina" width="56" height="56"
                              style="border-radius:50%;border:2px solid #374151;display:block;object-fit:cover;" />
                          </td>
                          <td style="vertical-align:middle;border-left:1px solid #374151;padding-left:16px;">
                            <p style="margin:0;font-weight:700;color:#ffffff;font-size:14px;letter-spacing:0.02em;">Brian Maina</p>
                            <p style="margin:2px 0 0 0;color:#9ca3af;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Visual Designer</p>
                            <table cellpadding="0" cellspacing="0" style="margin-top:10px;">
                              <tr>
                                <td style="padding-right:8px;">
                                  <a href="https://www.brianmaina.de"
                                    style="display:inline-block;background-color:#1f2937;color:#d1d5db;font-size:11px;font-weight:600;text-decoration:none;padding:4px 10px;border-radius:4px;border:1px solid #374151;letter-spacing:0.05em;">
                                    Portfolio
                                  </a>
                                </td>
                                <td style="padding-right:8px;">
                                  <a href="https://www.linkedin.com/in/brian-maina-nyawira/"
                                    style="display:inline-block;background-color:#1f2937;color:#d1d5db;font-size:11px;font-weight:600;text-decoration:none;padding:4px 10px;border-radius:4px;border:1px solid #374151;letter-spacing:0.05em;">
                                    LinkedIn
                                  </a>
                                </td>
                                <td>
                                  <a href="mailto:brian@brianmaina.de"
                                    style="display:inline-block;background-color:#1f2937;color:#d1d5db;font-size:11px;font-weight:600;text-decoration:none;padding:4px 10px;border-radius:4px;border:1px solid #374151;letter-spacing:0.05em;">
                                    Email
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>

          <p style="color:#9ca3af;font-size:11px;margin-top:20px;margin-bottom:40px;text-align:center;">
            &copy; ${new Date().getFullYear()} Brian Maina. All rights reserved.<br/>
            <span style="color:#d1d5db;">Nairobi, Kenya</span>
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}