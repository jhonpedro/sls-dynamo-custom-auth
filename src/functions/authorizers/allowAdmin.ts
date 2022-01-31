import { UserRepository } from '@database/repositories/userRepository'
import { APP_SECRET } from '@util/constants'
import { InlinePolicy, RestAPIAuthorizer } from '@util/types'
import JWT from 'jsonwebtoken'

export const handler: RestAPIAuthorizer = (event, _, cb) => {
	;(async () => {
		if (event.type != 'TOKEN') {
			cb(null, generatePolicy('XXX', {}, 'Deny', event.methodArn))
			return
		}

		const tokenRaw = event.authorizationToken.split(' ')[1]

		if (!tokenRaw) {
			console.log('Missing token')
			cb('Error: missing token')
			return
		}

		try {
			const decodedtoken = JWT.verify(tokenRaw, APP_SECRET) as unknown as {
				email: string
			}

			console.log(decodedtoken)

			const user = await UserRepository.getUser({
				key: 'email',
				value: decodedtoken.email,
			})

			if (!user) {
				cb('Unauthorized')
				return
			}

			if (user.role !== 'admin') {
				cb('Unauthorized')
				return
			}

			const policy = generatePolicy(
				user.email,
				{ email: user.email, name: user.name, role: user.role },
				'Allow',
				event.methodArn
			)

			cb(null, policy)
		} catch (_error) {
			console.error('Invalid token')
			cb('Error: invalid token')
		}
	})()
}

const generatePolicy = (
	principalId: string,
	context: { [k: string]: unknown } = {},
	effect: 'Allow' | 'Deny' = 'Deny',
	resourceArn: string = ''
): InlinePolicy => ({
	principalId,
	policyDocument: {
		Version: '2012-10-17',
		Statement: [
			{
				Action: 'execute-api:Invoke',
				Effect: effect,
				Resource: resourceArn,
			},
		],
	},
	context,
})
