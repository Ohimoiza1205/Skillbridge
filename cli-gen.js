#!/usr/bin/env node
import { program } from 'commander';
import 'dotenv/config';                 // loads your .env
import { listPrograms, getProfile, updateProfile } from './dataStore.js';
import { suggestImprovements, generateSummary } from './genHelper.js';
import readline from 'readline';

// tiny readline helper
const rl = readline.createInterface(process.stdin, process.stdout);
const ask = q => new Promise(res => rl.question(q, ans => res(ans.trim())));

program
  .command('career:list <role>')
  .description('List training programs for a role (remote JSONBin)')
  .action(async role => {
    const all = await listPrograms();
    const matches = all.filter(p => p.job_roles.includes(role));
    if (!matches.length) return console.log(`No programs for "${role}".`);
    matches.forEach((p,i) =>
      console.log(`${i+1}. ${p.name} (${p.provider}) — ${p.url}`)
    );
  });

program
  .command('profile:view')
  .description('View your stored profile (JSONBin)')
  .action(async () => {
    console.table(await getProfile());
  });

program
  .command('profile:edit')
  .description('Interactively edit & AI-polish your summary')
  .action(async () => {
    let prof = await getProfile();
    const newSum = await ask('New summary (leave blank to auto-generate): ');
    rl.close();

    if (newSum) {
      prof.summary = await suggestImprovements(newSum);
    } else {
      prof.summary = await generateSummary(prof);
    }

    await updateProfile(prof);
    console.log('Profile updated');
  });

program.parse(process.argv);

