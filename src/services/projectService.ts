import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase.config';

export interface Project {
  id?: string;
  name: string;
  description: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  startDate: string;
  endDate: string;
  assignedEngineers: number;
  requiredEngineers: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  budget: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Projects CRUD Operations
export const projectService = {
  // Get all projects with real-time updates
  subscribeToProjects: (callback: (projects: Project[]) => void) => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const projects: Project[] = [];
      snapshot.forEach((doc) => {
        projects.push({ id: doc.id, ...doc.data() } as Project);
      });
      callback(projects);
    });
  },

  // Add new project
  addProject: async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const projectData = {
        ...project,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      const docRef = await addDoc(collection(db, 'projects'), projectData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  },

  // Update project
  updateProject: async (id: string, updates: Partial<Project>) => {
    try {
      const projectRef = doc(db, 'projects', id);
      await updateDoc(projectRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  // Delete project
  deleteProject: async (id: string) => {
    try {
      const projectRef = doc(db, 'projects', id);
      await deleteDoc(projectRef);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  // Get project by ID
  getProjectById: async (id: string): Promise<Project | null> => {
    try {
      const projectRef = doc(db, 'projects', id);
      const projectDoc = await getDocs(collection(db, 'projects'));
      const project = projectDoc.docs.find(doc => doc.id === id);
      return project ? { id: project.id, ...project.data() } as Project : null;
    } catch (error) {
      console.error('Error getting project:', error);
      throw error;
    }
  },

  // Update assigned engineers count
  updateAssignedEngineers: async (id: string, count: number) => {
    try {
      const projectRef = doc(db, 'projects', id);
      await updateDoc(projectRef, {
        assignedEngineers: count,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating assigned engineers count:', error);
      throw error;
    }
  },
}; 