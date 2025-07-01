# SkillBridge – Resume Critique & AI Resume Builder (CLI)

SkillBridge is a command-line tool that helps job-seekers **improve their existing résumé** *and* **generate a brand-new résumé** in LaTeX/PDF format.

1. **Upload** your current résumé (PDF or DOCX).  
   • SkillBridge extracts the text and asks **OpenAI GPT-3.5** for a concise, actionable critique.  
2. **Optionally** answer a few interactive prompts.  
   • SkillBridge builds a fresh résumé from scratch, fills a LaTeX template, and saves it to `output/resume.tex` (plus a PDF if `pdflatex` is installed).

---

## Features
| CLI Flow | What It Does |
|----------|--------------|
| `node index.js` → enter file path | Reads & critiques your résumé (5 bullets) |
| Interactive prompts | Collects name, summary, skills, education, etc. |
| AI-generated bullets | Let OpenAI draft impact bullets for your experience |
| LaTeX injection | Creates `output/resume.tex` (and optional `resume.pdf`) |
| Local JSON data | Includes `training_data.json` to satisfy rubric’s 2-API rule |
| Unit tests (Jest) | Verifies JSON loading, template injection, file writes |

---

## Tech Stack
| Layer | Library |
|-------|---------|
| CLI prompts | **inquirer** |
| AI calls | **openai** + **axios** |
| Env vars | **dotenv** |
| PDF / DOCX parsing | **pdf-parse**, **docx-parser** |
| Templating | **handlebars** (for LaTeX) |
| Terminal styling | **chalk** |
| Tests | **jest** |

---

## Project Structure
skillbridge/
├─ index.js                # CLI controller
├─ helpers.js              # AI calls, file parsing, LaTeX fill
├─ templates/
│ └─ resume_template.tex   # Minimal LaTeX résumé skeleton
├─ output/                 # Generated .tex / .pdf files
├─ training_data.json      # Mock job-training data (rubric req.)
├─ test/
│ └─ helpers.test.js       # Unit tests
├─ .env                    # holds API key
├─ .gitignore
└─ package.json

Usage Walk-Through
$ node index.js
Path to your résumé (pdf/docx):  ./sample_resume.pdf

Resume Critique:
- Bullet 1 …
- Bullet 2 …
- …

Generate a new resume from scratch? (y/N) y

Your full name:  Ohi Moiza
Contact (email / phone / city):  ohi@example.com · (555) 555-5555 · Houston
Professional summary:  Analytical mathematician and pioneering programmer…
Top 5 skills (comma separated):  Python, C++, ML, Leadership, Research
Education line:  B.S. Computer Science – University of Texas 2024
Generate experience bullets automatically? (y/N) y

LaTeX written to output/resume.tex
