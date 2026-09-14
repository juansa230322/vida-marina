/**
 * ================================================================
 * CLASE: Activity
 * ================================================================
 * Modela las jornadas ecológicas, limpiezas y eventos oficiales.
 */
class Activity {
  constructor({ id, name, description, image, date, time, location, responsible, type = 'Conservación', totalSpots = 25, enrolledCount = 0, enrolledUserIds = [], requirements = [] }) {
    this.id = id || `act-${Date.now()}`;
    this.name = name;
    this.description = description;
    this.image = image || '';
    this.date = date;
    this.time = time;
    this.location = location;
    this.responsible = responsible;
    this.type = type;
    this.totalSpots = Number(totalSpots) || 25;
    this.enrolledCount = Number(enrolledCount) || (enrolledUserIds ? enrolledUserIds.length : 0);
    this.enrolledUserIds = [...(enrolledUserIds || [])];
    this.requirements = Array.isArray(requirements) ? requirements : (requirements ? requirements.split(',').map(r => r.trim()) : []);
  }

  hasAvailableSpots() {
    return this.getAvailableSpots() > 0;
  }

  getAvailableSpots() {
    return Math.max(0, this.totalSpots - this.enrolledCount);
  }

  getRemainingSpots() {
    return this.getAvailableSpots();
  }

  isUserEnrolled(userId) {
    return this.enrolledUserIds.includes(userId);
  }

  enrollUser(userId) {
    if (this.isUserEnrolled(userId)) return false;
    if (!this.hasAvailableSpots()) return false;

    this.enrolledUserIds.push(userId);
    this.enrolledCount = this.enrolledUserIds.length;
    return true;
  }

  cancelUserEnrollment(userId) {
    const idx = this.enrolledUserIds.indexOf(userId);
    if (idx !== -1) {
      this.enrolledUserIds.splice(idx, 1);
      this.enrolledCount = this.enrolledUserIds.length;
      return true;
    }
    return false;
  }

  updateDetails({ name, description, image, date, time, location, responsible, type, totalSpots, requirements }) {
    if (name) this.name = name;
    if (description) this.description = description;
    if (image) this.image = image;
    if (date) this.date = date;
    if (time) this.time = time;
    if (location) this.location = location;
    if (responsible) this.responsible = responsible;
    if (type) this.type = type;
    if (totalSpots !== undefined) this.totalSpots = Number(totalSpots);
    if (requirements) {
      this.requirements = Array.isArray(requirements) ? requirements : requirements.split(',').map(r => r.trim());
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      image: this.image,
      date: this.date,
      time: this.time,
      location: this.location,
      responsible: this.responsible,
      type: this.type,
      totalSpots: this.totalSpots,
      enrolledCount: this.enrolledCount,
      enrolledUserIds: this.enrolledUserIds,
      requirements: this.requirements
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Activity };
}
