import middy from '@middy/core'
import { RestAPIHandler } from '@util/types'
import httpJsonBodyParser from '@middy/http-json-body-parser'

export const middify = (handler: RestAPIHandler) =>
	middy(handler as any).use(httpJsonBodyParser())
