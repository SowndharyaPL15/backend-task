let users = [
  { id: 1, name: "Arun", email: "arun@example.com" },
  { id: 2, name: "Priya", email: "priya@example.com" }
];

let nextId = 3;

// GET /api/users - Get all users
exports.getAllUsers = (req, res) => {
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
};

// GET /api/users/:id - Get one user
exports.getUserById = (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID"
    });
  }

  const user = users.find(user => user.id === id);

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    return next(error);
  }

  res.status(200).json({
    success: true,
    data: user
  });
};

// POST /api/users - Create a user
exports.createUser = (req, res) => {
  const { name, email } = req.body;

  if (
    typeof name !== "string" || !name.trim() ||
    typeof email !== "string" || !email.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Name and email are required"
    });
  }

  const newUser = {
    id: nextId++,
    name: name.trim(),
    email: email.trim()
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: newUser
  });
};

// PUT /api/users/:id - Update a user
exports.updateUser = (req, res, next) => {
  const id = Number(req.params.id);
  const { name, email } = req.body;

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID"
    });
  }

  if (
    typeof name !== "string" || !name.trim() ||
    typeof email !== "string" || !email.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Name and email are required"
    });
  }

  const user = users.find(user => user.id === id);

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    return next(error);
  }

  user.name = name.trim();
  user.email = email.trim();

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: user
  });
};

// DELETE /api/users/:id - Delete a user
exports.deleteUser = (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID"
    });
  }

  const index = users.findIndex(user => user.id === id);

  if (index === -1) {
    const error = new Error("User not found");
    error.status = 404;
    return next(error);
  }

  const deletedUser = users.splice(index, 1)[0];

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: deletedUser
  });
};
