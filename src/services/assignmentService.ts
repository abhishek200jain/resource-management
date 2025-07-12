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
  where,
} from 'firebase/firestore';
import { db } from '../config/firebase.config';

export interface Assignment {
  id?: string;
  engineerId: string;
  engineerName: string;
  projectId: string;
  projectName: string;
  role: string;
  startDate: string;
  endDate: string;
  allocation: number; // percentage
  status: 'Active' | 'Completed' | 'On Hold';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Assignments CRUD Operations
export const assignmentService = {
  // Get all assignments with real-time updates
  subscribeToAssignments: (callback: (assignments: Assignment[]) => void) => {
    const q = query(collection(db, 'assignments'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const assignments: Assignment[] = [];
      snapshot.forEach((doc) => {
        assignments.push({ id: doc.id, ...doc.data() } as Assignment);
      });
      callback(assignments);
    });
  },

  // Get assignments by engineer ID
  subscribeToAssignmentsByEngineer: (engineerId: string, callback: (assignments: Assignment[]) => void) => {
    const q = query(
      collection(db, 'assignments'),
      where('engineerId', '==', engineerId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const assignments: Assignment[] = [];
      snapshot.forEach((doc) => {
        assignments.push({ id: doc.id, ...doc.data() } as Assignment);
      });
      callback(assignments);
    });
  },

  // Get assignments by project ID
  subscribeToAssignmentsByProject: (projectId: string, callback: (assignments: Assignment[]) => void) => {
    const q = query(
      collection(db, 'assignments'),
      where('projectId', '==', projectId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const assignments: Assignment[] = [];
      snapshot.forEach((doc) => {
        assignments.push({ id: doc.id, ...doc.data() } as Assignment);
      });
      callback(assignments);
    });
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

  // Get assignment by ID
  getAssignmentById: async (id: string): Promise<Assignment | null> => {
    try {
      const assignmentRef = doc(db, 'assignments', id);
      const assignmentDoc = await getDocs(collection(db, 'assignments'));
      const assignment = assignmentDoc.docs.find(doc => doc.id === id);
      return assignment ? { id: assignment.id, ...assignment.data() } as Assignment : null;
    } catch (error) {
      console.error('Error getting assignment:', error);
      throw error;
    }
  },

  // Get active assignments count for an engineer
  getActiveAssignmentsCountByEngineer: async (engineerId: string): Promise<number> => {
    try {
      const q = query(
        collection(db, 'assignments'),
        where('engineerId', '==', engineerId),
        where('status', '==', 'Active')
      );
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting active assignments count:', error);
      throw error;
    }
  },

  // Get active assignments count for a project
  getActiveAssignmentsCountByProject: async (projectId: string): Promise<number> => {
    try {
      const q = query(
        collection(db, 'assignments'),
        where('projectId', '==', projectId),
        where('status', '==', 'Active')
      );
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting active assignments count:', error);
      throw error;
    }
  },
}; 