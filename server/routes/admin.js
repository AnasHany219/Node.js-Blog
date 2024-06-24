// Import dependencies
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const adminLayout = '../views/layouts/admin';

/**
 * check login
 */
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token)
    return res.status(401).json({
      message: 'Unauthorized'
    });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = jwt.decode.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Unauthorized'
    });
  }
};

/**
 * GET /
 * HOME
 */
router.get('/admin', (req, res) => {
  try {
    // Define local variables for the view
    const locals = {
      title: "NodeJs Blog",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    res.render('admin/index', {
      locals,
      layout: adminLayout
    });
  } catch (error) {
    console.log(error);
  }
});


/**
 * POST /
 * Admin - Check Login
 */
router.post('/admin', async (req, res) => {
  try {
    const {
      username,
      password
    } = req.body;
    const user = await User.findOne({
      username
    });
    if (!user)
      return res.status(401).json({
        message: 'Invalid Creadential.'
      });

    const ispasswordValid = await bcrypt.compare(password, user.password);
    if (!ispasswordValid)
      return res.status(401).json({
        message: 'Invalid Password.'
      });

    const token = jwt.sign({
        userId: user._id
      },
      jwtSecret
    );
    res.cookie('token', token, {
      httpOnly: true
    });

    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /
 * Admin Dashboard
 */
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }
    const data = await Post.find();
    res.render('admin/dashboard', {
      locals,
      data,
      layout: adminLayout
    })
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /
 * Admin - Create New Post
 */
router.get('/add-post', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Add Post",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    const data = await Post.find();
    res.render('admin/add-post', {
      locals,
      layout: adminLayout
    })
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST /
 * Admin - Create New Post
 */
router.post('/add-post', authMiddleware, async (req, res) => {
  try {
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body
      });

      await Post.create(newPost);
      res.redirect('/dashboard');
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

/**
 * Get /
 * Admin - Create New Post
 */
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "Free NodeJS User Managment System."
    }

    const data = await Post.findOne({
      _id: req.params.id
    });

    res.render('admin/edit-post', {
      locals,
      data,
      layout: adminLayout
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * Put /
 * Admin - Create New Post
 */
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now()
    });
    res.redirect(`/edit-post/${req.params.id}`);
  } catch (error) {
    console.log(error);
  }
});


/**
 * POST /
 * Admin - admin register
 */
router.post('/register', async (req, res) => {
  try {
    const {
      username,
      password
    } = req.body;
    console.log(req.body);

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await User.create({
        username,
        password: hashedPassword
      });
      res.status(201).json({
        message: 'User Created',
        user
      });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({
          message: "User already in use"
        });
      }
      res.status(500).json({
        message: 'Internal Server Error'
      });
    }
  } catch (error) {
    console.log(error);
  }
});

/**
 * Delete /
 * Admin - Delete Post
 */
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
  try {
    await Post.deleteOne({
      _id: req.params.id
    });
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /
 * Admin - Logout
 */

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  // res.json({
  //   message: "Logout Successfully!"
  // });
  res.redirect('/');
});

// Export the router to be used in other parts of the application
module.exports = router;