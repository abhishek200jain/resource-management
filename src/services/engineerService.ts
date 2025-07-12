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
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase.config';

export interface Engineer {
  id?: string;
  name: string;
  email: string;
  skills: string[];
  experience: number;
  availability: boolean;
  currentProjects?: string[]; // Array of project IDs
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Assignment {
  id?: string;
  engineerId: string;
  projectId: string;
  startDate: Timestamp;
  endDate?: Timestamp;
  role: string;
  hoursPerWeek: number;
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Engineers CRUD Operations
export const engineerService = {
  // Get all engineers with real-time updates
  subscribeToEngineers: (callback: (engineers: Engineer[]) => void) => {
    const q = query(collection(db, 'engineers'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const engineers: Engineer[] = [];
      snapshot.forEach((doc) => {
        engineers.push({ id: doc.id, ...doc.data() } as Engineer);
      });
      callback(engineers);
    });
  },

  // Add new engineer
  addEngineer: async (engineer: Omit<Engineer, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const engineerData = {
        ...engineer,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      const docRef = await addDoc(collection(db, 'engineers'), engineerData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding engineer:', error);
      throw error;
    }
  },

  // Update engineer
  updateEngineer: async (id: string, updates: Partial<Engineer>) => {
    try {
      const engineerRef = doc(db, 'engineers', id);
      await updateDoc(engineerRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating engineer:', error);
      throw error;
    }
  },

  // Delete engineer
  deleteEngineer: async (id: string) => {
    try {
      // First, delete all assignments for this engineer
      const assignmentsQuery = query(
        collection(db, 'assignments'),
        where('engineerId', '==', id)
      );
      const assignmentsSnapshot = await getDocs(assignmentsQuery);
      
      // Delete all assignments for this engineer
      const deletePromises = assignmentsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      const engineerRef = doc(db, 'engineers', id);
      await deleteDoc(engineerRef);
    } catch (error) {
      console.error('Error deleting engineer:', error);
      throw error;
    }
  },

  // Get engineer by ID
  getEngineerById: async (id: string): Promise<Engineer | null> => {
    try {
      const engineerRef = doc(db, 'engineers', id);
      const engineerDoc = await getDocs(collection(db, 'engineers'));
      const engineer = engineerDoc.docs.find(doc => doc.id === id);
      return engineer ? { id: engineer.id, ...engineer.data() } as Engineer : null;
    } catch (error) {
      console.error('Error getting engineer:', error);
      throw error;
    }
  },
};

// Assignments CRUD Operations
export const assignmentService = {
  // Get assignments for an engineer
  getAssignmentsByEngineer: async (engineerId: string): Promise<Assignment[]> => {
    try {
      const q = query(
        collection(db, 'assignments'),
        // Note: We'll need to add proper filtering once we have the assignments collection
      );
      const snapshot = await getDocs(q);
      const assignments: Assignment[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Assignment;
        if (data.engineerId === engineerId) {
          assignments.push({ id: doc.id, ...data });
        }
      });
      return assignments;
    } catch (error) {
      console.error('Error getting assignments:', error);
      throw error;
    }
  },

  // Add new assignment
  addAssignment: async (assignment: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const assignmentData = {
        ...assignment,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      const docRef = await addDoc(collection(db, 'assignments'), assignmentData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding assignment:', error);
      throw error;
    }
  },

  // Update assignment
  updateAssignment: async (id: string, updates: Partial<Assignment>) => {
    try {
      const assignmentRef = doc(db, 'assignments', id);
      await updateDoc(assignmentRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating assignment:', error);
      throw error;
    }
  },

  // Delete assignment
  deleteAssignment: async (id: string) => {
    try {
      const assignmentRef = doc(db, 'assignments', id);
      await deleteDoc(assignmentRef);
    } catch (error) {
      console.error('Error deleting assignment:', error);
      throw error;
    }
  },
}; 