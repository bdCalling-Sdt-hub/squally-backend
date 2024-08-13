import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { RuleRoutes } from '../app/modules/rule/rule.route';
import { CategoryRoutes } from '../app/modules/category/category.route';
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
  },{
    path: '/category',
    route: CategoryRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
