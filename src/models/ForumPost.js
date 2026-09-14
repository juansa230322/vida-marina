/**
 * ================================================================
 * CLASE: ForumComment
 * ================================================================
 * Modela un comentario individual dentro de una publicación.
 */
class ForumComment {
  constructor({ id, author, role = 'Voluntario', date = 'Hace un momento', text }) {
    this.id = id || `comm-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    this.author = author;
    this.role = role;
    this.date = date;
    this.text = text;
  }

  toJSON() {
    return {
      id: this.id,
      author: this.author,
      role: this.role,
      date: this.date,
      text: this.text
    };
  }
}

/**
 * ================================================================
 * CLASE: ForumPost
 * ================================================================
 * Modela una publicación comunitaria con comentarios, me gusta y moderación.
 */
class ForumPost {
  constructor({ id, author, avatar, role, category = 'Conservación', date = 'Hace un momento', title, content, image = null, likes = 0, isPinned = false, isEdited = false, comments = [] }) {
    this.id = id || `post-${Date.now()}`;
    this.author = author;
    this.avatar = avatar;
    this.role = role;
    this.category = category;
    this.date = date;
    this.title = title;
    this.content = content;
    this.image = image;
    this.likes = Number(likes) || 0;
    this.isPinned = Boolean(isPinned);
    this.isEdited = Boolean(isEdited);
    this.comments = comments.map(c => c instanceof ForumComment ? c : new ForumComment(c));
  }

  addComment(commentData) {
    const comment = commentData instanceof ForumComment ? commentData : new ForumComment(commentData);
    this.comments.push(comment);
    return comment;
  }

  removeComment(index) {
    if (index >= 0 && index < this.comments.length) {
      this.comments.splice(index, 1);
      return true;
    }
    return false;
  }

  toggleLike() {
    this.likes += 1;
    return this.likes;
  }

  togglePin() {
    this.isPinned = !this.isPinned;
    return this.isPinned;
  }

  edit({ title, content, category }) {
    if (title) this.title = title;
    if (content) this.content = content;
    if (category) this.category = category;
    this.isEdited = true;
  }

  toJSON() {
    return {
      id: this.id,
      author: this.author,
      avatar: this.avatar,
      role: this.role,
      category: this.category,
      date: this.date,
      title: this.title,
      content: this.content,
      image: this.image,
      likes: this.likes,
      isPinned: this.isPinned,
      isEdited: this.isEdited,
      comments: this.comments.map(c => c.toJSON())
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ForumPost, ForumComment };
}
