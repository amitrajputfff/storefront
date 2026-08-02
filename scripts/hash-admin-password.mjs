#!/usr/bin/env node
/**
 * One-off setup script: hashes an admin password locally and prints a
 * ready-to-paste SQL insert for the `admin_users` table. The plaintext
 * password is read from stdin with terminal echo disabled (never from
 * process.argv — argv lands in shell history and is visible in `ps`) and is
 * never written to disk or printed. Only the hash goes into the SQL you
 * paste into the Supabase SQL editor.
 *
 * Usage: node scripts/hash-admin-password.mjs
 */

import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";
import readline from "node:readline";

const scrypt = promisify(scryptCallback);

// Must match src/lib/admin/password.ts exactly.
const SCRYPT_N = 32768;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEYLEN = 64;
const MAXMEM = 64 * 1024 * 1024;

async function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, KEYLEN, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P, maxmem: MAXMEM });
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt.toString("base64")}$${hash.toString("base64")}`;
}

function ask(prompt) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function askHidden(prompt) {
  const stdin = process.stdin;
  if (!stdin.isTTY) {
    // Non-interactive stdin (piped input) has no terminal to mask — fall
    // back to a plain prompt rather than crashing on setRawMode.
    return ask(prompt);
  }
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    const wasRaw = stdin.isRaw;
    stdin.resume();
    stdin.setRawMode(true);
    stdin.setEncoding("utf8");

    let value = "";
    function onData(char) {
      char = char.toString();
      if (char === "\n" || char === "\r" || char === "") {
        stdin.setRawMode(Boolean(wasRaw));
        stdin.pause();
        stdin.removeListener("data", onData);
        process.stdout.write("\n");
        resolve(value);
        return;
      }
      if (char === "") {
        process.stdout.write("\n");
        process.exit(1);
      }
      if (char === "" || char === "\b") {
        value = value.slice(0, -1);
        return;
      }
      value += char;
    }
    stdin.on("data", onData);
  });
}

function sqlEscape(value) {
  return value.replace(/'/g, "''");
}

async function main() {
  const email = (await ask("Admin email [admin@zeevara.in]: ")) || "admin@zeevara.in";
  const password = await askHidden("Password: ");
  const confirm = await askHidden("Confirm:  ");

  if (!password || password !== confirm) {
    console.error("\nPasswords did not match (or were empty). Try again.");
    process.exit(1);
  }

  const hash = await hashPassword(password);

  console.log("\n--- paste into the Supabase SQL editor ---\n");
  console.log(
    `insert into public.admin_users (email, password_hash)\n` +
      `values ('${sqlEscape(email)}', '${sqlEscape(hash)}')\n` +
      `on conflict (email) do update set password_hash = excluded.password_hash, ` +
      `failed_attempts = 0, locked_until = null;`,
  );
  console.log("\n(only the hash above is stored — the plaintext password was never written anywhere)");
  process.exit(0);
}

main();
