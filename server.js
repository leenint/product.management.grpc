const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// load configuration
global.config = require('./helpers/configuration').init();

// database
global.db = require('./databases');

const ProductModel = require('./models/product.model');
const BranchModel = require('./models/branch.model');

const PRODUCT_PROTO_PATH = './protos/product.proto';
const BRANCH_PROTO_PATH = './protos/branch.proto';

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
const packageDefinition = protoLoader.loadSync(PRODUCT_PROTO_PATH, options);
const productProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(productProto.ProductService.service, {
  getAllProduct: async (_, callback) => {
    const { items, total } = await ProductModel.getList({ ..._.request });

    callback(null, { items, total });
  },

  getProduct: async (_, callback) => {
    const productId = _.request.id;
    const product = await ProductModel.getById(productId);
    if (product == null) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: `Product with id '${productId}' could not be found.`,
      });
    }

    callback(null, product);
  },

  deleteProduct: async (_, callback) => {
    const productId = _.request.id;

    const product = await ProductModel.getById(productId);
    if (product == null) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: `Product with id '${productId}' could not be found.`,
      });
    }

    await ProductModel.delete(productId);
    callback(null, {});
  },

  editProduct: async (_, callback) => {
    const productId = _.request.id;

    const product = await ProductModel.getById(productId);
    if (product == null) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: `Product with id '${productId}' could not be found.`,
      });
    }

    const productItem = await ProductModel.update(productId, { ..._.request });

    callback(null, productItem);
  },

  addProduct: async (_, callback) => {
    try {
      const product = await ProductModel.create({ ..._.request });
      callback(null, product);
    } catch (err) {
      callback({
        code: grpc.status.INTERNAL,
        message: err.message,
      });
    }
  },
});

const branchPackageDefinition = protoLoader.loadSync(BRANCH_PROTO_PATH, options);
const branchProto = grpc.loadPackageDefinition(branchPackageDefinition);

server.addService(branchProto.BranchService.service, {
  getAll: async (_, callback) => {
    const items = await BranchModel.getAll();
    callback(null, { items });
  },
});

server.bindAsync(
  '127.0.0.1:50051',
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log('Server at port:', port);
    console.log('Server running at http://127.0.0.1:50051');
    server.start();
  },
);
