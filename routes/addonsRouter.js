const Router = require("express").Router;
var router = Router();
const multer = require("multer");
var upload = multer({dest: 'assets/outfits/'})
const middleware = require("../middleware.js");



//Import DB
const addonsController = require("../controllers/addons/addonsControllers");

router.post("/ingredients",middleware.checkToken, addonsController.addIngredient)
router.post("/decors",middleware.checkToken, addonsController.addDecor)
router.post("/outfits",middleware.checkToken, addonsController.addOutfit) /* upload.single('img'), */
router.post("/extras",middleware.checkToken, addonsController.addExtra)

router.get("/ingredients",middleware.checkToken, addonsController.getIngredients)
router.get("/menus/:id/ingredients",addonsController.getIngredientsByMenu)
router.get("/decors",middleware.checkToken, addonsController.getDecors)
router.get("/outfits",middleware.checkToken, addonsController.getOutfits)
router.get("/extras",middleware.checkToken, addonsController.getExtras)
router.get("/schools", addonsController.getSchools)


router.delete("/extras/:id",middleware.checkToken, addonsController.removeExtra)
router.delete("/ingredients/:id",middleware.checkToken, addonsController.removeIngredient)
router.delete("/decors/:id",middleware.checkToken, addonsController.removeDecor)
router.delete("/outfits/:id",middleware.checkToken, addonsController.removeOutfit)

module.exports = router