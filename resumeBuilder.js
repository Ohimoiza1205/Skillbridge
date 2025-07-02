#!/usr/bin/env node
import fs from 'fs';
import { spawnSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(q) {
  return new Promise(resolve => rl.question(q, ans => resolve(ans.trim())));
}

async function main() {
  // 1. Gather user input
  const name       = await ask('Full name? ');
  const currentJob = await ask('Current job title? ');
  const skills     = await ask('Skills (comma-separated)? ');
  const education  = await ask('Education (e.g. B.Sc in CS, XYZ University)? ');
  const targetJob  = await ask('Job title you’re applying for? ');
  rl.close();

  // 2. Save profile.json
  const profile = {
    name,
    currentJob,
    skills: skills.split(',').map(s => s.trim()),
    education,
    targetJob,
  };
  fs.writeFileSync('profile.json', JSON.stringify(profile, null, 2));
  console.log('Saved profile.json');

  // 3. Generate LaTeX
  const tex = `
\\documentclass{article}
\\begin{document}
\\begin{center}
  {\\LARGE \\textbf{${profile.name}}}\\\\[1em]
  ${profile.currentJob} \\hfill Applying for: ${profile.targetJob}
\\end{center}

\\section*{Skills}
\\begin{itemize}
${profile.skills.map(s => `  \\item ${s}`).join('\n')}
\\end{itemize}

\\section*{Education}
${profile.education}

\\end{document}
`;
  fs.writeFileSync('resume.tex', tex);
  console.log('✅ Generated resume.tex');

  // 4. Compile to PDF
  const result = spawnSync('pdflatex', ['-interaction=nonstopmode', 'resume.tex']);

  if (result.error) {
    console.error('❌ Failed to run pdflatex:', result.error.message);
    process.exit(1);
  }

  if (result.status === 0) {
    console.log('✅ resume.pdf created');
  } else {
    const stderr = result.stderr ? result.stderr.toString() : 'No error output available';
    console.error('❌ pdflatex failed:\n', stderr);
    process.exit(result.status || 1);
  }
}

main();

