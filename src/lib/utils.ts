import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Cookies from "js-cookie";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        return JSON.parse(token);
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }
  return null;
}


export function getRole(): string | null {
  if (typeof window !== 'undefined') {
    const role = localStorage.getItem('role');
    if (role) {
      try {
        return JSON.parse(role);
      } catch (error) {
        console.error('Error parsing userType:', error);
      }
    }
  }
  return null;
}


export function removeToken(): string | null {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('data');
    localStorage.removeItem('role');

    Cookies.remove('accessToken')
    Cookies.remove('data');
    Cookies.remove('role');

  }
  return null;
}
