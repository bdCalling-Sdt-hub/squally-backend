import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { IRule } from './rule.interface'
import { Rule } from './rule.model'


//terms and conditions
const createTermsAndConditionToDB = async (payload: IRule) => {
  const isExistTerms = await Rule.findOne({ type: 'terms' })
  if (isExistTerms) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Terms and conditions already exist!',
    )
  } else {
    const result = await Rule.create({ ...payload, type: 'terms' })
    return result
  }
}

const getTermsAndConditionFromDB = async () => {
  const result = await Rule.findOne({ type: 'terms' })
  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Terms and conditions doesn't  exist!",
    )
  }
  return result
}

const updateTermsAndConditionToDB = async (payload: IRule) => {
  const isExistTerms = await Rule.findOne({ type: 'terms' })
  if (!isExistTerms) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Terms and conditions doesn't  exist!",
    )
  }
  const result = await Rule.findOneAndUpdate({ type: 'terms' }, payload, {
    new: true,
  })
  return result
}

//disclaimer
const createDisclaimerToDB = async (payload: IRule) => {
  const isExistDisclaimer = await Rule.findOne({ type: 'disclaimer' })
  if (isExistDisclaimer) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Disclaimer already exist!')
  } else {
    const result = await Rule.create({ ...payload, type: 'disclaimer' })
    return result
  }
}

const getDisclaimerFromDB = async () => {
  const result = await Rule.findOne({ type: 'disclaimer' })
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Disclaimer doesn't exist!")
  }
  return result
}

const updateDisclaimerToDB = async (payload: IRule) => {
  const isExistDisclaimer = await Rule.findOne({ type: 'disclaimer' })
  if (!isExistDisclaimer) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Disclaimer doesn't exist!")
  }
  const result = await Rule.findOneAndUpdate({ type: 'disclaimer' }, payload, {
    new: true,
  })
  return result
}

export const RuleService = {
  createDisclaimerToDB,
  getDisclaimerFromDB,
  updateDisclaimerToDB,
  createTermsAndConditionToDB,
  getTermsAndConditionFromDB,
  updateTermsAndConditionToDB
}
