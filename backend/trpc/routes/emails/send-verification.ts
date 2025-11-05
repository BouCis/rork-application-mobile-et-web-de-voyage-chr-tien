import { z } from 'zod';
import { publicProcedure } from '../../create-context';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

export const sendVerificationEmailProcedure = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      firstName: z.string(),
      code: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.log('\n' + '='.repeat(60));
        console.log('📧 EMAIL DE VÉRIFICATION (MODE SANS RESEND)');
        console.log('='.repeat(60));
        console.log(`👤 Destinataire: ${input.email}`);
        console.log(`👋 Prénom: ${input.firstName}`);
        console.log(`🔑 CODE DE VÉRIFICATION: ${input.code}`);
        console.log(`⏰ Expiration: 15 minutes`);
        console.log('='.repeat(60));
        console.log('⚠️  RESEND_API_KEY non configuré');
        console.log('📚 Consultez README-EMAIL.md pour configurer Resend');
        console.log('='.repeat(60) + '\n');
        
        return {
          success: true,
          message: 'Code logged to console (Resend not configured)',
        };
      }

      const { data, error } = await resend.emails.send({
        from: 'Voyage App <onboarding@resend.dev>',
        to: input.email,
        subject: '🌍 Votre code de vérification',
        html: `
          <!DOCTYPE html>
          <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Code de vérification</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 20px;">
              <tr>
                <td align="center">
                  <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🌍 Voyage App</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px;">
                        <h2 style="color: #333333; margin: 0 0 20px 0;">Bonjour ${input.firstName} !</h2>
                        <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                          Bienvenue dans notre communauté de voyageurs ! Pour activer votre compte, veuillez utiliser le code de vérification ci-dessous :
                        </p>
                        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px; text-align: center; margin: 0 0 30px 0;">
                          <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">Votre code de vérification</p>
                          <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: monospace;">
                            ${input.code}
                          </div>
                        </div>
                        <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                          Ce code est valide pendant <strong>15 minutes</strong>. Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email en toute sécurité.
                        </p>
                        <div style="border-top: 1px solid #eeeeee; padding-top: 20px; margin-top: 30px;">
                          <p style="color: #999999; font-size: 12px; line-height: 1.4; margin: 0;">
                            Vous recevez cet email car vous avez créé un compte sur Voyage App. Si vous avez des questions, n'hésitez pas à nous contacter.
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                        <p style="color: #999999; font-size: 12px; margin: 0;">
                          © ${new Date().getFullYear()} Voyage App. Tous droits réservés.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      });

      if (error) {
        console.error('[Email] Error sending verification email:', error);
        return {
          success: false,
          message: error.message || 'Failed to send email',
        };
      }

      console.log('[Email] Verification email sent successfully:', data?.id);
      return {
        success: true,
        message: 'Email sent successfully',
        emailId: data?.id,
      };
    } catch (error) {
      console.error('[Email] Unexpected error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });
