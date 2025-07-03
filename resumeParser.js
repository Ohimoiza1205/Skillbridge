import fs from 'fs'
import fetch from 'node-fetch'
import FormData from 'form-data'
import mime from 'mime-types'
import ora from 'ora'

/**
 * Parses a resume using the APILayer Resume Parser API.
 * @param {string} filePath - Local path to the resume file.
 * @param {string} apiKey - Your APILayer API key from .env.
 * @returns {Promise<Object|null>} Parsed resume data or null on error.
 */
export async function parseResume(filePath, apiKey) {
  const spinner = ora('Parsing resume...').start()

  try {
    const fileStream = fs.createReadStream(filePath)
    const ext = filePath.split('.').pop().toLowerCase()
    let mimeType = mime.lookup(filePath)

    // Backup logic for unsupported or empty mime types
    if (!mimeType || mimeType === false) {
      if (ext === 'pdf') mimeType = 'application/pdf'
      else if (ext === 'doc' || ext === 'docx') mimeType = 'application/msword'
      else {
        spinner.fail('Unsupported file type. Must be .pdf, .doc, or .docx')
        return null
      }
    }

    // Fallback: if docx detected, use application/msword (API prefers it)
    if (ext === 'docx') mimeType = 'application/msword'

    const form = new FormData()
    form.append('file', fileStream, {
      filename: filePath.split('/').pop(),
      contentType: mimeType
    })

    const response = await fetch('https://api.apilayer.com/resume_parser/upload', {
      method: 'POST',
      headers: {
        apikey: apiKey,
        ...form.getHeaders()
      },
      body: form
    })

    const responseText = await response.text()

    if (!response.ok) {
      spinner.fail(`Resume parsing failed: ${response.status} ${response.statusText}`)
      console.error(JSON.parse(responseText))
      return null
    }

    const data = JSON.parse(responseText)
    spinner.succeed('Resume parsed successfully')

    // Debug info
    console.log('\nDEBUG INFO:')
    console.log(`- File Path: ${filePath}`)
    console.log(`- File Exists: ${fs.existsSync(filePath)}`)
    console.log(`- File Extension: .${ext}`)
    console.log(`- MIME Type: ${mimeType}`)
    console.log(`- API Key Loaded: ${!!apiKey}`)

    return data
  } catch (err) {
    spinner.fail('Error parsing resume')
    console.error(err.message)
    return null
  }
}
