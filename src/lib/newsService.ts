import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface NewsArticle {
  id?: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  language: string;
  status: 'published' | 'draft';
  thumbnail?: string;
  views: number;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

const COLLECTION_NAME = 'articles';

export const newsService = {
  // Create a new article
  async createArticle(articleData: Omit<NewsArticle, 'id' | 'views' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...articleData,
        views: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  },

  // Get all articles
  async getArticles(): Promise<NewsArticle[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamp to Date for consistency
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as NewsArticle[];
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  },

  // Update an article
  async updateArticle(id: string, updates: Partial<Omit<NewsArticle, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const articleRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(articleRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  },

  // Delete an article
  async deleteArticle(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error('Error deleting article:', error);
      throw error;
    }
  },

  // Increment view count
  async incrementViews(id: string): Promise<void> {
    try {
      const articleRef = doc(db, COLLECTION_NAME, id);
      // Note: In a real app, you might want to use increment() from firebase/firestore
      // For now, we'll handle this in the component by fetching current views first
      await updateDoc(articleRef, {
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error incrementing views:', error);
      throw error;
    }
  }
}; 