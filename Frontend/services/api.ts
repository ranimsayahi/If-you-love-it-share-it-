
// import axios, { AxiosError } from 'axios';
// import { Recipe, Confession, Story, SearchParams } from './types';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add a request interceptor to include the JWT token in requests
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers['Authorization'] = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

// // Response interceptor for global error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error: AxiosError) => {
//     // Safely check the response data
//     let message = 'An unknown error occurred.';
//     if (error.response && error.response.data) {
//       message = (error.response.data as { message?: string }).message || message;
//     }

//     // Handle specific status codes or log the general error
//     switch (error.response?.status) {
//       case 401:
//         console.error('Unauthorized: Please log in again.');
//         break;
//       case 500:
//         console.error('Server error: Something went wrong.');
//         break;
//       default:
//         console.error(`Error: ${message}`);
//     }

//     return Promise.reject(error);
//   }
// );

// // Authentication API calls
// export const login = async (email: string, password: string) => {
//   const response = await api.post('/login', { Email: email, Password: password });
//   return response.data;
// };

// export const register = async (username: string, email: string, password: string) => {
//   const response = await api.post('/register', { UserName: username, Email: email, Password: password });
//   return response.data;  // Ensure this returns the data you expect
// };

// // Recipe API calls
// export const getRecipes = async (): Promise<Recipe[]> => {
//   const response = await api.get('/recipe');
//   return response.data;
// };

// export const getRecipe = async (id: number): Promise<Recipe> => {
//   const response = await api.get(`/recipe/${id}`);
//   return response.data;
// };

// export const createRecipe = async (recipeData: Recipe): Promise<Recipe> => {
//   const response = await api.post('/recipe', recipeData);
//   return response.data;
// };

// // Confession API calls
// export const getConfessions = async (): Promise<Confession[]> => {
//   const response = await api.get('/confession');
//   return response.data;
// };

// export const getConfession = async (id: number): Promise<Confession | null> => {
//   try {
//     const response = await api.get(`/confession/${id}`);
//     if (response.data) {
//       return response.data;
//     } else {
//       return null;  // Return null if no data is found
//     }
//   } catch (error) {
//     console.error('Error fetching confession:', error);
//     return null;  // Return null in case of an error
//   }
// };

// export const createConfession = async (confessionData: Confession): Promise<Confession> => {
//   const response = await api.post('/confession', confessionData);
//   return response.data;
// };

// // Story API calls
// export const getStories = async (): Promise<Story[]> => {
//   const response = await api.get('/personalstory');
//   return response.data;
// };

// export const createStory = async (storyData: Story): Promise<Story> => {
//   const response = await api.post('/personalstory', storyData);
//   return response.data;
// };

// // Search Recipes API call
// export const searchRecipes = async (params: SearchParams): Promise<Recipe[]> => {
//   const response = await api.get('/recipe/search', { params });
//   return response.data;
// };

// export default api;

import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token in requests
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error: AxiosError) => {
  return Promise.reject(error);
});

export const login = async (email: string, password: string) => {
  const response = await api.post('/login', { Email: email, Password: password });
  return response.data;
};

export const register = async (username: string, email: string, password: string) => {
  const response = await api.post('/register', { UserName: username, Email: email, Password: password });
  return response.data;
};

export const getRecipes = async () => {
  const response = await api.get('/recipe');
  return response.data;
};

export const getRecipe = async (id: number) => {
  const response = await api.get(`/recipe/${id}`);
  return response.data;
};

export const createRecipe = async (recipeData: Record<string, unknown>) => {
  const response = await api.post('/recipe', recipeData);
  return response.data;
};

export const getConfessions = async () => {
  const response = await api.get('/confession');
  return response.data;
};

export const createConfession = async (confessionData: Record<string, unknown>) => {
  const response = await api.post('/confession', confessionData);
  return response.data;
};

export const getStories = async () => {
  const response = await api.get('/personalstory');
  return response.data;
};

export const createStory = async (storyData: Record<string, unknown>) => {
  const response = await api.post('/personalstory', storyData);
  return response.data;
};

export const searchRecipes = async (params: Record<string, unknown>) => {
  const response = await api.get('/recipe/search', { params });
  return response.data;
};

export default api;

