const express = require("express");
const router = express.Router();
const tutorialController = require("./tutorial.controller");

// Tạo tutorial mới
router.post("/tutorials", (req, res) => {
  tutorialController
    .createTutorial(req.body)
    .then((tutorial) => res.status(201).send(tutorial))
    .catch((err) => res.status(500).send({ message: err.message }));
});

// Tạo comment mới cho tutorial dựa trên tutorialId
router.post("/tutorials/:tutorialId/comments", (req, res) => {
  tutorialController
    .createComment(req.params.tutorialId, req.body)
    .then((comment) => res.status(201).send(comment))
    .catch((err) => res.status(500).send({ message: err.message }));
});

// Lấy tutorial dựa trên tutorialId, bao gồm các comment
router.get("/tutorials/:tutorialId", (req, res) => {
  tutorialController
    .findTutorialById(req.params.tutorialId)
    .then((tutorial) => {
      if (!tutorial) {
        return res.status(404).send({ message: "Tutorial not found" });
      }
      res.status(200).send(tutorial);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
});

// Lấy comment dựa trên commentId
router.get("/comments/:commentId", (req, res) => {
  tutorialController
    .findCommentById(req.params.commentId)
    .then((comment) => {
      if (!comment) {
        return res.status(404).send({ message: "Comment not found" });
      }
      res.status(200).send(comment);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
});

// Lấy tất cả tutorials, bao gồm comments
router.get("/tutorials", (req, res) => {
  tutorialController
    .findAll()
    .then((tutorials) => res.status(200).send(tutorials))
    .catch((err) => res.status(500).send({ message: err.message }));
});

module.exports = router;
