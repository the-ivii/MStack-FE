import { useAuth } from '../context/AuthContext';

// Accepts a string or array of roles
export function useHasRole(roleOrRoles) {
  const { user } = useAuth();
  if (!user || !user.roles) return false;
  const roles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
  return roles.some((role) => user.roles.includes(role));
}

// Accepts a string or array of privileges
export function useHasPrivilege(privilegeOrPrivileges) {
  const { user } = useAuth();
  if (!user || !user.privileges) return false;
  const privileges = Array.isArray(privilegeOrPrivileges) ? privilegeOrPrivileges : [privilegeOrPrivileges];
  return privileges.some((priv) => user.privileges.includes(priv));
} 