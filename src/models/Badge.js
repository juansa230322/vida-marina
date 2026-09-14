/**
 * ================================================================
 * CLASE: Badge
 * ================================================================
 * Modela las insignias y logros de conservación marina.
 */
class Badge {
  constructor({ id, icon, name, description, requirement, earnedAt = null }) {
    this.id = id;
    this.icon = icon;
    this.name = name;
    this.description = description;
    this.requirement = requirement;
    this.earnedAt = earnedAt;
  }

  isEarnedBy(user) {
    if (!user) return false;
    return user.hasBadge(this.id);
  }

  awardTo(user, granterName = null) {
    if (!user) return false;
    const awarded = user.awardBadge(this.id);
    if (awarded) {
      this.earnedAt = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
      user.addXP(150); // Otorga +150 XP al voluntario
    }
    return awarded;
  }

  revokeFrom(user) {
    if (!user) return false;
    return user.revokeBadge(this.id);
  }

  toJSON() {
    return {
      id: this.id,
      icon: this.icon,
      name: this.name,
      description: this.description,
      requirement: this.requirement,
      earnedAt: this.earnedAt
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Badge };
}
