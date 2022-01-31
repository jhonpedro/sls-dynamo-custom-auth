import { UserRepository } from '@database/repositories/userRepository'
import { APP_SECRET } from '@util/constants'
import { middify } from '@util/lambda'
import { RestAPIHandler } from '@util/types'
import bcryptjs from 'bcryptjs'
import JWT from 'jsonwebtoken'

const createSession: RestAPIHandler<{
	email: string
	password: string
}> = async (event) => {
	const user = await UserRepository.getUser({
		key: 'email',
		value: event.body.email,
	})

	if (!user) {
		return {
			statusCode: 400,
			body: JSON.stringify({ message: 'user does not exists' }),
		}
	}

	const isPasswordRight = await bcryptjs.compare(
		event.body.password,
		user.password
	)

	if (!isPasswordRight) {
		return {
			statusCode: 400,
			body: JSON.stringify({ message: 'wrong password' }),
		}
	}

	const token = JWT.sign({ email: user.email }, APP_SECRET, {
		expiresIn: '2h',
	})

	return { statusCode: 200, body: JSON.stringify({ token }) }
}

export const handler = middify(createSession)
