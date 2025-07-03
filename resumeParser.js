import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import FormData from 'form-data'

export async function parseResume(filePath, apiKey) {
  try {
    const form = new FormData()
    form.append('file', fs.createReadStream(filePath))
    form.append('fileName', path.basename(filePath))

    console.log('Uploading resume to Affinda...')
    
    const uploadRes = await fetch('https://api.affinda.com/v2/documents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...form.getHeaders()
      },
      body: form
    })

    console.log(`Upload response status: ${uploadRes.status}`)
    
    const uploadText = await uploadRes.text()
    console.log('Raw upload response:', uploadText.substring(0, 500) + '...')

    let uploadJson
    try {
      uploadJson = JSON.parse(uploadText)
    } catch (err) {
      console.error('\nInvalid JSON from Affinda:\n')
      console.error(uploadText)
      return null
    }

    console.log('Parsed upload response:', JSON.stringify(uploadJson, null, 2))

    const identifier = uploadJson.identifier
    if (!identifier) {
      console.error('No identifier in response. Full response:', uploadJson)
      return null
    }

    console.log(`Uploaded resume. Affinda document ID: ${identifier}`)

    // Wait up to 60 seconds for resume to be parsed
    const delay = ms => new Promise(res => setTimeout(res, ms))
    const maxAttempts = 10 // Reduced for testing

    for (let i = 0; i < maxAttempts; i++) {
      console.log(`\nStatus check ${i + 1}/${maxAttempts}`)

      const statusRes = await fetch(`https://api.affinda.com/v2/documents/${identifier}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      })

      console.log(`Status response: ${statusRes.status}`)

      if (!statusRes.ok) {
        const errorText = await statusRes.text()
        console.error(`Status check failed: ${statusRes.status} ${statusRes.statusText}`)
        console.error('Error response:', errorText)
        continue
      }

      const statusJson = await statusRes.json()
      
      // Log the full response structure
      console.log('Full status response:')
      console.log(JSON.stringify(statusJson, null, 2))

      // Check all possible ready indicators
      const readyChecks = {
        'data.meta.ready': statusJson.data?.meta?.ready,
        'meta.ready': statusJson.meta?.ready,
        'ready': statusJson.ready,
        'data.ready': statusJson.data?.ready,
        'status === "ready"': statusJson.status === 'ready',
        'data.status === "ready"': statusJson.data?.status === 'ready',
        'meta.status === "ready"': statusJson.meta?.status === 'ready'
      }

      console.log('Ready status checks:', readyChecks)

      // Check if any indicate ready
      const isReady = Object.values(readyChecks).some(val => val === true)

      if (isReady) {
        console.log(`\nResume is ready after ${i + 1} checks.`)
        return statusJson.data || statusJson
      }

      // Check for error conditions
      const errorChecks = {
        'data.meta.error': statusJson.data?.meta?.error,
        'meta.error': statusJson.meta?.error,
        'error': statusJson.error,
        'data.error': statusJson.data?.error,
        'status === "error"': statusJson.status === 'error',
        'data.status === "error"': statusJson.data?.status === 'error'
      }

      console.log('Error status checks:', errorChecks)

      const hasError = Object.values(errorChecks).some(val => val === true || (val && val !== false))

      if (hasError) {
        console.error('\nDocument processing failed:', errorChecks)
        return null
      }

      await delay(3000) // Longer delay for debugging
    }

    console.error('\nResume not ready after maximum attempts.')
    return null
  } catch (err) {
    console.error('Unexpected error in parseResume():', err)
    return null
  }
}
