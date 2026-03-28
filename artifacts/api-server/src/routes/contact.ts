import { Router } from "express";
import { Resend } from "resend";
import { connectMongoose } from "../lib/mongoose.js";
import { ContactSubmission } from "../models/ContactSubmission.js";

const router = Router();
const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/contact — public form submission
router.post("/", async (req, res) => {
  try {
    await connectMongoose();
    const { name, email, projectType, message } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    await ContactSubmission.create({ name, email, projectType, message: message || "" });

    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: adminEmail,
          subject: `New message from ${name}`,
          html: `
            <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:12px;">
              <h2 style="color:#1e293b;margin-bottom:4px;">New portfolio message</h2>
              <p style="color:#64748b;font-size:14px;margin-bottom:24px;">Someone reached out via your contact form.</p>
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;width:80px;font-weight:600;">Name</td>
                  <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#1e293b;font-size:14px;">${name}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;font-weight:600;">Email</td>
                  <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#1e293b;font-size:14px;"><a href="mailto:${email}" style="color:#6366f1;text-decoration:none;">${email}</a></td>
                </tr>
                ${message ? `
                <tr>
                  <td style="padding:10px 0;color:#64748b;font-size:13px;font-weight:600;vertical-align:top;">Message</td>
                  <td style="padding:10px 0;color:#1e293b;font-size:14px;white-space:pre-wrap;">${message}</td>
                </tr>` : ""}
              </table>
              <div style="margin-top:24px;text-align:center;">
                <a href="mailto:${email}" style="display:inline-block;padding:12px 28px;background:#6366f1;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Reply to ${name}</a>
              </div>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Failed to send notification email:", emailErr);
      }
    }

    res.status(201).json({ success: true, message: "Message sent!" });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: String(err) });
  }
});

export default router;
