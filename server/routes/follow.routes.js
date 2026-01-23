import { Router } from 'express';
import { getAllFollowers, getAllFollowing , createNewFollowing, unfollowUser} from '../controllers/follower.controller.js';
import { authorize } from '../middleware/auth.middleware.js';

const followRouter = Router();

followRouter.get("/followers/:userId" , getAllFollowers);
followRouter.get("/following/:userId" , getAllFollowing);
followRouter.post("/:id" , authorize , createNewFollowing);
followRouter.delete("/:id" , authorize , unfollowUser);

export default followRouter;