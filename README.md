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
└── README.md
```