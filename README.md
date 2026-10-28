# Backend Task

## Task: Call a Public API using Postman

This task demonstrates calling a public REST API using Postman to test request methods, observe responses, and verify HTTP status codes.

### Public API Details
- **API Provider**: [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
- **Tool Used**: Postman

---

### API Requests & Testing

#### 1. GET Request
- **Method**: `GET`
- **URL**: `https://jsonplaceholder.typicode.com/posts/1`
- **Status**: `200 OK`
- **Description**: Retrieves post details for ID `1`.
- **Screenshot**:
  ![GET Request](api-testing/get-request.png)

#### 2. POST Request
- **Method**: `POST`
- **URL**: `https://jsonplaceholder.typicode.com/users/1`
- **Status**: `404 Not Found`
- **Description**: Demonstrates handling of a POST request to a route that does not accept POST.
- **Screenshot**:
  ![POST Request](api-testing/post-request.png)

---

### Folder Structure
```
backend-task/
├── api-testing/
│   ├── get-request.png
│   └── post-request.png
├── memory-curd-api/
│   ├── controllers/
│   │   └── userController.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── routes/
│   │   └── userRoutes.js
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── users-orders-mysql/
│   ├── controllers/
│   │   ├── orderController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── orderRoutes.js
│   │   └── userRoutes.js
│   ├── .env
│   ├── .gitignore
│   ├── db.js
│   ├── package.json
│   ├── schema.sql
│   └── server.js
├── .gitignore
└── README.md
```

---

## Task: In-Memory CRUD API

An Express.js RESTful API implementing full CRUD operations on an in-memory user collection with input validation and centralized error handling.

### Directory
Located in [`memory-curd-api/`](file:///c:/Users/dhana/OneDrive/Desktop/backend-task/memory-curd-api).

### How to Run
```bash
cd memory-curd-api
npm install
npm start
```
The server will start at `http://localhost:3000`.

### Endpoints

| Method | Endpoint | Description | Request Body | Expected Status |
|---|---|---|---|---|
| `GET` | `/` | Welcome health check | None | `200 OK` |
| `GET` | `/api/users` | Get all users | None | `200 OK` |
| `GET` | `/api/users/:id` | Get user by ID | None | `200 OK` (or `404`) |
| `POST` | `/api/users` | Create new user | `{"name": "...", "email": "..."}` | `201 Created` (or `400`) |
| `PUT` | `/api/users/:id` | Update user by ID | `{"name": "...", "email": "..."}` | `200 OK` (or `400`/`404`) |
| `DELETE` | `/api/users/:id` | Delete user by ID | None | `200 OK` (or `404`) |

### Error Handling Tests
- `GET /api/users/999` -> `404 Not Found` (`User not found`)
- `GET /api/unknown` -> `404 Not Found` (`Route not found`)
- `POST /api/users` with `{}` -> `400 Bad Request` (`Name and email are required`)
- `GET /api/users/abc` -> `400 Bad Request` (`Invalid user ID`)

---

## Task: Users and Orders API with MySQL

A relational RESTful API using Express.js and MySQL (via `mysql2/promise`) managing `users` and `orders` tables with foreign keys and cascading deletes.

### Directory
Located in [`users-orders-mysql/`](file:///c:/Users/dhana/OneDrive/Desktop/backend-task/users-orders-mysql).

### Folder Structure
```
backend-task/users-orders-mysql/
├── controllers/
│   ├── orderController.js
│   └── userController.js
├── middleware/
│   └── errorHandler.js
├── routes/
│   ├── orderRoutes.js
│   └── userRoutes.js
├── .env
├── .gitignore
├── db.js
├── package.json
├── schema.sql
└── server.js
```

### Database Setup
1. Start MySQL in XAMPP (default port `3306` or `3307`).
2. Open phpMyAdmin, select the **SQL** tab, and execute [`schema.sql`](file:///c:/Users/dhana/OneDrive/Desktop/backend-task/users-orders-mysql/schema.sql):
   ```sql
   CREATE DATABASE IF NOT EXISTS users_orders_db;
   USE users_orders_db;

   CREATE TABLE IF NOT EXISTS users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       email VARCHAR(150) NOT NULL UNIQUE,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE IF NOT EXISTS orders (
       id INT AUTO_INCREMENT PRIMARY KEY,
       user_id INT NOT NULL,
       product_name VARCHAR(150) NOT NULL,
       quantity INT NOT NULL DEFAULT 1,
       total_amount DECIMAL(10, 2) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

       CONSTRAINT fk_orders_users
           FOREIGN KEY (user_id)
           REFERENCES users(id)
           ON DELETE CASCADE
   );
   ```
3. Update `.env` if your port or credentials differ:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=users_orders_db
   ```

### How to Run
```bash
cd users-orders-mysql
npm install
npm start
```
The server will connect to MySQL and run at `http://localhost:3000`.

### API Endpoints

#### 1. Users (`/api/users`)
| Method | Endpoint | Description | Request Body | Status Codes |
|---|---|---|---|---|
| `GET` | `/api/users` | List all users | None | `200 OK` |
| `POST` | `/api/users` | Create user | `{"name": "...", "email": "..."}` | `201 Created`, `400 Bad Request`, `409 Conflict` |
| `PUT` | `/api/users/:id` | Update user | `{"name": "...", "email": "..."}` | `200 OK`, `400 Bad Request`, `404 Not Found`, `409 Conflict` |
| `DELETE` | `/api/users/:id` | Delete user and cascade delete orders | None | `200 OK`, `400 Bad Request`, `404 Not Found` |

#### 2. Orders (`/api/orders`)
| Method | Endpoint | Description | Request Body | Status Codes |
|---|---|---|---|---|
| `GET` | `/api/orders` | List all orders with joined `user_name` | None | `200 OK` |
| `POST` | `/api/orders` | Create an order | `{"user_id": 1, "product_name": "...", "quantity": 1, "total_amount": 99.99}` | `201 Created`, `400 Bad Request` |
| `GET` | `/api/orders/user/:userId` | Get all orders by user ID | None | `200 OK`, `400 Bad Request`, `404 Not Found` |

### Database Relationship & Error Handling
- **Cascade Deletion**: When a user is deleted via `DELETE /api/users/:id`, all associated records in `orders` are automatically deleted by MySQL due to `ON DELETE CASCADE`.
- **Foreign Key Validation**: Attempting to create an order with a non-existent `user_id` returns `400 Bad Request` (`The specified user does not exist`).
- **Unique Constraint Validation**: Attempting to create or update a user with an email already taken returns `409 Conflict` (`Email already exists`).
- **SQL Injection Prevention**: Parameterized prepared statements (`?` placeholders) are used for all dynamic SQL queries.