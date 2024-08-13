import { Model } from 'mongoose'

export type IRule = {
  content: string
  type: 'terms' | 'disclaimer'
}

export type RuleModel = Model<IRule, Record<string, unknown>>
