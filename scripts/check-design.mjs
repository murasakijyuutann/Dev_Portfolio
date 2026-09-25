#!/usr/bin/env node
// Fails on hardcoded styling that bypasses the design tokens.
// Suppress a deliberate exception by adding `design-ok` in a comment on that line.
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const files = execSync(
  "git ls-files -c -o --exclude-standard -- app components content src lib",
  { encoding: "utf8" },
)
  .split("\n")
  .filter((f) => /\.(tsx?|jsx?|mdx|css)$/.test(f))
  .filter((f) => !f.endsWith("app/globals.css") && !f.endsWith("app\\globals.css"))
  .filter((f) => existsSync(f));

const rules = [
  [/#[0-9a-fA-F]{3,8}\b(?![-\w])/, "hardcoded hex color — use a token"],
  [/\b(rgba?|hsla?|oklch|oklab)\(/, "hardcoded color function — use a token"],
  [/\b(text|bg|border|fill|stroke|from|to|via)-\[(#|rgb|hsl|oklch)/, "arbitrary color value — use a token"],
  [/\b(bg|text|border|ring|from|to|via|fill|stroke)-(zinc|slate|gray|neutral|stone|indigo|violet|purple|blue|black|white)(-\d{2,3})?\b/, "palette color class — use semantic tokens"],
  [/\brounded-(lg|xl|2xl|3xl)\b/, "soft radius — use `rounded` or `rounded-sm`"],
  [/\bshadow-(xs|sm|md|lg|xl|2xl)\b/, "soft shadow — use `shadow-hard` or none"],
  [/\bbg-(gradient|linear|radial|conic)-/, "gradients are banned"],
  [/\bbackdrop-blur/, "backdrop blur is banned"],
  [/\btext-\[\d/, "arbitrary font size — use the type scale tokens"],
  [/font-\[?['"]?(inter|roboto)|fontFamily:\s*['"](Inter|Roboto)/i, "banned typeface"],
  [/@import\s+url\(.*fonts\.googleapis/, "load fonts with next/font, not @import"],
];

let failures = 0;
for (const file of files) {
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (line.includes("design-ok")) return;
      for (const [re, msg] of rules) {
        if (re.test(line)) {
          console.log(`${file}:${i + 1}  ${msg}\n    ${line.trim()}`);
          failures++;
        }
      }
    });
}

if (failures) {
  console.log(`\n✗ ${failures} design violation(s).`);
  process.exit(1);
}
console.log("✓ design check passed");
