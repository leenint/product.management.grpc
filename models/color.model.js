const { db } = global;

const ColorModel = {
  findByCode: (color) => (
    db.color.findOne({ raw: true, where: { color } })
  ),

  /**
   * function to create colors
   * @param {string[]} colors
   * @returns {Array<{id: number, color: string }>}
   */
  bulkCreate: async (colors) => {
    await db.color.bulkCreate(colors.map(c => ({ color: c })), { updateOnDuplicate: ['color'] });
    const colorEntities = await db.color.findAll({
      raw: true,
      where: { color: colors },
    });
    // eslint-disable-next-line arrow-body-style
    const result = colors.map(c => {
      return colorEntities.find(entity => entity.color === c);
    });

    return result;
  },

  deleteByCode: (color) => db.color.destroy({ where: { color } }),
};

module.exports = ColorModel;
