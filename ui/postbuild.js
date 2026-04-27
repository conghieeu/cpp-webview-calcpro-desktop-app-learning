#!/usr/bin/env node
import fs from "fs";
import path from "path";

if (process.argv.length !== 4) {
  console.error("Usage: node generateHtmlHeader.js <input.html> <output.h>");
  process.exit(1);
}

const inputPath = path.resolve(process.argv[2]);
const outputPath = path.resolve(process.argv[3]);

if (!fs.existsSync(inputPath)) {
  console.error(`Input file does not exist: ${inputPath}`);
  process.exit(1);
}

let html = fs.readFileSync(inputPath, "utf-8");

// Minify
html = html
  .replace(/\s+/g, " ")
  .replace(/>\s+</g, "><")
  .trim();

// Use a C++ raw string literal with unique delimiter.
// Split into chunks to stay under MSVC's ~16380-char string literal limit.
const delim = "CALCPRO_RAW_END";
const CHUNK_SIZE = 8000;

let header = `#pragma once
// Auto-generated from ${path.basename(inputPath)}
// Do not edit manually.

static const char* INDEX_HTML =`;

let remaining = html;
let parts = [];

while (remaining.length > 0) {
  // Take a chunk of up to CHUNK_SIZE bytes
  let chunk = remaining.slice(0, CHUNK_SIZE);
  // Check if the rest of the string starts with a char that could end our raw delimiter
  // (just being safe - any chunk ending mid-character could be problematic)
  remaining = remaining.slice(CHUNK_SIZE);
  parts.push(`R"${delim}(${chunk})${delim}"`);
}

header += parts.join("\n") + ";\n";

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, header);

console.log(`Generated header: ${outputPath}`);
