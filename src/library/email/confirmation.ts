// import { sendEmail } from '@/library/email/client'

// export function generateConfirmationURL() {
//   return 'this is the URL'
// }

// export function generateConfirmationLink() {
//   return 'this is the confirmation link'
// }

// interface MagicLinkResponse {
//   success: boolean
//   response?: any
//   error?: any
// }

// export const sendMagicLink = async (email: string, token: string): Promise<MagicLinkResponse> => {
//   const link = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`

//   const html = `
//     <h1>Login to Your Account</h1>
//     <p>Click the link below to log in to your account. This link will expire in 15 minutes.</p>
//     <a href="${link}" style="
//       background-color: #4F46E5;
//       color: white;
//       padding: 12px 24px;
//       text-decoration: none;
//       border-radius: 4px;
//       display: inline-block;
//       margin: 16px 0;
//     ">Login to Your Account</a>
//     <p>Or copy and paste this URL into your browser:</p>
//     <p>${link}</p>
//     <p>If you didn't request this login link, you can safely ignore this email.</p>
//   `

//   const text = `
//     Login to Your Account

//     Click the link below to log in to your account. This link will expire in 15 minutes.

//     ${link}

//     If you didn't request this login link, you can safely ignore this email.
//   `

//   return await sendEmail({
//     to: email,
//     subject: 'Login to Your Account',
//     html,
//     text,
//   })
// }

// // utils/mailgun/confirm.ts

// interface ConfirmationEmailResponse {
//   success: boolean
//   response?: any
//   error?: any
// }

// export const sendConfirmationEmail = async (
//   email: string,
//   name?: string,
// ): Promise<ConfirmationEmailResponse> => {
//   const html = `
//     <h1>Welcome${name ? ` ${name}` : ''}!</h1>
//     <p>Thank you for creating an account. We're excited to have you on board!</p>
//     <p>You can now log in to your account and start using our services.</p>
//     <p>If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
//   `

//   const text = `
//     Welcome${name ? ` ${name}` : ''}!

//     Thank you for creating an account. We're excited to have you on board!

//     You can now log in to your account and start using our services.

//     If you have any questions or need assistance, don't hesitate to reach out to our support team.
//   `

//   return await sendEmail({
//     to: email,
//     subject: 'Welcome to Your Account',
//     html,
//     text,
//   })
// }
