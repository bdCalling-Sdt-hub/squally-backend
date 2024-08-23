import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { RuleRoutes } from '../app/modules/rule/rule.route';
import { CategoryRoutes } from '../app/modules/category/category.route';
import { LessonRoutes } from '../app/modules/lesson/lesson.routes';
import { ReviewRoutes } from '../app/modules/review/review.routes';
import { BookmarkRoutes } from '../app/modules/bookmark/bookmark.routes';
import { ArtistRoutes } from '../app/modules/artist/artist.routes';
import { BookingRoutes } from '../app/modules/booking/booking.routes';
const router = express.Router();

const apiRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/rule',
    route: RuleRoutes,
  },
  {
    path: '/category',
    route: CategoryRoutes,
  },
  {
    path: '/lesson',
    route: LessonRoutes,
  },
  {
    path: '/review',
    route: ReviewRoutes,
  },
  {
    path: '/bookmark',
    route: BookmarkRoutes,
  },
  {
    path: '/artist',
    route: ArtistRoutes,
  },
  {
    path: '/booking',
    route: BookingRoutes
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
