import { Person } from '../types/person';

const API_URL = 'https://raw.githubusercontent.com/calebtodd/FHU-social-club/main/sample_people_50_v4_with_id.json';

export const fetchPeople = async (): Promise<Person[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch people data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching people:', error);
    const peopleData = require('../sample_people_50_v4_with_id.json');
    return peopleData;
  }
};

export const searchPeople = (people: Person[], query: string): Person[] => {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) {
    return people;
  }

  return people.filter(person =>
    person.firstName.toLowerCase().includes(lowerQuery) ||
    person.lastName.toLowerCase().includes(lowerQuery)
  );
};
