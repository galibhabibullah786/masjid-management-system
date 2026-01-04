// ============================================
// PERMISSION UTILITIES (Client-safe)
// ============================================

export const UserRole = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  PHOTOGRAPHER: 'photographer',
} as const;

export type Permission = 
  | 'manage_users'
  | 'manage_contributions'
  | 'manage_committees'
  | 'manage_gallery'
  | 'manage_land_donors'
  | 'manage_settings'
  | 'view_activity'
  | 'upload_images';

const rolePermissions: Record<string, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    'manage_users',
    'manage_contributions',
    'manage_committees',
    'manage_gallery',
    'manage_land_donors',
    'manage_settings',
    'view_activity',
    'upload_images',
  ],
  [UserRole.ADMIN]: [
    'manage_gallery',
    'view_activity',
    'upload_images',
  ],
  [UserRole.PHOTOGRAPHER]: [
    'manage_gallery',
    'upload_images',
  ],
};

export function hasPermission(role: string, permission: Permission): boolean {
  const permissions = rolePermissions[role] || [];
  return permissions.includes(permission);
}

export function getPermissions(role: string): Permission[] {
  return rolePermissions[role] || [];
}
