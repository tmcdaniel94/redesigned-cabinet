const router = require('express').Router();
const { Post, Comment, User } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/comment', withAuth, async (req, res) => {
  const { postId, comment } = req.body;
  try {
    // Create a new comment
    const newComment = await Comment.create({
      post_id: postId,
      body: comment,
      user_id: req.session.user_id, // Assuming the logged-in user ID is stored in the session
    });
    // Respond with a success message
    res.json({ success: true, comment: newComment });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ success: false, message: 'Failed to add comment' });  
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;