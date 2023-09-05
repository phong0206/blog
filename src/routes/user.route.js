const express = require("express");
const {
  login,
  register,
  getAllUser,
} = require("../validations/auth.validation");
const { userController } = require("../controllers");
const { validate } = require("express-validation");
const {
  auth,
  checkAdminAuth,
  authVerifyAccount,
} = require("../middlewares/auth");
const router = express.Router();

router.post("/addfriend/:id", auth, userController.sendReqAddFriend);

router.post(
  "/accept-friend/:friendId",
  auth,
  userController.acceptFriendRequest
);

router.delete(
  "/revoke-friend-request/:id",
  auth,
  userController.revokeFriendRequest
);
router.delete(
  "/unfriend/:id",
  auth,
  userController.unfriend
);

router.get("/verify", userController.verifyRegister);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API management methods for users
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: Email
 *         password:
 *           type: string
 *           format: password
 *           description: password
 *         name:
 *           type: string
 *           description: name of the user
 *           example: "phonguser"
 *         phonenumber:
 *           type: string
 *           description: Phone number of the user
 *           example: 0326603593
 *         age:
 *           type: number
 *           description: age of the user
 *           example: 20
 *         isAdmin:
 *           type: boolean
 *           example: false
 *       required:
 *         - email
 */
/**
 * @swagger
 * /user/auth/supply-new-password:
 *   post:
 *     summary: supply new password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *
 *     responses:
 *       200:
 *         description: check your mail to get new password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation Failed
 *       500:
 *         description: Error server
 */
router.post("/supply-new-password", userController.supplyNewPassword);
router.get("/get-new-password", userController.getNewPassword);


/**
 * @swagger
 * /user/auth/register:
 *   post:
 *     summary: Register a user with the specified email and password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *
 *     responses:
 *       200:
 *         description: User registration successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation Failed
 *       500:
 *         description: Error server
 */
router.post("/register", validate(register), userController.register);

/**
 * @swagger
 * /user/auth/login:
 *   post:
 *     summary: Login a user with the specified email and password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *
 *     responses:
 *       200:
 *         description: User login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation Failed
 *       500:
 *         description: Error server
 */
router.post("/login", validate(login), authVerifyAccount, userController.login);
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
 * /user/auth/get-all-users:
 *   get:
 *     summary: get all users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: the number of users was limited per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: sort the users
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: the name of the user
 *       - in: query
 *         name: age
 *         schema:
 *           type: number
 *         description: the age of the user
 *       - in: query
 *         name: age[lt]
 *         schema:
 *           type: number
 *         description: the age of the user is lower than
 *       - in: query
 *         name: age[gt]
 *         schema:
 *           type: number
 *         description: the age of the user is greater than
 *       - in: query
 *         name: currentPage
 *         schema:
 *           type: string
 *         description: page number currently displayed
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Error authent
 *       500:
 *         description: Server Error
 */
router.get(
  "/get-all-users",
  auth,
  checkAdminAuth,
  userController.getListUsers
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
 * /user/auth/profile:
 *   get:
 *     summary: get profile user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: authentication error
 *       500:
 *         description: server error
 */
router.get("/profile", auth, userController.getProfile);
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
 * /user/auth/fake-users:
 *   post:
 *     summary: fake user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: authorization error
 *       500:
 *         description: server error
 */
router.post("/fake-users", auth, checkAdminAuth, userController.fakeUser);
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
 * /user/auth/delete-all-users:
 *   delete:
 *     summary: delete all user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: authorization error
 *       500:
 *         description: server error
 */
router.delete(
  "/delete-all-users",
  auth,
  checkAdminAuth,
  userController.deleteAllUsers
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
 * /user/auth/create-user:
 *   post:
 *     summary: create user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: authorization error
 *       500:
 *         description: server error
 */
router.post("/create-user", auth, checkAdminAuth, userController.createUser);
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
 * /user/auth/delete/{id}:
 *   delete:
 *     summary: delete user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: userID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: delete user successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: authorization error
 *       500:
 *         description: server error
 */
router.delete("/delete/:id", userController.deleteUser);
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * security:
 *   - bearerAuth: []
 * /user/auth/update/{id}:
 *   put:
 *     summary: update  user by ID
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: userID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: authorization error
 *       500:
 *         description: server error
 */
router.put("/update", auth, userController.updateUser);
module.exports = router;
