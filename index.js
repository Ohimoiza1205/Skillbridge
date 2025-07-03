import dotenv from 'dotenv'
import inquirer from 'inquirer'
import { parseResume } from './resumeParser.js'
import fs from 'fs'
import path from 'path'

dotenv.config()

async function main() {
  console.log('\nWelcome to SkillBridge CLI\n')

  const { method } = await inquirer.prompt([
    {
      type: 'list',
      name: 'method',
      message: 'How would you like to start?',
      choices: ['Upload Resume File', 'Enter Info Manually']
    }
  ])

  let resumeData = {}

  if (method === 'Upload Resume File') {
    const { filePath } = await inquirer.prompt([
      {
        type: 'input',
        name: 'filePath',
        message: 'Enter the path to your resume file (.pdf or .docx):'
      }
    ])

    const apiKey = process.env.API_KEY
    if (!apiKey) {
      console.error('Error: Missing API key. Make sure .env contains API_KEY=...')
      process.exit(1)
    }

    const parsed = await parseResume(filePath, apiKey)
    if (!parsed) {
      console.log('Failed to parse resume. Exiting.')
      return
    }

    resumeData = parsed
  } else {
    resumeData = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is your full name?'
      },
      {
        type: 'input',
        name: 'email',
        message: 'What is your email address?'
      },
      {
        type: 'input',
        name: 'phone',
        message: 'What is your phone number?'
      },
      {
        type: 'input',
        name: 'skills',
        message: 'List your skills (comma-separated):'
      },
      {
        type: 'input',
        name: 'summary',
        message: 'Enter a short professional summary:'
      }
    ])

    // Normalize skills into array if entered manually
    resumeData.skills = resumeData.skills.split(',').map(s => s.trim())
  }

  console.log('\nResume Data Collected:\n')
  console.log(`Name: ${resumeData.name || 'N/A'}`)
  console.log(`Email: ${resumeData.email || 'N/A'}`)
  console.log(`Phone: ${resumeData.phone || 'N/A'}`)
  console.log(`Skills: ${resumeData.skills?.join(', ') || 'N/A'}`)

  const { shouldSave } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'shouldSave',
      message: 'Would you like to save this data locally to resume.json?',
      default: true
    }
  ])

  if (shouldSave) {
    const outputPath = path.join(process.cwd(), 'resume.json')
    fs.writeFileSync(outputPath, JSON.stringify(resumeData, null, 2))
    console.log(`\nSaved resume data to ${outputPath}`)
  }

  console.log('\nSkillBridge CLI complete.\n')
}

main()
