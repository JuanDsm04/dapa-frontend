import {jwtDecode} from 'jwt-decode';

export interface TokenPayload {
    id: number;             
    userId: number;         
    name: string;
    email: string;
    role: string;
    exp: number;            
    iat?: number;           
    iss?: string;           
    sub?: string;           
    aud?: string | string[];
}

export function getUserRole(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.role;
  } catch (err) {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const now = Date.now() / 1000;
      return decoded.exp < now;
    } catch (err) {
      return true;
    }
}