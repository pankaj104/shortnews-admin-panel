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
  Timestamp,
  where,
  getCountFromServer
} from 'firebase/firestore';
import { db } from './firebase';

export interface Category {
  id?: string;
  name: string;
  nameHindi: string;
  description: string;
  isActive: boolean;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

const COLLECTION_NAME = 'categories';
const ARTICLES_COLLECTION = 'articles';

export const categoryService = {
  // Create a new category
  async createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...categoryData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Get all categories
  async getCategories(): Promise<Category[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamp to Date for consistency
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Category[];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Update a category
  async updateCategory(id: string, updates: Partial<Omit<Category, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const categoryRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(categoryRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  // Delete a category
  async deleteCategory(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  // Get article count for a category
  async getCategoryArticleCount(categoryName: string): Promise<number> {
    try {
      const q = query(
        collection(db, ARTICLES_COLLECTION), 
        where('category', '==', categoryName)
      );
      const snapshot = await getCountFromServer(q);
      return snapshot.data().count;
    } catch (error) {
      console.error('Error getting article count:', error);
      return 0; // Return 0 if there's an error
    }
  },

  // Get article counts for all categories
  async getAllCategoriesWithCounts(): Promise<(Category & { articleCount: number })[]> {
    try {
      const categories = await this.getCategories();
      
      // Get article counts for each category
      const categoriesWithCounts = await Promise.all(
        categories.map(async (category) => {
          const articleCount = await this.getCategoryArticleCount(category.name);
          return {
            ...category,
            articleCount
          };
        })
      );

      return categoriesWithCounts;
    } catch (error) {
      console.error('Error getting categories with counts:', error);
      throw error;
    }
  },

  // Check if category can be deleted (has no articles)
  async canDeleteCategory(categoryName: string): Promise<boolean> {
    try {
      const count = await this.getCategoryArticleCount(categoryName);
      return count === 0;
    } catch (error) {
      console.error('Error checking if category can be deleted:', error);
      return false;
    }
  },

  // Seed initial categories if none exist
  async seedInitialCategories(): Promise<void> {
    try {
      const existingCategories = await this.getCategories();
      if (existingCategories.length === 0) {
        const initialCategories = [
          {
            name: "Politics",
            nameHindi: "राजनीति",
            description: "Political news and government updates",
            isActive: true
          },
          {
            name: "Sports",
            nameHindi: "खेल",
            description: "Sports news, matches, and player updates",
            isActive: true
          },
          {
            name: "Technology",
            nameHindi: "प्रौद्योगिकी",
            description: "Tech news, gadgets, and innovations",
            isActive: true
          },
          {
            name: "Entertainment",
            nameHindi: "मनोरंजन",
            description: "Movies, TV shows, celebrity news",
            isActive: true
          },
          {
            name: "Business",
            nameHindi: "व्यापार",
            description: "Business news, market updates, economy",
            isActive: true
          },
          {
            name: "Health",
            nameHindi: "स्वास्थ्य",
            description: "Health news, medical updates, wellness",
            isActive: true
          },
          {
            name: "Science",
            nameHindi: "विज्ञान",
            description: "Scientific discoveries and research",
            isActive: true
          }
        ];

        // Create all initial categories
        await Promise.all(
          initialCategories.map(category => this.createCategory(category))
        );
        
        console.log('Initial categories seeded successfully');
      }
    } catch (error) {
      console.error('Error seeding initial categories:', error);
    }
  }
}; 