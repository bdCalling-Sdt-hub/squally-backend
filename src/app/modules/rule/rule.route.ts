import express from 'express'
import { USER_TYPE } from '../../../enums/user'
import auth from '../../middlewares/auth'
import { RuleController } from './rule.controller'
const router = express.Router()

//privacy policy
router
  .route('/privacy-policy')
  .post(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
    RuleController.createPrivacyPolicy,
  )
  .patch(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
    RuleController.updatePrivacyPolicy,
  )
  .get(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN, USER_TYPE.PATIENT),
    RuleController.getPrivacyPolicy,
  )

//terms and conditions
router
  .route('/terms-and-conditions')
  .post(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
    RuleController.createTermsAndCondition,
  )
  .patch(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
    RuleController.updateTermsAndCondition,
  )
  .get(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN, USER_TYPE.PATIENT),
    RuleController.getTermsAndCondition,
  )

//privacy policy
router
  .route('/about')
  .post(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
    RuleController.createAbout,
  )
  .patch(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
    RuleController.updateAbout,
  )
  .get(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN, USER_TYPE.PATIENT),
    RuleController.getAbout,
  )

export const RuleRoutes = router
