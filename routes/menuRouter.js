const Router = require("express").Router;
var router = Router();
const multer = require("multer");
var upload = multer({
    dest: 'assets/menuImgs/'
})
const middleware = require("../middleware")


//Imports
const menuController = require("../controllers/menu/menuControllers");
const bookingController = require("../controllers/menu/bookingController");

router.post("/menus", middleware.checkToken, menuController.addMenu) /* upload.single('img') */
router.post("/menuBookings", middleware.checkToken, bookingController.newBooking)

router.get("/menuTypes", menuController.getMenuType)
router.get("/menus", menuController.getMenus)
router.get("/menus/:id", menuController.getMenu)
router.get("/menuBookings", middleware.checkToken, bookingController.getBookings)
router.get("/menuBookings/decor", middleware.checkToken, bookingController.getBookingsDecor)
router.get("/menuBookings/extra", middleware.checkToken, bookingController.getBookingsExtra)
router.get("/menuBookings/addOns", middleware.checkToken, bookingController.getBookingsAddOn)

router.put("/menuBookings/:id", middleware.checkToken, bookingController.edit)
router.put("/menus/:id", middleware.checkToken, menuController.edit)


router.delete("/menuBookings/:id", middleware.checkToken, bookingController.removeBooking)
router.delete("/menus/:id", middleware.checkToken, menuController.removeMenu)

module.exports = router