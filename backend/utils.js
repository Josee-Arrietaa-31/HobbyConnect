const LEVELS = ["principiante", "intermedio", "avanzado"];

function isValidLevel(level) {
  return LEVELS.includes(level);
}

// El admin global o el creador del grupo pueden gestionarlo
function canManageGroup(user, group) {
  if (!user || !group) return false;
  return user.role === "admin" || user.id === group.created_by;
}

module.exports = { LEVELS, isValidLevel, canManageGroup };
