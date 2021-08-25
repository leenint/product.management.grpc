const { db } = global;

const BranchModel = {
  /**
   * function get all current branch
   * @returns {Array<{id: number, name: string, code: string, address: string}>}
   */
  getAll: () => (
    db.branch.findAll({
      raw: true,
    })
  ),

  /**
   * function to create branch
   * @param {object} branch
   * @returns {object}
   */
  create: async (branch) => (
    db.branch.create(branch)
  ),
};

module.exports = BranchModel;
