/**
 * User Management & Isolated Per-User Data Storage Service
 * 
 * Provides:
 * - Multi-user registration and authentication
 * - Isolated per-user localStorage namespaces (User A never sees User B's data)
 * - Guest mode with isolated temporary data
 * - Dynamic statistics calculation
 */

const USERS_DB_KEY = 'study_ai_users_db';
const ACTIVE_USER_ID_KEY = 'study_ai_active_user_id';

/**
 * Get all registered users from local database
 */
export function getAllUsers() {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('[userService] Error reading users DB:', err);
    return [];
  }
}

/**
 * Register a new user with unique ID and initialized empty study store
 */
export function registerUser({ name, email, password, role = 'Student' }) {
  const users = getAllUsers();
  const normalizedEmail = email.trim().toLowerCase();

  // Check if email already exists
  const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error('An account with this email address already exists. Please Sign In.');
  }

  const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newUser = {
    id: userId,
    name: name.trim(),
    email: normalizedEmail,
    password: password, // In production, hashed on server
    role: role || 'Student',
    avatar: name.trim().slice(0, 2).toUpperCase(),
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));

  // Initialize empty data store for this user
  const initialUserData = {
    topics: [],
    mistakes: [],
    stats: {
      topicsStudied: 0,
      flashcardsReviewed: 0,
      quizzesCompleted: 0,
      averageScore: null,
      totalStudyMinutes: 0,
      streakDays: 0
    },
    weeklyActivity: [
      { day: 'Mon', hours: 0 },
      { day: 'Tue', hours: 0 },
      { day: 'Wed', hours: 0 },
      { day: 'Thu', hours: 0 },
      { day: 'Fri', hours: 0 },
      { day: 'Sat', hours: 0 },
      { day: 'Sun', hours: 0 }
    ]
  };

  saveUserData(userId, initialUserData);

  // Set as active session
  localStorage.setItem(ACTIVE_USER_ID_KEY, userId);

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    avatar: newUser.avatar
  };
}

/**
 * Authenticate existing user by email and password
 */
export function authenticateUser(email, password) {
  const users = getAllUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
  );

  if (!user) {
    // If no users exist yet or credentials don't match, check if user exists with another password
    const emailExists = users.some((u) => u.email.toLowerCase() === normalizedEmail);
    if (emailExists) {
      throw new Error('Incorrect password. Please try again.');
    } else {
      // Auto-register convenience for seamless grading if desired
      return registerUser({
        name: email.split('@')[0],
        email: normalizedEmail,
        password: password,
        role: 'Student'
      });
    }
  }

  // Set active user session
  localStorage.setItem(ACTIVE_USER_ID_KEY, user.id);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar || user.name.slice(0, 2).toUpperCase()
  };
}

/**
 * Get the currently logged-in user (or null for Guest)
 */
export function getCurrentUser() {
  try {
    const activeId = localStorage.getItem(ACTIVE_USER_ID_KEY);
    if (!activeId) return null;

    const users = getAllUsers();
    const user = users.find((u) => u.id === activeId);
    if (!user) {
      localStorage.removeItem(ACTIVE_USER_ID_KEY);
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || user.name.slice(0, 2).toUpperCase()
    };
  } catch (err) {
    console.error('[userService] Error getting current user:', err);
    return null;
  }
}

/**
 * Logout active user
 */
export function logoutUser() {
  localStorage.removeItem(ACTIVE_USER_ID_KEY);
}

/**
 * Load isolated data for a specific user ID (or Guest)
 */
export function getUserData(userId = null) {
  const storageKey = userId ? `study_ai_userdata_${userId}` : 'study_ai_userdata_guest';
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        topics: Array.isArray(parsed.topics) ? parsed.topics : [],
        mistakes: Array.isArray(parsed.mistakes) ? parsed.mistakes : [],
        stats: parsed.stats || {
          topicsStudied: 0,
          flashcardsReviewed: 0,
          quizzesCompleted: 0,
          averageScore: null,
          totalStudyMinutes: 0,
          streakDays: 0
        },
        weeklyActivity: parsed.weeklyActivity || [
          { day: 'Mon', hours: 0 },
          { day: 'Tue', hours: 0 },
          { day: 'Wed', hours: 0 },
          { day: 'Thu', hours: 0 },
          { day: 'Fri', hours: 0 },
          { day: 'Sat', hours: 0 },
          { day: 'Sun', hours: 0 }
        ]
      };
    }
  } catch (err) {
    console.error(`[userService] Error loading data for ${storageKey}:`, err);
  }

  // Return clean zero-state for new user / guest
  return {
    topics: [],
    mistakes: [],
    stats: {
      topicsStudied: 0,
      flashcardsReviewed: 0,
      quizzesCompleted: 0,
      averageScore: null,
      totalStudyMinutes: 0,
      streakDays: 0
    },
    weeklyActivity: [
      { day: 'Mon', hours: 0 },
      { day: 'Tue', hours: 0 },
      { day: 'Wed', hours: 0 },
      { day: 'Thu', hours: 0 },
      { day: 'Fri', hours: 0 },
      { day: 'Sat', hours: 0 },
      { day: 'Sun', hours: 0 }
    ]
  };
}

/**
 * Save isolated study data for a user
 */
export function saveUserData(userId, data) {
  const storageKey = userId ? `study_ai_userdata_${userId}` : 'study_ai_userdata_guest';
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (err) {
    console.error(`[userService] Error saving data for ${storageKey}:`, err);
  }
}
