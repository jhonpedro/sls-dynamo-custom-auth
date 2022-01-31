import { UserRepository } from '@database/repositories/userRepository'
import { RestAPIHandler } from '@util/types'
import { middify } from '@util/lambda'

const findAll: RestAPIHandler = async () => {
	const users = await UserRepository.getAllUsers()

	return { statusCode: 200, body: JSON.stringify(users) }
}

export const handler = middify(findAll)
