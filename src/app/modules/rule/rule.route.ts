import express from 'express'
import { USER_ROLES } from '../../../enums/user'
import auth from '../../middlewares/auth'
import { RuleController } from './rule.controller'
const router = express.Router()

//terms and conditions
router
  .route('/terms-and-conditions')
  .post(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    RuleController.createTermsAndCondition,
  )
  .patch(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    RuleController.updateTermsAndCondition,
  )
  .get(
    // auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER,  USER_ROLES.ARTIST),
    RuleController.getTermsAndCondition,
  )

//disclaimer
router
  .route('/disclaimer')
  .post(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    RuleController.createDisclaimer,
  )
  .patch(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    RuleController.updateDisclaimer,
  )
  .get(
    // auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER,  USER_ROLES.ARTIST),
    RuleController.getDisclaimer,
  )

export const RuleRoutes = router
