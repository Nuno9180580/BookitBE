//Express
const Router = require("express").Router;
var router = Router();
const multer = require("multer");
var upload = multer({dest: 'assets/areas/'})
const middleware = require("../middleware.js");


//Import
const areasController = require("../controllers/area/areasControllers");
const areasBookingController = require("../controllers/area/areasBookingController");

router.post("/areas",middleware.checkToken, areasController.addArea);
router.post("/areasBookings",middleware.checkToken, areasBookingController.newAreaBooking)

router.get("/areas", areasController.getAreas)
router.get("/areas/:id", areasController.getArea)
router.get("/areasBookings",middleware.checkToken, areasBookingController.areasBooking)

router.put("/areas/:id",middleware.checkToken, areasController.updateArea)
router.put("/areasBookings/:id",middleware.checkToken, areasBookingController.edit)

router.delete("/areasBookings/:id",middleware.checkToken, areasBookingController.removeAreaBooking)
router.delete("/areas/:id",middleware.checkToken, areasController.removeArea);

module.exports = router