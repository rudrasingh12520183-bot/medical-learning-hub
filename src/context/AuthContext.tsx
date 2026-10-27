import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { dbService } from '../services/db';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  login: (email: string) => boolean;
  register: (name: string, email: string, role: UserRole, college?: string) => User;
  switchUserRole: (role: UserRole) => void;
  logout: () => void;
  allUsers: User[];
  refreshUsers: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const refreshUsers = () => {
    const users = dbService.getUsers();
    setAllUsers(users);
    const activeId = dbService.getActiveUserId();
    const active = users.find(u => u.id === activeId) || users[0] || null;
    setCurrentUser(active);
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const login = (email: string): boolean => {
    const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      dbService.setActiveUserId(user.id);
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, role: UserRole, college?: string): User => {
    const newUser = dbService.registerUser(name, email, role, college);
    refreshUsers();
    return newUser;
  };

  const switchUserRole = (targetRole: UserRole) => {
    const matching = allUsers.find(u => u.role === targetRole);
    if (matching) {
      dbService.setActiveUserId(matching.id);
      setCurrentUser(matching);
    } else {
      // Create quick user if not found
      const created = dbService.registerUser(
        targetRole === 'admin' ? 'Faculty Admin' : 'Medical Scholar',
        targetRole === 'admin' ? 'faculty.admin@medicalhub.edu' : 'scholar@medicalhub.edu',
        targetRole
      );
      refreshUsers();
      setCurrentUser(created);
    }
  };

  const logout = () => {
    // For demo purposes, we can reset to default student
    const defaultUser = allUsers.find(u => u.role === 'student') || allUsers[0];
    if (defaultUser) {
      dbService.setActiveUserId(defaultUser.id);
      setCurrentUser(defaultUser);
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        login,
        register,
        switchUserRole,
        logout,
        allUsers,
        refreshUsers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
