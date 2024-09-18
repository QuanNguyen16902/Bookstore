const db = require("./index");
const User = db.users;

// Create and Save a new User
exports.createUser = (req, res) => {
  const { name, email, password } = req.body;

  // Validate request
  if (!name || !email || !password) {
    return res.status(400).send({
      message: "Name, email, and password are required!",
    });
  }
  // Save User in the database
  User.create({
    name,
    email,
    password, // You should hash the password before saving
  })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

// Retrieve all Users from the database
exports.findAllUsers = (req, res) => {
  User.findAll()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

// Find a single User by ID
exports.findUserById = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Error retrieving User with id=${id}.`,
      });
    });
};

// Update a User by the ID
exports.updateUser = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Error updating User with id=${id}.`,
      });
    });
};

// Delete a User by the ID
exports.deleteUser = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Could not delete User with id=${id}.`,
      });
    });
};
