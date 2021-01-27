//Express
const Router = require("express").Router;
var router = Router();
const multer = require("multer");
var upload = multer({dest: 'assets/workshops/'})
const middleware = require("../middleware.js");


//Import
const workshopController = require("../controllers/workshops/workshopsController");
const inscriptionController = require("../controllers/workshops/inscriptionController");


router.post("/workshops",middleware.checkToken,workshopController.addWorkshop)

router.post("/workshops/inscription",middleware.checkToken,inscriptionController.addInscription)

router.get("/workshops", workshopController.getWorkshops)
router.get("/workshops/:id", workshopController.getWorkshop)
router.get("/workshops/inscription", middleware.checkToken, inscriptionController.getInscription)

router.put("/workshops/:id",middleware.checkToken, workshopController.updateWorkshop)

router.delete("/workshops/:id",middleware.checkToken, workshopController.removeWorkshop)

module.exports=router;