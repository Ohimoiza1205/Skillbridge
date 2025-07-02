import fs from 'fs';

/**
 * Loads training data from the local JSON file.
 * @returns {Array} Array of training program objects.
 */
export function loadTrainingData() {
  try {
    const data = fs.readFileSync('./training_data.json', 'utf-8');
    const parsed = JSON.parse(data);
    return parsed.training_programs;
  } catch (error) {
    console.error('Error loading training data:', error.message);
    return [];
  }
}

/**
 * Finds training programs relevant to a given job title.
 * @param {string} jobTitle - The job title input by the user.
 * @returns {Array} List of matched training programs.
 */
export function getProgramsForJob(jobTitle) {
  const allPrograms = loadTrainingData();

  // Normalize job title for comparison
  const lowerCaseJob = jobTitle.toLowerCase();

  // Filter programs where job_roles includes the title
  const matches = allPrograms.filter(program =>
    program.job_roles.some(role => {
      return role.toLowerCase() === lowerCaseJob || role === 'All Roles';
    })
  );

  return matches;
}

/**
 * Saves a career goal and suggested programs to career.json.
 * @param {string} jobTitle - The job the user is targeting.
 * @param {Array} programs - Array of matching training programs.
 */
export function saveCareerGoal(jobTitle, programs) {
  const filepath = './career.json'
  const newEntry = {
    jobTitle,
    savedAt: new Date().toISOString(),
    programs: programs.map(p => ({
      name: p.name,
      provider: p.provider
    }))
  }

  let existingData = []

  try {
    if (fs.existsSync(filepath)) {
      const fileContent = fs.readFileSync(filepath, 'utf-8')
      existingData = JSON.parse(fileContent)
    }
  } catch (err) {
    console.error('Error reading career.json:', err.message)
  }

  existingData.push(newEntry)

  try {
    fs.writeFileSync(filepath, JSON.stringify(existingData, null, 2))
    console.log('Career goal saved to career.json')
  } catch (err) {
    console.error('Failed to save career goal:', err.message)
  }
}
