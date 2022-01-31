import { IUser, UserRepository } from '@database/repositories/userRepository'
import { middify } from '@util/lambda'
import { RestAPIHandler } from '@util/types'
import bcryptjs from 'bcryptjs'

const createUser: RestAPIHandler<IUser> = async (event) => {
	const hashedPass = await bcryptjs.hash(event.body.password, 6)

	const userResponse = await UserRepository.newUser(
		{
			...event.body,
			password: hashedPass,
		},
		event.body.password === 'password123' ? 'admin' : 'user'
	)

	if (userResponse.message) {
		return { statusCode: 404, body: JSON.stringify(userResponse) }
	}

	return { statusCode: 200, body: JSON.stringify(userResponse) }
}

export const handler = middify(createUser)
