import {
	APIGatewayEvent,
	APIGatewayEventRequestContext,
	APIGatewayAuthorizerEvent,
} from 'aws-lambda'

export type RestAPIHandler<T = any> = (
	event: Omit<APIGatewayEvent, 'body'> & {
		body: T
	},
	context: APIGatewayEventRequestContext
) => Promise<{ statusCode: number; body: string }>

export type RestAPIAuthorizer = (
	event: APIGatewayAuthorizerEvent,
	context: unknown,
	callback: (err: any, policy?: InlinePolicy) => void
) => void

export type InlinePolicy = {
	principalId: string
	policyDocument: {
		Version: string
		Statement: {
			Action: string
			Effect: 'Allow' | 'Deny'
			Resource: string
		}[]
	}
	context: {
		[k: string]: unknown
	}
}
