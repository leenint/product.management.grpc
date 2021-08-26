# product.management.grpc
https://github.com/leenint/product.management.grpc

Step to run after clone source code
- Edit database connection in _config/local.yml_, just need a empty database.
- Run: `npm install`
- Run: `npm run seeder` - sync data-schema and create some data
- Run: `npm start` - to start *product.management.grpc*

---
# product.management
https://github.com/leenint/product.management

_Make sure `product.management.grpc` had been started. This project will connect it to get data_

Step to run after clone source code
- Run: `npm install`
- Run: `npm start` - to start *product.management*

Run test after clone source code
- Run: `npm install`
- Run: `npm run test`

---
# CURL to verify the APIs.
_Make sure 2 projects above had been started_

1. Get All Branchs

`curl --location --request GET 'http://localhost:8080/api/branch'`

2. Get All Products

`curl --location --request GET 'http://localhost:8080/api/product'`

3. Create Product

`curl --location --request POST 'http://localhost:8080/api/product' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "iPhone 13",
    "code": "iPhone 13",
    "description": "",
    "branchId": "1",
    "colors": [
        "White",
        "Black",
        "Blue",
        "Green",
        "Purple",
        "Red"
    ]
}'`

4. Update Project

`curl --location --request PUT 'http://localhost:8080/api/product/1' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "iPhone 13",
    "code": "iPhone 13",
    "description": "",
    "branchId": "1",
    "colors": [
        "White",
        "Black",
        "Blue",
        "Green",
        "Purple",
        "Red"
    ]
}'`

5. Delete Product

`curl --location --request DELETE 'http://localhost:8080/api/product/5'`


# Libraries used:
 * grpc
 * ioredis
 * express
 * sequelize