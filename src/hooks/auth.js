import { useAuth } from '@/context/AuthContext';

export function useAuthentication() {
  const auth = useAuth();

  const isAuthenticated = () => {
    return !!auth.user;
  };

  const hasRole = (roles) => {
    if (!auth.user) return false;
    if (typeof roles === 'string') {
      return auth.user.role === roles;
    }
    return roles.includes(auth.user.role);
  };

  const isAdmin = () => {
    return hasRole('admin');
  };

  const isStaff = () => {
    return hasRole(['admin', 'staff']);
  };

  const isUser = () => {
    return hasRole(['admin', 'staff', 'user']);
  };

  return {
    ...auth,
    isAuthenticated,
    hasRole,
    isAdmin,
    isStaff,
    isUser
  };
}