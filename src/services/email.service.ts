export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  role: "admin" | "customer"
): Promise<void> => {
  const port = process.env.PORT || 4000;
  const resetUrl = `http://localhost:${port}/api/auth/${role}/reset-password`;

  // Wire nodemailer here when SMTP env vars are configured.
  console.log("Password reset email (dev log):");
  console.log(`  To: ${email}`);
  console.log(`  Role: ${role}`);
  console.log(`  Token: ${resetToken}`);
  console.log(`  Reset with POST ${resetUrl}`);
};
