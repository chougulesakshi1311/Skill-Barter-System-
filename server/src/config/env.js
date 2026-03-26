const requiredVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "PORT",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
];

const validateEnv = () => {
  const missing = requiredVars.filter((name) => !process.env[name]);

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};

module.exports = {
  validateEnv,
};
