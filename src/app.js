/**
 * ================================================================
 * CONTROLADOR: PlatformManager
 * ================================================================
 * Orquesta los servicios de la aplicación conectando modelos POO y persistencia.
 */
class PlatformManager {
  constructor(seedData) {
    this.db = DatabaseService.getInstance();
    this.users = this.db.loadUsers(seedData.users);
    this.currentUserId = this.db.loadCurrentUserId('admin-marina');
    this.activities = this.db.loadActivities(seedData.activities);
    this.badges = this.db.loadBadges(seedData.badges);
    this.forumPosts = this.db.loadForum(seedData.forum);
  }

  getCurrentUser() {
    return this.users.find(u => u.id === this.currentUserId) || null;
  }

  setCurrentUser(userId) {
    this.currentUserId = userId;
    this.db.saveCurrentUserId(userId);
  }

  logout() {
    this.currentUserId = null;
    this.db.saveCurrentUserId(null);
  }

  // Gestión de Usuarios con Contraseña (POO)
  registerUser({ name, email, password, city }) {
    const existing = this.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      return { success: false, error: 'Ya existe una cuenta registrada con este correo.' };
    }

    const newUser = new Volunteer({
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      city: city ? city.trim() : 'Costera',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      level: 1,
      xp: 100
    });

    this.users.unshift(newUser);
    this.setCurrentUser(newUser.id);
    this.db.saveUsers(this.users);
    return { success: true, user: newUser };
  }

  login(email, password) {
    const found = this.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) {
      return { success: false, error: 'No se encontró ninguna cuenta registrada con este correo.' };
    }
    if (!found.validatePassword(password.trim())) {
      return { success: false, error: 'Contraseña incorrecta. Por favor verifica tus credenciales.' };
    }
    this.setCurrentUser(found.id);
    return { success: true, user: found };
  }

  // Gestión de Actividades
  enrollCurrentInActivity(activityId) {
    const user = this.getCurrentUser();
    const activity = this.activities.find(a => a.id === activityId);
    if (!user || !activity) return { success: false };

    const enrolled = activity.enrollUser(user.id);
    if (enrolled) {
      user.enrollInActivity(activityId);
      user.addXP(50);

      let newlyUnlockedBadge = null;
      if (user.enrolledActivityIds.length >= 3 && !user.hasBadge('badge-8')) {
        const b8 = this.badges.find(b => b.id === 'badge-8');
        if (b8) {
          b8.awardTo(user);
          newlyUnlockedBadge = b8;
        }
      }

      this.db.saveActivities(this.activities);
      this.db.saveUsers(this.users);
      return { success: true, newlyUnlockedBadge };
    }
    return { success: false };
  }

  cancelEnrollment(activityId) {
    const user = this.getCurrentUser();
    const activity = this.activities.find(a => a.id === activityId);
    if (!user || !activity) return false;

    activity.cancelUserEnrollment(user.id);
    user.cancelActivityEnrollment(activityId);
    this.db.saveActivities(this.activities);
    this.db.saveUsers(this.users);
    return true;
  }

  createActivity(data) {
    const activity = new Activity(data);
    this.activities.unshift(activity);
    this.db.saveActivities(this.activities);
    return activity;
  }

  updateActivity(id, data) {
    const activity = this.activities.find(a => a.id === id);
    if (activity) {
      activity.updateDetails(data);
      this.db.saveActivities(this.activities);
      return activity;
    }
    return null;
  }

  deleteActivity(id) {
    const idx = this.activities.findIndex(a => a.id === id);
    if (idx !== -1) {
      this.activities.splice(idx, 1);
      this.users.forEach(u => u.cancelActivityEnrollment(id));
      this.db.saveActivities(this.activities);
      this.db.saveUsers(this.users);
      return true;
    }
    return false;
  }

  // Gestión del Foro
  createPost({ title, content, category }) {
    const user = this.getCurrentUser();
    if (!user) return null;

    const post = new ForumPost({
      author: user.name,
      avatar: user.avatar,
      role: user.role,
      category,
      title,
      content
    });

    user.addXP(25);
    let newlyUnlockedBadge = null;
    if (!user.hasBadge('badge-7')) {
      const b7 = this.badges.find(b => b.id === 'badge-7');
      if (b7) {
        b7.awardTo(user);
        newlyUnlockedBadge = b7;
      }
    }

    this.forumPosts.unshift(post);
    this.db.saveForum(this.forumPosts);
    this.db.saveUsers(this.users);
    return { post, newlyUnlockedBadge };
  }

  editPost(id, data) {
    const post = this.forumPosts.find(p => p.id === id);
    if (post) {
      post.edit(data);
      this.db.saveForum(this.forumPosts);
      return post;
    }
    return null;
  }

  deletePost(id) {
    const idx = this.forumPosts.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.forumPosts.splice(idx, 1);
      this.db.saveForum(this.forumPosts);
      return true;
    }
    return false;
  }

  togglePinPost(id) {
    const post = this.forumPosts.find(p => p.id === id);
    if (post) {
      post.togglePin();
      this.db.saveForum(this.forumPosts);
      return post.isPinned;
    }
    return false;
  }

  addComment(postId, text) {
    const user = this.getCurrentUser();
    const post = this.forumPosts.find(p => p.id === postId);
    if (!user || !post || !text.trim()) return null;

    const comment = post.addComment({
      author: user.name,
      role: user.role,
      date: 'Hace un momento',
      text: text.trim()
    });

    user.addXP(10);
    this.db.saveForum(this.forumPosts);
    this.db.saveUsers(this.users);
    return comment;
  }

  deleteComment(postId, commentIndex) {
    const post = this.forumPosts.find(p => p.id === postId);
    if (post) {
      const removed = post.removeComment(commentIndex);
      if (removed) this.db.saveForum(this.forumPosts);
      return removed;
    }
    return false;
  }

  toggleLikePost(postId) {
    const post = this.forumPosts.find(p => p.id === postId);
    if (post) {
      post.toggleLike();
      this.db.saveForum(this.forumPosts);
      return post.likes;
    }
    return 0;
  }

  // Concesión de Insignias
  grantBadge(targetUserId, badgeId) {
    const targetUser = this.users.find(u => u.id === targetUserId);
    const badge = this.badges.find(b => b.id === badgeId);
    if (!targetUser || !badge) return { success: false };

    const currentUser = this.getCurrentUser();
    const adminName = currentUser ? currentUser.name : 'Coordinación';
    const awarded = badge.awardTo(targetUser, adminName);
    if (awarded) {
      this.db.saveUsers(this.users);
      this.db.saveBadges(this.badges);
      return { success: true, badge, targetUser };
    }
    return { success: false, reason: 'Ya posee la insignia' };
  }

  revokeBadge(targetUserId, badgeId) {
    const targetUser = this.users.find(u => u.id === targetUserId);
    const badge = this.badges.find(b => b.id === badgeId);
    if (!targetUser || !badge) return false;

    const revoked = badge.revokeFrom(targetUser);
    if (revoked) {
      this.db.saveUsers(this.users);
      return true;
    }
    return false;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PlatformManager };
}
