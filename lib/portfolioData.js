// lib/portfolioData.js
import { getPortfolioData } from './portfolioRepository';

export async function getPersonalInfo() {
  return (await getPortfolioData()).personal;
}

export async function getSocials() {
  return (await getPortfolioData()).socials;
}

export async function getSkills() {
  return (await getPortfolioData()).skills;
}

export async function getSections() {
  return (await getPortfolioData()).Sections;
}

export async function getExperience() {
  const entry = (await getPortfolioData()).data.experience;
  return Array.isArray(entry) ? entry : entry?.items || [];
}

export async function getEducation() {
  const entry = (await getPortfolioData()).data.education;
  return Array.isArray(entry) ? entry : entry?.items || [];
}

export async function getProjects() {
  const entry = (await getPortfolioData()).data.projects;
  return Array.isArray(entry) ? entry : entry?.items || [];
}

export { getPortfolioData as portfolioData };
