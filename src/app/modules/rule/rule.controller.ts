import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { RuleService } from './rule.service'


//terms and conditions
const createTermsAndCondition = catchAsync(
  async (req: Request, res: Response) => {
    const { ...termsData } = req.body;
    const result:any = await RuleService.createTermsAndConditionToDB(termsData)

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Terms and conditions created successfully',
      data: result,
    })
  },
)

const getTermsAndCondition = catchAsync(async (req: Request, res: Response) => {
  const result = await RuleService.getTermsAndConditionFromDB()

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Terms and conditions retrieved successfully',
    data: result,
  })
})

const updateTermsAndCondition = catchAsync(
  async (req: Request, res: Response) => {
    const { ...termsData } = req.body
    const result:any = await RuleService.updateTermsAndConditionToDB(termsData)

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Terms and conditions updated successfully',
      data: result,
    })
  },
)

//disclaimer
const createDisclaimer = catchAsync(async (req: Request, res: Response) => {
  const { ...disclaimerData } = req.body
  const result = await RuleService.createDisclaimerToDB(disclaimerData)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Disclaimer created successfully',
    data: result,
  })
})

const getDisclaimer = catchAsync(async (req: Request, res: Response) => {
  const result = await RuleService.getDisclaimerFromDB()

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Disclaimer retrieved successfully',
    data: result,
  })
})

const updateDisclaimer = catchAsync(async (req: Request, res: Response) => {
  const { ...disclaimerData } = req.body
  const result = await RuleService.updateDisclaimerToDB(disclaimerData)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Disclaimer updated successfully',
    data: result,
  })
})

export const RuleController = {
  createDisclaimer,
  getDisclaimer,
  updateDisclaimer,
  createTermsAndCondition,
  getTermsAndCondition,
  updateTermsAndCondition,
}
