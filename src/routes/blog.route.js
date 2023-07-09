const express = require("express");
const { blogController } = require("../controllers");
const { auth, checkAdminAuth } = require("../middlewares/auth");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: API management methods for blogs
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: title of the blog
 *         content:
 *           type: string
 *           description: content of the blog
 *         userId:
 *           type: string
 *         view:
 *           type: number
 *           description: amount view of the blog
 *       required:
 *         - title
 *         - content
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * security:
 *   - bearerAuth: []
 *
 * /blog/auth/get-all-blogs:
 *   get:
 *     summary: get all users
 *     tags: [Blogs]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: the number of blogs was limited per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: sort the blogs
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: the name of the blog
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: the content of the blog
 *       - in: query
 *         name: currentPage
 *         schema:
 *           type: string
 *         description: page number currently displayed
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: get all blogs successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       401:
 *         description: Error authent
 *       500:
 *         description: Server Error
 */
router.get("/get-all-blogs", blogController.getAllBlog);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * security:
 *   - bearerAuth: []
 *
 * /blog/auth/create-blog:
 *   post:
 *     summary: create user
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: create blog successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       401:
 *         description: authorization error
 *       500:
 *         description: server error
 */
router.post("/create-blog", auth, blogController.createBlog);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * security:
 *   - bearerAuth: []
 * /blog/auth/delete-blog/{id}:
 *   delete:
 *     summary: delete blog by id
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: blogID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: delete blog successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       401:
 *         description: authorization error
 *       500:
 *         description: server error
 */
router.delete("/delete-blog/:blogId", auth, blogController.deleteBlog);
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * security:
 *   - bearerAuth: []
 * /user/auth/update-blog/{id}:
 *   put:
 *     summary: update blog
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: blogID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: update blog successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       401:
 *         description: authorization error
 *       500:
 *         description: server error
 */
router.put("/update-blog/:blogId", auth, blogController.updateBlog);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * security:
 *   - bearerAuth: []
 * /blog/auth/detail-blog/{id}:
 *   get:
 *     summary: delete all user
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: blogID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: get detail blog successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       401:
 *         description: authorization error
 *       500:
 *         description: server error
 */
router.get("/detail-blog/:blogId", blogController.detailBlog);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * security:
 *   - bearerAuth: []
 *
 * /blog/auth/get-detail-blogs-30days:
 *   get:
 *     summary: get profile user
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: get detail blog in 30 days ago successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       401:
 *         description: authentication error
 *       500:
 *         description: server error
 */
router.get("/get-detail-blogs-30days", blogController.getBlog30Days);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * security:
 *   - bearerAuth: []
 *
 * /user/auth/get-top-10-blogs:
 *   get:
 *     summary: get top 10 blogs
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       401:
 *         description: authorization error
 *       500:
 *         description: server error
 */
router.get(
  "/get-top-10-blogs",
  auth,
  checkAdminAuth,
  blogController.getTop10Blogs
);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * security:
 *   - bearerAuth: []
 *
 * /user/auth/fake-random:
 *   get:
 *     summary: fake random blog and view
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: fake random blog and view successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       401:
 *         description: authorization error
 *       500:
 *         description: server error
 */
router.get(
  "/fake-random",
  auth,
  checkAdminAuth,
  blogController.fakeRandomBlogsAndViews
);

module.exports = router;
