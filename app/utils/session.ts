// Session management utilities
export const SESSION_DURATION = 10 * 60 * 60 * 1000; // 10 hours in milliseconds

export interface SessionData {
  userId: string;
  signInTime: number;
  expiresAt: number;
}

/**
 * Save session data to localStorage
 */
export const saveSessionData = (userId: string): void => {
  const sessionData: SessionData = {
    userId,
    signInTime: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION,
  };
  
  localStorage.setItem('elora_session', JSON.stringify(sessionData));
};

/**
 * Get session data from localStorage
 */
export const getSessionData = (): SessionData | null => {
  try {
    const sessionDataStr = localStorage.getItem('elora_session');
    if (!sessionDataStr) return null;
    
    const sessionData: SessionData = JSON.parse(sessionDataStr);
    return sessionData;
  } catch (error) {
    console.error('Error parsing session data:', error);
    return null;
  }
};

/**
 * Check if session is still valid
 */
export const isSessionValid = (): boolean => {
  const sessionData = getSessionData();
  if (!sessionData) return false;
  
  const now = Date.now();
  return now < sessionData.expiresAt;
};

/**
 * Get remaining time in session (in milliseconds)
 */
export const getSessionRemainingTime = (): number => {
  const sessionData = getSessionData();
  if (!sessionData) return 0;
  
  const now = Date.now();
  return Math.max(0, sessionData.expiresAt - now);
};

/**
 * Clear session data
 */
export const clearSessionData = (): void => {
  localStorage.removeItem('elora_session');
};

/**
 * Format remaining time for display
 */
export const formatSessionTime = (milliseconds: number): string => {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return 'Less than 1m';
  }
};
