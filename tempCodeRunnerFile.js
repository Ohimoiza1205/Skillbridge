import inquirer from 'inquirer'
import dotenv from 'dotenv'
import { getProgramsForJob, saveCareerGoal } from './helpers.js'
import { parseResume } from './resumeParser.js'
dotenv.config()

// Step 1: Ask if user wants to upload a resume
const { uploadResume } = await inquirer.prompt([
  {
    type: 'confirm',
    name: 'uploadResume',
    message: 'Do you want to upload a resume for parsing?',
    default: true
  }
])

let job = ''
if (uploadResume) {
  const { filePath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'filePath',
      message: 'Enter the full path to your resume file (PDF, DOCX, or TXT):'
    }
  ])

  const parsed = await parseResume(filePath, process.env.RESUME_API_KEY)

  if (parsed) {
    console.log('\nResume Parsed Successfully:\n')
    console.log(`Name: ${parsed.name}`)
    console.log(`Email: ${parsed.email}`)
    console.log(`Skills: ${parsed.skills?.join(', ') || 'N/A'}`)
    job = parsed.target_job_title || ''
  } else {
    console.log('Could not parse resume. Please try again or continue manually.')
  }
}

// Step 2: If no resume or no job found, ask manually
if (!job) {
  const { manualJob } = await inquirer.prompt([
    {
      type: 'input',
      name: 'manualJob',
      message: 'Enter the job you are targeting:'
    }
  ])
  job = manualJob
}

// Step 3: Fetch and show programs
const programs = getProgramsForJob(job)

console.log(`\nSuggested programs for ${job}:\n`)
programs.forEach(p => {
  console.log(`- ${p.name} (${p.provider})`)
})

// Step 4: Save career goal
const { shouldSave } = await inquirer.prompt([
  {
    type: 'confirm',
    name: 'shouldSave',
    message: 'Save this career goal?',
    default: true
  }
])

if (shouldSave) {
  saveCareerGoal(job, programs)
}
