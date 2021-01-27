//Express
const Router = require("express").Router;
var router = Router();
const multer = require("multer");
var upload = multer({dest: 'assets/userImgs/'})

//Import
const userController = require("../controllers/user/userController");
const middleware = require("../middleware.js");

let validate = new userController.LoginValidation();

router.post("/users",userController.insertUser)
router.post('/login', validate.login)
router.post('/logout',userController.logout)


router.get('/', validate.index);
router.get("/users",middleware.checkToken, userController.getUsers)
router.get("/users/:id/menuBookings",middleware.checkToken, userController.menuBookingsById)
router.get("/users/:id/areaBookings",middleware.checkToken, userController.areaBookingsById)
router.get("/users/:id/workshopBookings",middleware.checkToken, userController.workshopBookingsById)
router.get("/users/:id/avatar",middleware.checkToken, userController.avatarById)
router.get("/users/:id/notifications",middleware.checkToken, userController.notificationsById)
router.get("/users/:id/archivations",middleware.checkToken, userController.archivationsById)

router.put("/users/:id",middleware.checkToken, userController.edit)
router.put("/users/:id/image",middleware.checkToken, userController.changeAvatar)
router.put("/users/:userID/notifications/:id",middleware.checkToken, userController.archive)

router.delete("/users/:id",middleware.checkToken, userController.deleteUser)
router.delete("/users/:userID/notifications/:id",middleware.checkToken, userController.deleteNotification)
router.delete("/users/:userID/archivations/:id",middleware.checkToken, userController.deleteNotification)

module.exports = router;