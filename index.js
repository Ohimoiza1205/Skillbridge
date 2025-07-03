import dotenv from 'dotenv'
import { parseResume } from './resumeParser.js'
import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'

console.log('Starting SkillBridge CLI...')

dotenv.config()
console.log('Environment loaded')

async function main() {
  try {
    console.log('\nWelcome to SkillBridge CLI\n')

    const { filePath } = await inquirer.prompt([
      {
        type: 'input',
        name: 'filePath',
        message: 'Enter the path to your resume file (.pdf or .docx):'
      }
    ])

    console.log(`File path provided: ${filePath}`)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`)
      process.exit(1)
    }

    console.log('File exists')

    const apiKey = process.env.AFFINDA_API_KEY
    if (!apiKey) {
      console.error('Error: Missing AFFINDA_API_KEY in environment')
      process.exit(1)
    }

    console.log(`API Key found: ${apiKey.substring(0, 10)}...`)

    console.log('Starting resume parsing...')
    const parsed = await parseResume(filePath, apiKey)
    
    if (!parsed) {
      console.log('Failed to parse resume. Exiting.')
      return
    }

    console.log('Resume parsed successfully!')
    console.log('Parsed data:', JSON.stringify(parsed, null, 2))

    const resumeData = {
      name: parsed.name?.raw || 'N/A',
      email: parsed.emails?.[0] || 'N/A',
      phone: parsed.phoneNumbers?.[0] || 'N/A',
      skills: parsed.skills || [],
      summary: parsed.summary || 'N/A'
    }

    console.log('Extracted resume data:', resumeData)

    const outputPath = path.join(process.cwd(), 'resume.json')
    fs.writeFileSync(outputPath, JSON.stringify(resumeData, null, 2))
    console.log(`Saved resume data to ${outputPath}`)

  } catch (error) {
    console.error('Error in main():', error)
    process.exit(1)
  }
}

console.log('Calling main function...')
main().catch(err => {
  console.error('Unhandled error:', err)
  process.exit(1)
})
