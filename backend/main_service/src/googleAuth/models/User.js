const users = new Map();

export default {
  async findOrCreate({ where, defaults }) {
    let user = users.get(where.googleId);

    if (!user) {
      user = {
        id: users.size + 1,
        googleId: where.googleId,
        ...defaults,
      };
      users.set(where.googleId, user);
    }

    return [user, true];
  },

  async findByPk(id) {
    return [...users.values()].find(u => u.id === id) || null;
  },
};
