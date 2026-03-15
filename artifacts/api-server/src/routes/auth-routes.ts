import { Router } from "express";
import type { Request, Response } from "express";
import { auth } from "../lib/auth.js";
import { client, dbName } from "../lib/mongodb.js";

const router = Router();

router.post("/request-magic-link", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const db = client.db(dbName);
    const usersCollection = db.collection("user");
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(403).json({
        error: "Unauthorized",
        message:
          "This email is not authorized. Contact the site owner.",
      });
    }

    const url = new URL(req.url, `${req.protocol}://${req.get("host")}`);
    const callbackUrl = `${req.protocol}://${req.get("host")}/admin/dashboard`;

    const response = await auth.api.signInMagicLink({
      body: { email, callbackURL: callbackUrl },
      asResponse: true,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: "Failed to send magic link",
        message: (data as { message?: string }).message || "Unknown error",
      });
    }

    res.json({ success: true, message: "Magic link sent to your email" });
  } catch (err) {
    console.error("Magic link error:", err);
    res.status(500).json({ error: "Server error", message: String(err) });
  }
});

router.get("/verify-session", async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as Record<string, string>,
    });

    if (!session) {
      return res.status(401).json({ authenticated: false });
    }

    res.json({
      authenticated: true,
      email: session.user?.email,
      name: session.user?.name,
    });
  } catch (err) {
    res.status(401).json({ authenticated: false });
  }
});

router.post("/sign-out", async (req: Request, res: Response) => {
  try {
    await auth.api.signOut({
      headers: req.headers as Record<string, string>,
    });
    res.json({ success: true, message: "Signed out" });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: String(err) });
  }
});

export default router;
