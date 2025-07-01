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
