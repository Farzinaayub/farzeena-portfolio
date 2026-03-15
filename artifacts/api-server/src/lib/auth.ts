import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";
import { client, dbName } from "./mongodb.js";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY environment variable is required");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-change-in-prod",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: mongodbAdapter(client.db(dbName)),
  plugins: [
    emailOTP({
      disableSignUp: true,
      expiresIn: 60 * 10,
      async sendVerificationOTP({ email, otp, type }) {
        await resend.emails.send({
          from: "Farzeena Admin <onboarding@resend.dev>",
          to: email,
          subject: "Your Admin Login Code — Farzeena Portfolio",
          html: `
            <div style="font-family:Inter,sans-serif;max-width:480px;margin:auto;padding:32px">
              <h2 style="color:#0F172A">Sign in to Farzeena Admin</h2>
              <p style="color:#374151">Use the code below to sign in. This code expires in 10 minutes.</p>
              <div style="margin:24px 0;text-align:center">
                <span style="display:inline-block;padding:16px 32px;background:#1D4ED8;color:#fff;border-radius:12px;font-size:32px;font-weight:700;letter-spacing:0.2em">
                  ${otp}
                </span>
              </div>
              <p style="color:#6B7280;font-size:13px">If you didn't request this code, ignore this email.</p>
            </div>
          `,
        });
      },
    }),
  ],
});
