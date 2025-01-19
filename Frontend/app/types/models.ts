export interface UserModel {
    ID: number;
    UserName: string;
    Email: string;
    Password?: string;
    Role: 'user' | 'admin';
    created_at?: string;
    updated_at?: string;
  }
  
  export interface RecipeModel {
    ID: number;
    RecipeName: string;
    Ingredients: string;
    Steps: string;
    Region?: string;
    Emotion?: 'Comfort' | 'Nostalgia' | 'Joy' | 'Celebration' | 'Adventure' | 'Homesickness' | 'Love';
    Status: 'pending' | 'approved' | 'rejected';
    UserID: number;
    Stories?: PersonalStoryModel[];
  }
  
  export interface ConfessionModel {
    ID: number;
    Admission: string;
    UserID: number;
    Timestamp: string;
    Status: 'pending' | 'approved' | 'rejected';
  }
  
  export interface PersonalStoryModel {
    ID: number;
    Content: string;
    UserID: number;
    RecipeID: number;
    Timestamp: string;
  }
  
  