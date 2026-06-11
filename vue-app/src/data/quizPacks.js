// Quiz Packs - Collections of themed quizzes
// Each pack contains a subset of photos from quizData.js

import { quizData } from './quizData.js';

export const quizPacks = [
  {
    id: 'family-vintage',
    title: 'Rodinná Klasika',
    titleEn: 'Family Classics',
    description: 'Vintage rodinné fotografie z 60. až 80. let',
    descriptionEn: 'Vintage family photos from the 60s-80s',
    thumbnail: 'IMG_4246_1.jpg', // First photo as thumbnail
    photoIndices: Array.from({ length: 23 }, (_, i) => i), // All 23 photos
    color: '#4a90e2', // Blue theme color
  },
  {
    id: 'retro-style',
    title: 'Retro Styl',
    titleEn: 'Retro Style',
    description: 'Móda a styl vintage éry',
    descriptionEn: 'Fashion and style of the vintage era',
    thumbnail: 'IMG_4246_1.jpg',
    photoIndices: [0, 1, 2, 3, 4, 5, 6, 7], // First 8 photos
    color: '#e67e22', // Orange theme color
  },
  {
    id: 'family-moments',
    title: 'Rodinné Okamžiky',
    titleEn: 'Family Moments',
    description: 'Vzpomínky na rodinné chvíle',
    descriptionEn: 'Memories of family moments',
    thumbnail: 'IMG_4246_2.jpg',
    photoIndices: [8, 9, 10, 11, 12, 13, 14, 15], // Middle 8 photos
    color: '#27ae60', // Green theme color
  },
];

/**
 * Get quiz pack by ID
 * @param {string} packId - The ID of the quiz pack
 * @returns {object|null} Quiz pack object or null if not found
 */
export function getQuizPackById(packId) {
  return quizPacks.find((pack) => pack.id === packId) || null;
}

/**
 * Get quiz data for a specific pack
 * @param {string} packId - The ID of the quiz pack
 * @returns {Array} Array of quiz items from quizData
 */
export function getQuizDataForPack(packId) {
  const pack = getQuizPackById(packId);
  if (!pack) return [];

  return pack.photoIndices.map((index) => quizData[index]).filter(Boolean);
}

/**
 * Get metadata for a quiz pack
 * @param {string} packId - The ID of the quiz pack
 * @returns {object} Metadata including photo count and question count
 */
export function getPackMetadata(packId) {
  const quizItems = getQuizDataForPack(packId);
  const photoCount = quizItems.length;
  const questionCount = quizItems.reduce((sum, item) => sum + (item.questions?.length || 0), 0);

  return {
    photoCount,
    questionCount,
  };
}
