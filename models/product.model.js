const { Op } = require('sequelize');
const productTable = require('../databases/tables/product');
const ColorModel = require('./color.model');

const { db } = global;

const ProductModel = {
  getList: async ({
    name,
    code,
    branchId,
    color,
    sortBy,
    sortType,
    pageSize,
    pageNum,
  }) => {
    const where = {};
    if (code) {
      where.code = code;
    }
    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }
    if (branchId) {
      where.branchId = branchId;
    }

    let whereColor;
    if (color) {
      const colorEntity = await ColorModel.findByCode(color);
      if (!colorEntity) {
        return { items: [], total: 0 };
      }
      whereColor = { colorId: colorEntity.id };
    }

    if (!sortBy || !Object.keys(productTable.define).includes(sortBy)) {
      sortBy = 'name';
    }
    if (!sortType || sortType.toLowerCase() !== 'desc') {
      sortType = 'asc';
    }

    const limit = pageSize || 20;
    const offset = ((pageNum || 1) - 1) * limit;

    const { rows, count } = await db.product.findAndCountAll({
      distinct: true,
      where,
      order: [[sortBy, sortType]],
      limit,
      offset,
      include: [
        {
          model: db.productColor,
          as: 'productColors',
          where: whereColor,
          attributes: [],
        },
        {
          model: db.color,
          as: 'colors',
          attributes: ['color'],
          through: { attributes: [] },
        },
      ],
    });
    const items = rows.map(x => {
      const item = x.get({ plain: true });
      item.colors = item.colors.map(c => c.color);
      return item;
    });
    return { items, total: count };
  },

  getById: async (id) => (
    db.product.findByPk(id, {
      include: [
        {
          model: db.color,
          as: 'colors',
          attributes: ['color'],
          through: { attributes: [] },
        },
      ],
    }).then(x => {
      const item = x.get({ plain: true });
      item.colors = item.colors.map(c => c.color);
      return item;
    })
  ),

  create: async (item) => {
    const isExists = await db.product.findOne({
      where: { code: item.code },
    });
    if (isExists) {
      throw new Error(`Product code '${item.code}' is already exists!`);
    }
    const product = await db.product.create(item);

    if (item.colors && item.colors.length) {
      const colorEntities = await ColorModel.bulkCreate(item.colors);
      await db.productColor.bulkCreate(colorEntities.map((c, i) => ({
        productId: product.id,
        colorId: c.id,
        order: i + 1,
      })));
    }

    return ProductModel.getById(product.id);
  },

  update: async (id, item) => {
    const isExists = await db.product.findOne({
      where: {
        code: item.code,
        id: { [Op.ne]: id },
      },
    });
    if (isExists) {
      throw new Error(`Product code '${item.code}' is already exists!`);
    }

    delete item.createdAt;
    delete item.updatedAt;

    await db.product.update(item, { where: { id } });
    await db.productColor.destroy({ where: { productId: id } });

    if (item.colors && item.colors.length) {
      const colorEntities = await ColorModel.bulkCreate(item.colors);
      await db.productColor.bulkCreate(colorEntities.map((c, i) => ({
        productId: id,
        colorId: c.id,
        order: i + 1,
      })));
    }

    return ProductModel.getById(id);
  },

  delete: async (id) => {
    await db.productColor.destroy({ where: { productId: id } });
    await db.product.destroy({ where: { id } });
  },
};

module.exports = ProductModel;
