import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { ArtistController } from "./artist.controller";
const router = express.Router();

router.get("/popular-musicians", auth(USER_ROLES.USER), ArtistController.popularArtistFromDB);
router.get("/available-musicians", auth(USER_ROLES.USER), ArtistController.availableArtistFromDB);
router.get("/:category", auth(USER_ROLES.USER), ArtistController.artistByCategoryFromDB);
router.get("/", auth(USER_ROLES.USER), ArtistController.artistListFromDB);
router.get("/:id", auth(USER_ROLES.USER, USER_ROLES.ARTIST), ArtistController.artistProfileFromDB);


export const ArtistRoutes = router;