// Authentication Service using Local Storage

const AUTH_KEY = 'ani2table_users';
const SESSION_KEY = 'ani2table_session';

// Initialize storage if it doesn't exist
const initializeStorage = () => {
  if (!localStorage.getItem(AUTH_KEY)) {
    localStorage.setItem(AUTH_KEY, JSON.stringify([]));
  }
};

// Initialize with demo accounts for testing
export const initializeDemoAccounts = () => {
  const users = getUsers();
  
  // Check if demo accounts already exist
  const demoExists = users.some(u => u.username === 'consumer' || u.username === 'farmer' || u.username === 'admin');
  
  if (!demoExists) {
    const demoAccounts = [
      {
        id: 'demo-1',
        username: 'consumer',
        password: 'password',
        email: 'consumer@ani2table.com',
        firstName: 'Maria',
        lastName: 'Santos',
        middleName: 'Cruz',
        birthday: '1995-05-15',
        gender: 'female',
        contactNumber: '09123456789',
        userType: 'consumer',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'demo-2',
        username: 'farmer',
        password: 'password',
        email: 'farmer@ani2table.com',
        firstName: 'Pedro',
        lastName: 'Garcia',
        middleName: 'Reyes',
        birthday: '1980-03-20',
        gender: 'male',
        contactNumber: '09187654321',
        userType: 'farmer',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'demo-3',
        username: 'admin',
        password: 'password',
        email: 'admin@ani2table.com',
        firstName: 'Admin',
        lastName: 'User',
        middleName: '',
        birthday: '1985-01-01',
        gender: 'male',
        contactNumber: '09111111111',
        userType: 'admin',
        createdAt: new Date().toISOString(),
      },
    ];
    
    saveUsers([...users, ...demoAccounts]);
  }
};

// Get all users
const getUsers = () => {
  initializeStorage();
  const users = localStorage.getItem(AUTH_KEY);
  return JSON.parse(users) || [];
};

// Save users
const saveUsers = (users) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(users));
};

// Register new user
export const register = (userData) => {
  const users = getUsers();
  
  // Check if username already exists
  const existingUser = users.find(user => user.username === userData.username);
  if (existingUser) {
    return { success: false, error: 'Username already exists' };
  }
  
  // Check if email already exists
  const existingEmail = users.find(user => user.email === userData.email);
  if (existingEmail) {
    return { success: false, error: 'Email already registered' };
  }
  
  // Create new user
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  saveUsers(users);
  
  return { success: true, user: newUser };
};

// Login user
export const login = (username, password) => {
  const users = getUsers();
  
  const user = users.find(
    u => u.username === username && u.password === password
  );
  
  if (!user) {
    return { success: false, error: 'Invalid username or password' };
  }
  
  // Create session (don't store password in session)
  const session = {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    userType: user.userType,
    loginTime: new Date().toISOString(),
  };
  
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  
  return { success: true, user: session };
};

// Logout user
export const logout = () => {
  localStorage.removeItem(SESSION_KEY);
};

// Get current session
export const getCurrentUser = () => {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

// Get dashboard route based on user type
export const getDashboardRoute = (userType) => {
  switch (userType) {
    case 'admin':
      return '/admin';
    case 'farmer':
      return '/farmer';
    case 'consumer':
    default:
      return '/consumer';
  }
};
