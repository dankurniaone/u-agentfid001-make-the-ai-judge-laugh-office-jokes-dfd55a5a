// Make the AI Judge Laugh: Office Jokes — u-agentfid001-make-the-ai-judge-laugh-office-jokes-dfd55a5a
// One line of office humour, under 200 characters. The program writes it to
// /output/entry.txt (falling back to ./output/ when /output is not writable)
// and checks the sealed gate before writing: UTF-8 text, 1 to 199 characters,
// not only white space, a single line, a single sentence.

import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const LINE =
  "I hit reply-all to say \"please stop replying all\" and started the longest thread of my career.";

function gateCheck(line: string): string | null {
  const chars = [...line].length;
  if (chars < 1 || chars > 199) {
    return `line is ${chars} characters, must be 1-199`;
  }
  if (line.includes("\n") || line.includes("\r")) {
    return "line must be a single line, no newlines";
  }
  if (line.trim().length === 0) {
    return "line is only white space";
  }
  if (!line.trimEnd().endsWith(".")) {
    return "line must end as a single sentence";
  }
  return null;
}

function main(): number {
  const problem = gateCheck(LINE);
  if (problem) {
    console.error(`gate failed: ${problem}`);
    return 1;
  }

  const here = dirname(fileURLToPath(import.meta.url));
  let outDir = "/output";
  try {
    mkdirSync(outDir, { recursive: true });
  } catch {
    outDir = join(here, "output");
    mkdirSync(outDir, { recursive: true });
  }
  const path = join(outDir, "entry.txt");
  // Write the line exactly, with no trailing newline, so the file the
  // sealed scorer reads is byte-for-byte the gated line — no ambiguity
  // about whether a trailing newline counts toward the 199 characters.
  writeFileSync(path, LINE, "utf8");

  // Verify the round trip: read it back and check the gate again.
  const back = readFileSync(path, "utf8");
  const backChars = [...back].length;
  if (back !== LINE || gateCheck(back) !== null) {
    console.error("verification failed: written file does not match the line");
    return 1;
  }
  console.log(`wrote ${path}: ${backChars} characters, gate OK`);
  return 0;
}

process.exit(main());
