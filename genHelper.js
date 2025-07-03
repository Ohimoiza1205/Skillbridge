// genHelper.js
import pkg from '@google-ai/generativelanguage';
const { v1beta2 } = pkg;
const { TextServiceClient } = v1beta2;

const client = new TextServiceClient({
  apiKey: process.env.GOOGLE_API_KEY
});

/**
 * Polishes a short paragraph (e.g. a résumé summary).
 * Returns the AI-improved text.
 */
export async function suggestImprovements(text) {
  const [response] = await client.generateText({
    model: 'models/text-bison-001',
    prompt: { text: `Please improve this resume summary for clarity and professionalism:\n\n${text}` },
    temperature: 0.2
  });
  return response.candidates?.[0]?.output.trim() || text;
}

/**
 * Generates a 2–3 sentence summary from profile fields.
 * profile should have { name, currentJob, skills: [], education }.
 */
export async function generateSummary(profile) {
  const skills = profile.skills.join(', ');
  const promptText = `
Given this profile:
- Name: ${profile.name}
- Current job: ${profile.currentJob}
- Skills: ${skills}
- Education: ${profile.education}

Write a concise 2–3 sentence professional summary suitable for a resume.
`;
  const [response] = await client.generateText({
    model: 'models/text-bison-001',
    prompt: { text: promptText },
    temperature: 0.3
  });
  return response.candidates?.[0]?.output.trim() || '';
}

