const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
      // Get all posts and JOIN with user data
      // const userData = await User.findAll({});
      const user = req.session.user_id;
      const postData = await Post.findAll({
        include: [
          {
            model: User,
            attributes: ['name'],
          },
        ],
      });
      // const postsByUser = postData.filter(post => post.user_id === user);
      // Serialize data so the template can read it
      // const posts = postData.map((post) => post.get({ plain: true }));
      const posts = postData.map((post) => { const plainPost = post.get({ plain: true });
      
        // Format the date_created field using Intl.DateTimeFormat
        if (plainPost.date_created) {
          const date = new Date(plainPost.date_created);
          plainPost.date_created = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: '2-digit',
            year: 'numeric',
          }).format(date); // Example format: "October 22, 2024"
        }
      
        return plainPost;
      });

      // Pass serialized data and session flag into template
      res.render('home', { 
        posts,
        logged_in: req.session.logged_in 
      });
      // res.json(postsByUser);

    } catch (err) {
      res.status(500).json(err);
    }
    
  });

  router.get('/post/:id', async (req, res) => {
    try {
      const postData = await Post.findByPk(req.params.id, {
        // include: [
        //   User,
        //   {
        //     model: Comment,
        //     include: [User],
        //   },
        // ]
        include: [
          {
            model: User,
            attributes: ['name'],
          },
          {
            model: Comment,
            attributes: ['body', 'date_created'],
            include: [
              {
                model: User,
                attributes: ['name'],
              },
            ],
          },
        ],
      });

      const post = postData.get({ plain: true });

      // if (postData) {
      // const post = postData.get({ plain: true });
  
      // res.render('post', { post, loggedIn: req.session.logged_in });
      // } else {
      //   res.status(404).end();
      // }
  
      res.render('post', {
        ...post,
        logged_in: req.session.logged_in,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
    try {
      // Find the logged in user based on the session ID
      const userData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ['password'] },
        include: [{ model: Post }],
      });
  
      const user = userData.get({ plain: true });
  
      res.render('profile', {
        ...user,
        logged_in: true
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get('/login', (req, res) => {
    // If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
      res.redirect('/profile');
      return;
    }
  
    res.render('login');
  });
  
  module.exports = router;