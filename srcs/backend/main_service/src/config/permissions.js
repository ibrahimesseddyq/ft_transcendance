const {UserRole} = require('../../generated/prisma');

const ROLE_PERMISSIONS = {
	[UserRole.candidate]:[
    'job:read',
    'application:create',
    'application:read:own',
    'application:withdraw:own',
    'profile:read:own',
    'profile:update:own',
    'profile:delete:own',
    'notification:read:own',
    'notification:mark-read:own',
    'interview:read:own',
    'interview:join:own',
	],
	[UserRole.recruiter]:[
	// Jobs (full control)
    'job:create',
    'job:read',
    'job:update',
    'job:delete',
    'job:close',
    'job:reopen',
    
    // Job Phases
    'job-phase:create',
    'job-phase:read',
    'job-phase:update',
    'job-phase:delete',
    
    // Applications (full control)
    'application:read',
    'application:update',
    'application:delete',
    'application:advance-phase',
    'application:reject',
    'application:accept',
    
    // Interviews (full control)
    'interview:create',
    'interview:read',
    'interview:update',
    'interview:delete',
    'interview:schedule',
    'interview:reschedule',
    'interview:cancel',
    'interview:add-participant',
    'interview:remove-participant',
    
    // Offers (full control)
    'offer:create',
    'offer:read',
    'offer:update',
    'offer:delete',
    'offer:send',
    'offer:withdraw',
    
    // Candidate Profiles (read-only)
    'candidate:read',
    'candidate:export',
    
    // Notifications (create for candidates)
    'notification:create',
    'notification:read',
    'notification:send',
    
    // Analytics/Reports
    'analytics:view',
    'report:generate',
    'report:export',
	],
}

const getPermissionsByRole = (role) => {
	if (!role)
			return [];
	return ROLE_PERMISSIONS[role] || [];
};

const hasPermission = (role, permission) => {
	if (role === UserRole.admin)
		return true;
	const permissions = ROLE_PERMISSIONS[role] || [];
	return permissions.includes(permission);
}

const canAccessResource = (userRole, userId, resourceUserId, permission) => {
	if (userRole === UserRole.admin)
		return true;
	if (userRole === UserRole.recruiter && !permission.startsWith('user:'))
		return true;
	if (permission.endsWith(':own')  && userId === resourceUserId)
		return hasPermission(userRole, permission);
	return hasPermission(userRole,permission);
}

const PERMISSION_CATEGORIES = {
  JOB: ['job:create', 'job:read', 'job:update', 'job:delete', 'job:close', 'job:reopen', 'job:archive', 'job:restore'],
  APPLICATION: ['application:create', 'application:read', 'application: read:own', 'application:update', 'application:delete', 'application:withdraw:own', 'application:advance-phase', 'application:reject', 'application:accept'],
  INTERVIEW: ['interview:create', 'interview:read', 'interview:read:own', 'interview:update', 'interview: delete', 'interview:schedule', 'interview:cancel', 'interview:join:own'],
  OFFER:  ['offer:create', 'offer:read', 'offer:update', 'offer:delete', 'offer:send', 'offer:withdraw'],
  USER: ['user:create', 'user:read', 'user:update', 'user:delete', 'user:change-role', 'user:suspend', 'user:activate'],
  PROFILE: ['profile:read', 'profile:read:own', 'profile:update', 'profile:update:own', 'profile:delete', 'profile:delete:own'],
  NOTIFICATION: ['notification:create', 'notification:read', 'notification:read:own', 'notification:update', 'notification:delete', 'notification:send', 'notification:broadcast'],
  ANALYTICS: ['analytics:view', 'report:generate', 'report:export'],
  SYSTEM:  ['system:settings:read', 'system:settings:update', 'system:backup', 'system:restore', 'audit:read', 'audit:export'],
};

module.exports = {
	ROLE_PERMISSIONS,
	PERMISSION_CATEGORIES,
	getPermissionsByRole,
	hasPermission,
	canAccessResource,
}