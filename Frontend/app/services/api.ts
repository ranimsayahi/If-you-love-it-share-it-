import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error: AxiosError) => {
  return Promise.reject(error);
});

// User related endpoints
export const login = async (email: string, password: string) => {
  const response = await api.post('/login', { Email: email, Password: password });
  return response.data;
};

export const register = async (username: string, email: string, password: string) => {
  const response = await api.post('/register', { UserName: username, Email: email, Password: password });
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/logout');
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

export const updateUserProfile = async (userData: Partial<UserModel>) => {
  const response = await api.put('/profile', userData);
  return response.data;
};

export const deleteUserProfile = async () => {
  const response = await api.delete('/profile');
  return response.data;
};

// Recipe related endpoints
export const getRecipes = async () => {
  const response = await api.get('/recipe');
  return response.data;
};

export const getRecipe = async (id: number) => {
  const response = await api.get(`/recipe/${id}`);
  return response.data;
};

export const createRecipe = async (recipeData: Partial<RecipeModel>) => {
  const response = await api.post('/recipe', recipeData);
  return response.data;
};

export const updateRecipe = async (id: number, recipeData: Partial<RecipeModel>) => {
  const response = await api.put(`/recipe/${id}`, recipeData);
  return response.data;
};

export const deleteRecipe = async (id: number) => {
  const response = await api.delete(`/recipe/${id}`);
  return response.data;
};

export const searchRecipes = async (params: Record<string, string>) => {
  const response = await api.get('/recipe/search', { params });
  return response.data;
};

export const approveRecipe = async (id: number) => {
  const response = await api.put(`/recipe/${id}/approve`);
  return response.data;
};

export const rejectRecipe = async (id: number) => {
  const response = await api.put(`/recipe/${id}/reject`);
  return response.data;
};

// Confession related endpoints
export const getConfessions = async () => {
  const response = await api.get('/confession');
  return response.data;
};

export const getConfession = async (id: number) => {
  const response = await api.get(`/confession/${id}`);
  return response.data;
};

export const createConfession = async (confessionData: Partial<ConfessionModel>) => {
  const response = await api.post('/confession', confessionData);
  return response.data;
};

export const updateConfession = async (id: number, confessionData: Partial<ConfessionModel>) => {
  const response = await api.put(`/confession/${id}`, confessionData);
  return response.data;
};

export const deleteConfession = async (id: number) => {
  const response = await api.delete(`/confession/${id}`);
  return response.data;
};

export const searchConfessions = async (params: Record<string, string>) => {
  const response = await api.get('/confession/search', { params });
  return response.data;
};

export const approveConfession = async (id: number) => {
  const response = await api.put(`/confession/${id}/approve`);
  return response.data;
};

export const rejectConfession = async (id: number) => {
  const response = await api.put(`/confession/${id}/reject`);
  return response.data;
};

// Personal Story related endpoints
export const getStories = async () => {
  const response = await api.get('/personalstory');
  return response.data;
};

export const getStory = async (id: number) => {
  const response = await api.get(`/personalstory/${id}`);
  return response.data;
};

export const createStory = async (storyData: Partial<PersonalStoryModel>) => {
  const response = await api.post('/personalstory', storyData);
  return response.data;
};

export const updateStory = async (id: number, storyData: Partial<PersonalStoryModel>) => {
  const response = await api.put(`/personalstory/${id}`, storyData);
  return response.data;
};

export const deleteStory = async (id: number) => {
  const response = await api.delete(`/personalstory/${id}`);
  return response.data;
};

export const searchStories = async (params: Record<string, string>) => {
  const response = await api.get('/personalstory/search', { params });
  return response.data;
};

export default api;

