/**
 * ================================================================
 * SERVICIO: DatabaseService (Patrón Singleton)
 * ================================================================
 * Encapsula la persistencia en LocalStorage e hidrata las clases del modelo.
 */
class DatabaseService {
  static instance = null;

  constructor() {
    if (DatabaseService.instance) {
      return DatabaseService.instance;
    }
    this.dbKey = 'VIDA_MARINA_DATABASE_V3';
    DatabaseService.instance = this;
  }

  static getInstance() {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Métodos de hidratación de clases POO
  hydrateUser(raw) {
    if (raw instanceof User) return raw;
    if (raw.role === 'Coordinadora' || raw.role === 'admin' || raw.id === 'admin-marina') {
      return new AdminCoordinator(raw);
    }
    return new Volunteer(raw);
  }

  hydrateActivity(raw) {
    if (raw instanceof Activity) return raw;
    return new Activity(raw);
  }

  hydrateBadge(raw) {
    if (raw instanceof Badge) return raw;
    return new Badge(raw);
  }

  hydratePost(raw) {
    if (raw instanceof ForumPost) return raw;
    return new ForumPost(raw);
  }

  loadUsers(seedUsers) {
    try {
      const data = localStorage.getItem(this.dbKey + '_users');
      const list = data ? JSON.parse(data) : seedUsers;
      return list.map(u => this.hydrateUser(u));
    } catch(e) {
      return seedUsers.map(u => this.hydrateUser(u));
    }
  }

  saveUsers(users) {
    try {
      localStorage.setItem(this.dbKey + '_users', JSON.stringify(users.map(u => u.toJSON())));
    } catch(e) { console.error('Error guardando usuarios:', e); }
  }

  // La sesión inicia como null (visitante) a menos que se haya autenticado explícitamente en la sesión actual
  loadCurrentUserId(defaultId = null) {
    try {
      return sessionStorage.getItem(this.dbKey + '_currentUser') || defaultId;
    } catch(e) { return defaultId; }
  }

  saveCurrentUserId(id) {
    try {
      if (id) {
        sessionStorage.setItem(this.dbKey + '_currentUser', id);
      } else {
        sessionStorage.removeItem(this.dbKey + '_currentUser');
      }
      localStorage.removeItem(this.dbKey + '_currentUser');
      localStorage.removeItem('VIDA_MARINA_DATABASE_V2_currentUser');
    } catch(e) {}
  }

  loadActivities(seedActivities) {
    try {
      const data = localStorage.getItem(this.dbKey + '_activities');
      const list = data ? JSON.parse(data) : seedActivities;
      return list.map(a => this.hydrateActivity(a));
    } catch(e) {
      return seedActivities.map(a => this.hydrateActivity(a));
    }
  }

  saveActivities(activities) {
    try {
      localStorage.setItem(this.dbKey + '_activities', JSON.stringify(activities.map(a => a.toJSON())));
    } catch(e) {}
  }

  loadBadges(seedBadges) {
    try {
      const data = localStorage.getItem(this.dbKey + '_badges');
      const list = data ? JSON.parse(data) : seedBadges;
      return list.map(b => this.hydrateBadge(b));
    } catch(e) {
      return seedBadges.map(b => this.hydrateBadge(b));
    }
  }

  saveBadges(badges) {
    try {
      localStorage.setItem(this.dbKey + '_badges', JSON.stringify(badges.map(b => b.toJSON())));
    } catch(e) {}
  }

  loadForum(seedForum) {
    try {
      const data = localStorage.getItem(this.dbKey + '_forum');
      const list = data ? JSON.parse(data) : seedForum;
      return list.map(p => this.hydratePost(p));
    } catch(e) {
      return seedForum.map(p => this.hydratePost(p));
    }
  }

  saveForum(posts) {
    try {
      localStorage.setItem(this.dbKey + '_forum', JSON.stringify(posts.map(p => p.toJSON())));
    } catch(e) {}
  }

  resetDatabase() {
    try {
      localStorage.removeItem(this.dbKey + '_users');
      localStorage.removeItem(this.dbKey + '_activities');
      localStorage.removeItem(this.dbKey + '_badges');
      localStorage.removeItem(this.dbKey + '_forum');
      sessionStorage.removeItem(this.dbKey + '_currentUser');
      localStorage.removeItem('VIDA_MARINA_DATABASE_V2_users');
      localStorage.removeItem('VIDA_MARINA_DATABASE_V2_activities');
      localStorage.removeItem('VIDA_MARINA_DATABASE_V2_badges');
      localStorage.removeItem('VIDA_MARINA_DATABASE_V2_forum');
      localStorage.removeItem('VIDA_MARINA_DATABASE_V2_currentUser');
    } catch(e) {}
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DatabaseService };
}
