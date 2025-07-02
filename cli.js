#!/usr/bin/env node
import { getProgramsForJob, saveCareerGoal } from './helpers.js';
import readline from 'readline';

const jobTitle = process.argv.slice(2).join(' ').trim();

if (!jobTitle) {
  console.error('Usage: node cli.js "<job title>"');
  process.exit(1);
}

const programs = getProgramsForJob(jobTitle);

if (programs.length === 0) {
  console.log(`No training programs found for “${jobTitle}”.`);
  process.exit(0);
}

console.log(`\nTraining programs for “${jobTitle}”:\n`);
programs.forEach((p, i) => console.log(`${i + 1}. ${p.name} (${p.provider})`));

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question('\nSave these programs to career.json? (y/n): ', ans => {
  if (ans.toLowerCase().startsWith('y')) {
    saveCareerGoal(jobTitle, programs);
  }
  rl.close();
});

