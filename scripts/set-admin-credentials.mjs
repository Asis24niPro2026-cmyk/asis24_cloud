#!/usr/bin/env node

import "dotenv/config";
import { setAdminCredentials } from "../server/auth-admin.ts";
import process from "process";

async function main() {
  const username = process.argv[2];
  const password = process.argv[3];

  if (!username || !password) {
    console.error("❌ Uso: node scripts/set-admin-credentials.mjs <usuario> <contraseña>");
    console.error("");
    console.error("Ejemplo:");
    console.error("  node scripts/set-admin-credentials.mjs admin micontraseña123");
    process.exit(1);
  }

  if (password.length < 6) {
    console.error("❌ La contraseña debe tener al menos 6 caracteres");
    process.exit(1);
  }

  try {
    console.log(`⏳ Estableciendo credenciales para el usuario: ${username}...`);
    await setAdminCredentials(username, password);
    console.log(`✅ Credenciales establecidas exitosamente`);
    console.log("");
    console.log("Puedes iniciar sesión en el panel de administración con:");
    console.log(`  Usuario: ${username}`);
    console.log(`  Contraseña: ${password}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al establecer credenciales:", error);
    process.exit(1);
  }
}

main();
