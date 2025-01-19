// types.ts

export interface Recipe {
    id: number;
    name: string;
    description: string;
    ingredients: string[];
    instructions: string;
  }
  
  export interface Confession {
    Timestamp: string | number | Date;
    id: number;
    Admission: string;
  }
  
  export interface Story {
    id: number;
    content: string;
    author: string;
  }
  
  export interface SearchParams {
    query: string;
    type: string;
  }
  