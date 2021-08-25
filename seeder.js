global.config = require('./helpers/configuration').init();

const db = require('./databases');

(async function init() {
  // force: true will drop the table if it already exists
  await db.sequelize.sync({ force: true });
  const branchs = await Promise.all([
    db.branch.create({
      name: 'Apple Inc',
      code: 'APPLE',
      address: '1 Apple Park Way Cupertino, California, U.S.',
    }),
    db.branch.create({
      name: 'Samsung Group',
      code: 'SAMSUNG',
      address: '40th floor Samsung Electronics Building, 11, Seocho-daero 74-gil, Seocho District, Seoul, South Korea',
    }),
  ]);

  const products = [
    {
      name: 'iPhone 12',
      code: 'iPhone 12',
      description: '',
      branch: 'APPLE',
      colors: ['White', 'Black', 'Blue', 'Green', 'Purple', 'Red'],
    },
    {
      name: 'iPhone 12 mini',
      code: 'iPhone 12 mini',
      description: '',
      branch: 'APPLE',
      colors: ['White', 'Black', 'Blue', 'Green', 'Purple'],
    },
    {
      name: 'Galaxy Z Fold2 5G',
      code: 'FOLD2_5G',
      description: '',
      branch: 'SAMSUNG',
      colors: ['Mystic Black', 'Metallic Blue', 'Metallic Red', 'Metallic Silver', 'Metallic Gold'],
    },
    {
      name: 'Galaxy Z Fold3 5G',
      code: 'FOLD3_5G',
      description: '',
      branch: 'SAMSUNG',
      colors: ['Mystic Black', 'Metallic Blue', 'Metallic Silver'],
    },
  ];

  let productEntities = products.map(p => ({
    name: p.name,
    code: p.code,
    description: p.description,
    branchId: branchs.find(b => b.code === p.branch).id,
  }));

  productEntities = await db.product.bulkCreate(productEntities);

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const productEntity = productEntities[i];

    const colorEntities = product.colors.map(c => ({ color: c }));
    await db.color.bulkCreate(colorEntities, { updateOnDuplicate: ['color'] });

    const allColors = await db.color.findAll();

    const colorAssigneds = product.colors.map((color, j) => ({
      productId: productEntity.id,
      colorId: allColors.find(c => c.color === color).id,
      order: j + 1,
    }));
    await db.productColor.bulkCreate(colorAssigneds, { updateOnDuplicate: ['order'] });
  }

  console.log('Finish drop-create database and run seeder script.');
}());
