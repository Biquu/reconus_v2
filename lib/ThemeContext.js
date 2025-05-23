'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(true); // Default olarak dark mod açık

  // Sayfa yüklendiğinde localStorage'dan tema tercihini al
  useEffect(() => {
    // localStorage'da kayıtlı tema var mı kontrol et
    const savedTheme = localStorage.getItem('theme');
    
    // Sistem tercihlerini kontrol et
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Eğer localStorage'da 'light' açıkça belirtilmişse, light modu kullan
    if (savedTheme === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    } 
    // Aksi halde (localStorage'da 'dark' varsa veya hiç kayıt yoksa ve sistem dark mod tercih ediyorsa)
    // dark modu kullan - Bu uygulama için dark mod default olarak ayarlanacak
    else {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Tema değiştiğinde localStorage'a kaydet ve DOM'u güncelle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      
      // CSS değişkenlerini manuel olarak eklemek için
      document.documentElement.style.setProperty('--background', '#121212');
      document.documentElement.style.setProperty('--foreground', '#FFFFFF');
      document.documentElement.style.setProperty('--surface', '#1E1E1E');
      document.documentElement.style.setProperty('--surface-hover', '#2A2A2A');
      document.documentElement.style.setProperty('--border', '#333333');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      
      // Light mod için CSS değişkenlerini manuel olarak ayarla
      document.documentElement.style.setProperty('--background', '#FFFFFF');
      document.documentElement.style.setProperty('--foreground', '#121212');
      document.documentElement.style.setProperty('--surface', '#F5F5F5');
      document.documentElement.style.setProperty('--surface-hover', '#EEEEEE');
      document.documentElement.style.setProperty('--border', '#E0E0E0');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
} 