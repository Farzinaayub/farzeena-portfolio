import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { magicLink } from "better-auth/plugins";
import { Resend } from "resend";
import { client, dbName } from "./mongodb.js";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY environment variable is required");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-change-in-prod",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: mongodbAdapter(client, { dbName }),
  plugins: [
    magicLink({
      disableSignUp: true,
      expiresIn: 60 * 15,
      sendMagicLink: async ({ email, url }: { email: string; url: string }) => {
        await resend.emails.send({
          from: "Farzeena Admin <onboarding@resend.dev>",
          to: email,
          subject: "Your Admin Login Link — Farzeena Portfolio",
          html: `
            <div style="font-family:Inter,sans-serif;max-width:480px;margin:auto;padding:32px">
              <h2 style="color:#0F172A">Sign in to Farzeena Admin</h2>
              <p style="color:#374151">Click the button below to sign in. This link expires in 15 minutes and can only be used once.</p>
              <a href="${url}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#1D4ED8;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
                Sign In to Admin
              </a>
              <p style="color:#6B7280;margin-top:24px;font-size:13px">If you didn't request this, ignore this email.</p>
            </div>
          `,
        });
      },
    }),
  ],
});
