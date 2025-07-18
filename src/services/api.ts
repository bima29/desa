import { 
  DesaSettings, News, Gallery, Event, Organization, Service, 
  ServiceSubmission, Admin, ApiResponse, PaginatedResponse 
} from '../types';

// API Base URL - points to backend server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to make API requests
const apiRequest = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('auth_token');
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Desa Settings Service
export const getDesaSettings = async (): Promise<DesaSettings> => {
  try {
    const response = await apiRequest<ApiResponse<DesaSettings>>('/desa/settings');
    return response.data || getDefaultSettings();
  } catch (error) {
    console.error('Error fetching desa settings:', error);
    return getDefaultSettings();
  }
};

const getDefaultSettings = (): DesaSettings => ({
  id: 0,
  nama_desa: 'Desa Digital',
  slogan: 'Menuju Desa Modern dan Sejahtera',
  alamat: 'Alamat Desa',
  logo: '',
  hero_image: '',
  primary_color: '#3B82F6',
  secondary_color: '#10B981',
  deskripsi: 'Deskripsi desa',
  created_at: new Date(),
  updated_at: new Date()
});

export const updateDesaSettings = async (settings: Partial<DesaSettings>): Promise<ApiResponse<DesaSettings>> => {
  try {
    return await apiRequest<ApiResponse<DesaSettings>>('/desa/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  } catch (error) {
    console.error('Error updating desa settings:', error);
    return { success: false, message: 'Failed to update settings' };
  }
};

// News Service
export const getNews = async (page: number = 1, limit: number = 10, status: string = 'published'): Promise<PaginatedResponse<News>> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status
    });
    return await apiRequest<PaginatedResponse<News>>(`/news?${params}`);
  } catch (error) {
    console.error('Error fetching news:', error);
    return {
      data: [],
      total: 0,
      page,
      limit,
      totalPages: 0
    };
  }
};

export const getNewsBySlug = async (slug: string): Promise<News | null> => {
  try {
    return await apiRequest<News>(`/news/${slug}`);
  } catch (error) {
    console.error('Error fetching news by slug:', error);
    return null;
  }
};

export const createNews = async (newsData: Partial<News>): Promise<ApiResponse<News>> => {
  try {
    return await apiRequest<ApiResponse<News>>('/news', {
      method: 'POST',
      body: JSON.stringify(newsData),
    });
  } catch (error) {
    console.error('Error creating news:', error);
    return { success: false, message: 'Failed to create news' };
  }
};

export const updateNews = async (id: number, newsData: Partial<News>): Promise<ApiResponse<News>> => {
  try {
    return await apiRequest<ApiResponse<News>>(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(newsData),
    });
  } catch (error) {
    console.error('Error updating news:', error);
    return { success: false, message: 'Failed to update news' };
  }
};

export const deleteNews = async (id: number): Promise<ApiResponse<boolean>> => {
  try {
    return await apiRequest<ApiResponse<boolean>>(`/news/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting news:', error);
    return { success: false, message: 'Failed to delete news' };
  }
};

// Gallery Service
export const getGalleries = async (kategori?: string): Promise<Gallery[]> => {
  try {
    const params = kategori ? `?kategori=${encodeURIComponent(kategori)}` : '';
    const response = await apiRequest<ApiResponse<Gallery[]>>(`/galleries${params}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching galleries:', error);
    return [];
  }
};

export const createGallery = async (galleryData: Partial<Gallery>): Promise<ApiResponse<Gallery>> => {
  try {
    return await apiRequest<ApiResponse<Gallery>>('/galleries', {
      method: 'POST',
      body: JSON.stringify(galleryData),
    });
  } catch (error) {
    console.error('Error creating gallery:', error);
    return { success: false, message: 'Failed to create gallery item' };
  }
};

// Events Service
export const getEvents = async (): Promise<Event[]> => {
  try {
    const response = await apiRequest<ApiResponse<Event[]>>('/events');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const createEvent = async (eventData: Partial<Event>): Promise<ApiResponse<Event>> => {
  try {
    return await apiRequest<ApiResponse<Event>>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return { success: false, message: 'Failed to create event' };
  }
};

// Organization Service
export const getOrganization = async (): Promise<Organization[]> => {
  try {
    const response = await apiRequest<ApiResponse<Organization[]>>('/organization');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching organization:', error);
    return [];
  }
};

export const createOrganization = async (orgData: Partial<Organization>): Promise<ApiResponse<Organization>> => {
  try {
    return await apiRequest<ApiResponse<Organization>>('/organization', {
      method: 'POST',
      body: JSON.stringify(orgData),
    });
  } catch (error) {
    console.error('Error creating organization:', error);
    return { success: false, message: 'Failed to create organization member' };
  }
};

// Services
export const getServices = async (): Promise<Service[]> => {
  try {
    const response = await apiRequest<ApiResponse<Service[]>>('/services');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

export const createService = async (serviceData: Partial<Service>): Promise<ApiResponse<Service>> => {
  try {
    return await apiRequest<ApiResponse<Service>>('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  } catch (error) {
    console.error('Error creating service:', error);
    return { success: false, message: 'Failed to create service' };
  }
};

// Service Submissions
export const createServiceSubmission = async (submissionData: Partial<ServiceSubmission>): Promise<ApiResponse<ServiceSubmission>> => {
  try {
    return await apiRequest<ApiResponse<ServiceSubmission>>('/service-submissions', {
      method: 'POST',
      body: JSON.stringify(submissionData),
    });
  } catch (error) {
    console.error('Error creating service submission:', error);
    return { success: false, message: 'Failed to create service submission' };
  }
};

export const getServiceSubmissions = async (): Promise<ServiceSubmission[]> => {
  try {
    const response = await apiRequest<ApiResponse<ServiceSubmission[]>>('/services/submissions');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching service submissions:', error);
    return [];
  }
};

export const updateServiceSubmissionStatus = async (id: number, status: string, catatan?: string): Promise<ApiResponse<boolean>> => {
  try {
    return await apiRequest<ApiResponse<boolean>>(`/services/submissions/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, catatan }),
    });
  } catch (error) {
    console.error('Error updating submission status:', error);
    return { success: false, message: 'Failed to update submission status' };
  }
};

// Auth Service
export const login = async (email: string, password: string): Promise<ApiResponse<{ admin: Admin; token: string }>> => {
  try {
    return await apiRequest<ApiResponse<{ admin: Admin; token: string }>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  } catch (error) {
    console.error('Error during login:', error);
    return { success: false, message: 'Login failed' };
  }
};

export const createAdmin = async (adminData: Partial<Admin>): Promise<ApiResponse<Admin>> => {
  try {
    return await apiRequest<ApiResponse<Admin>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return { success: false, message: 'Failed to create admin' };
  }
};

// Statistics Service
export const getStatistics = async () => {
  try {
    const response = await apiRequest<ApiResponse<any>>('/statistics');
    return response.data || {
      news: 0,
      gallery: 0,
      events: 0,
      submissions: 0,
      documents: 0,
    };
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return {
      news: 0,
      gallery: 0,
      events: 0,
      submissions: 0,
      documents: 0,
    };
  }
};