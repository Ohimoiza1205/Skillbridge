# SkillBridge – CLI-based Job Seeker Assistant

**SkillBridge** is a command-line tool designed to help job seekers:
- Generate resume bullets and interview tips using AI
- Find relevant job training programs
- Save their job goals to a local file

## Tech Stack
- Node.js (CLI)
- OpenAI API (for GenAI suggestions)
- Inquirer (interactive CLI prompts)
- JSON (mock job training DB)
- fs (file save/load)
- Jest (unit testing)

## How It Works
1. User enters the job role they're applying for
2. GenAI returns resume bullets & interview advice
3. CLI displays job training programs from `training_data.json`
4. User can save their job goal to `career.json`

## File Structure (Planned)
skillbridge/
├── index.js # Main CLI app
├── training_data.json # Mock job training data
├── career.json # File to save user job goals
├── helpers.js # AI call, DB lookup, save logic
├── .env # API keys
├── README.md # This file
├── test/
│ └── helpers.test.js # Unit tests
├── package.json

Author
Built by Ohi and Jared for SEO Tech Developer – Summer 2025.
