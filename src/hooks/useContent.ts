import { useState, useEffect } from 'react';
import { getDesaSettings } from '../services/api';

// Mock content data - replace with actual API calls when content management is implemented
const mockContent = {
  homepage: {
    hero: {
      hero_title: 'Selamat Datang di {village_name}',
      hero_subtitle: '{village_slogan}',
      hero_description: 'Website resmi desa yang menyediakan informasi terkini dan layanan publik untuk masyarakat'
    },
    about_preview: {
      about_preview_title: 'Tentang {village_name}',
      about_preview_description: 'Desa modern yang mengutamakan pelayanan publik yang prima dan transparansi dalam pengelolaan pemerintahan.',
      about_preview_button: 'Selengkapnya'
    },
    news_preview: {
      news_preview_title: 'Berita Terkini',
      news_preview_subtitle: 'Informasi terbaru dari desa',
      news_read_more: 'Baca Selengkapnya',
      news_view_all: 'Lihat Semua Berita'
    },
    events_preview: {
      events_preview_title: 'Agenda Mendatang',
      events_preview_subtitle: 'Kegiatan dan acara yang akan datang',
      events_view_all: 'Lihat Semua Agenda'
    }
  },
  global: {
    navigation: {
      nav_home: 'Beranda',
      nav_about: 'Tentang',
      nav_news: 'Berita',
      nav_gallery: 'Galeri',
      nav_events: 'Agenda',
      nav_organization: 'Struktur',
      nav_services: 'Layanan',
      nav_contact: 'Kontak'
    },
    footer: {
      footer_quick_links_title: 'Tautan Cepat',
      footer_contact_title: 'Kontak',
      footer_copyright: '© {year} {village_name}. All rights reserved.'
    }
  }
};

type ContentByPage = typeof mockContent;

// Helper function to replace placeholders in content
const processContentValue = (value: string, replacements: Record<string, string> = {}): string => {
  let processedValue = value;
  
  Object.entries(replacements).forEach(([placeholder, replacement]) => {
    processedValue = processedValue.replace(new RegExp(placeholder, 'g'), replacement);
  });
  
  return processedValue;
};

// Custom hook for managing website content
export const useContent = (page?: string) => {
  const [content, setContent] = useState<ContentByPage>({});
  const [pageContent, setPageContent] = useState<ContentByPage[string]>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get village settings for replacements
        const settings = await getDesaSettings();
        const replacements = {
          '{village_name}': settings.nama_desa,
          '{village_slogan}': settings.slogan,
          '{year}': new Date().getFullYear().toString()
        };

        // Process mock content with replacements
        const processedData: ContentByPage = {};
        Object.entries(mockContent).forEach(([pageName, pageData]) => {
          processedData[pageName] = {};
          Object.entries(pageData).forEach(([section, sectionContent]) => {
            processedData[pageName][section] = {};
            Object.entries(sectionContent).forEach(([key, value]) => {
              processedData[pageName][section][key] = processContentValue(value, replacements);
            });
          });
        });
        
        setContent(processedData);
        
        if (page) {
          setPageContent(processedData[page] || {});
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [page]);

  // Helper function to get content value
  const getContent = (section: string, key: string, defaultValue: string = ''): string => {
    if (page) {
      return pageContent[section]?.[key] || defaultValue;
    }
    return defaultValue;
  };

  // Helper function to get global content
  const getGlobalContent = (section: string, key: string, defaultValue: string = ''): string => {
    return content.global?.[section]?.[key] || defaultValue;
  };

  return {
    content,
    pageContent,
    loading,
    error,
    getContent,
    getGlobalContent
  };
};

// Hook for global content (navigation, footer, buttons, messages)
export const useGlobalContent = () => {
  const { content, loading, error, getGlobalContent } = useContent();

  return {
    content: content.global || {},
    loading,
    error,
    getContent: getGlobalContent,
    // Specific getters for common global content
    getNavigation: (key: string, defaultValue: string = '') => 
      getGlobalContent('navigation', key, defaultValue),
    getFooter: (key: string, defaultValue: string = '') => 
      getGlobalContent('footer', key, defaultValue),
    getButton: (key: string, defaultValue: string = '') => 
      getGlobalContent('buttons', key, defaultValue),
    getMessage: (key: string, defaultValue: string = '') => 
      getGlobalContent('messages', key, defaultValue)
  };
};