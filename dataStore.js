// dataStore.js
import axios from 'axios';

const BASE = `https://api.jsonbin.io/v3/b/${process.env.JSONBIN_BIN_ID}`;
const HDRS = {
  'X-Access-Key': process.env.JSONBIN_API_KEY,
  'Content-Type': 'application/json'
};

/**
 * Fetch the entire JSON record (training_programs, profile, career_goals)
 */
export async function fetchData() {
  const resp = await axios.get(`${BASE}/latest`, { headers: HDRS });
  return resp.data.record;
}

/**
 * Overwrite the entire record with the provided object
 * @param {Object} record — the full JSON record to save
 */
export async function saveData(record) {
  await axios.put(BASE, record, { headers: HDRS });
}

/**
 * List only the training programs array
 * @returns {Array<Object>} training_programs
 */
export async function listPrograms() {
  const { training_programs } = await fetchData();
  return training_programs;
}

/**
 * Get only the stored user profile
 * @returns {Object} profile
 */
export async function getProfile() {
  const { profile } = await fetchData();
  return profile;
}

/**
 * Replace the stored profile with a new one
 * @param {Object} newProfile
 */
export async function updateProfile(newProfile) {
  const record = await fetchData();
  record.profile = newProfile;
  await saveData(record);
}

