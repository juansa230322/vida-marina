/**
 * ================================================================
 * CLASE BASE: User
 * ================================================================
 * Implementa Abstracción y Encapsulamiento de los datos de un usuario.
 */
class User {
  constructor({ id, name, email, password = '', city, avatar, role = 'Voluntario', level = 1, xp = 0, enrolledActivityIds = [], earnedBadgeIds = [] }) {
    this.id = id || `user-${Date.now()}`;
    this.name = name;
    this.email = email;
    this.password = password; // Encapsulamiento de contraseña
    this.city = city || 'Costera';
    this.avatar = avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
    this.role = role;
    this.level = Number(level) || 1;
    this.xp = Number(xp) || 0;
    this.enrolledActivityIds = [...enrolledActivityIds];
    this.earnedBadgeIds = [...earnedBadgeIds];
  }

  // Encapsulamiento: validación y cambio de contraseña
  validatePassword(plainPassword) {
    if (!this.password) return true;
    return this.password === plainPassword;
  }

  setPassword(newPassword) {
    if (typeof newPassword === 'string' && newPassword.length >= 4) {
      this.password = newPassword;
      return true;
    }
    return false;
  }

  // Encapsulamiento: métodos internos de modificación de experiencia y nivel
  addXP(points) {
    if (typeof points !== 'number' || points <= 0) return this.xp;
    this.xp += points;
    this.level = this.calculateLevel();
    return this.xp;
  }

  calculateLevel() {
    if (this.xp >= 2200) return 5;
    if (this.xp >= 1300) return 4;
    if (this.xp >= 700) return 3;
    if (this.xp >= 300) return 2;
    return 1;
  }

  // Encapsulamiento: inscripciones a actividades
  enrollInActivity(activityId) {
    if (!this.enrolledActivityIds.includes(activityId)) {
      this.enrolledActivityIds.push(activityId);
      return true;
    }
    return false;
  }

  cancelActivityEnrollment(activityId) {
    const idx = this.enrolledActivityIds.indexOf(activityId);
    if (idx !== -1) {
      this.enrolledActivityIds.splice(idx, 1);
      return true;
    }
    return false;
  }

  isEnrolledIn(activityId) {
    return this.enrolledActivityIds.includes(activityId);
  }

  // Encapsulamiento: insignias
  hasBadge(badgeId) {
    return this.earnedBadgeIds.includes(badgeId);
  }

  awardBadge(badgeId) {
    if (!this.hasBadge(badgeId)) {
      this.earnedBadgeIds.push(badgeId);
      return true;
    }
    return false;
  }

  revokeBadge(badgeId) {
    const idx = this.earnedBadgeIds.indexOf(badgeId);
    if (idx !== -1) {
      this.earnedBadgeIds.splice(idx, 1);
      return true;
    }
    return false;
  }

  // Polimorfismo: métodos a sobreescribir por subclases
  canModerate() {
    return false;
  }

  getRoleBadgeColor() {
    return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
  }

  getRoleTitle() {
    return this.role;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      city: this.city,
      avatar: this.avatar,
      role: this.role,
      level: this.level,
      xp: this.xp,
      enrolledActivityIds: this.enrolledActivityIds,
      earnedBadgeIds: this.earnedBadgeIds
    };
  }
}

/**
 * ================================================================
 * SUBCLASE: Volunteer (Herencia y Polimorfismo)
 * ================================================================
 * Especialización para miembros voluntarios de la comunidad marina.
 */
class Volunteer extends User {
  constructor(data) {
    super({ ...data, role: 'Voluntario' });
  }

  // Polimorfismo: permisos de usuario voluntario
  canModerate() {
    return false;
  }

  getRoleBadgeColor() {
    return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
  }

  // Método propio de Volunteer: cálculo de impacto ecológico
  calculateEcologicalImpact() {
    const count = this.enrolledActivityIds.length;
    return {
      volunteerHours: count * 4,
      collectedWasteKg: count * 12.5,
      protectedHabitats: Math.min(count, 6)
    };
  }
}

/**
 * ================================================================
 * SUBCLASE: AdminCoordinator (Herencia y Polimorfismo)
 * ================================================================
 * Especialización con capacidades de administración, moderación y concesión oficial.
 */
class AdminCoordinator extends User {
  constructor(data) {
    super({ ...data, role: 'Coordinadora' });
    this.department = data.department || 'Dirección Científica y Comunitaria';
  }

  // Polimorfismo: permisos de administración activos
  canModerate() {
    return true;
  }

  getRoleBadgeColor() {
    return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  }

  getRoleTitle() {
    return '👑 Admin Coordinadora';
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { User, Volunteer, AdminCoordinator };
}
