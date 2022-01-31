import {
	PutItemCommand,
	GetItemCommand,
	ScanCommand,
} from '@aws-sdk/client-dynamodb'
import { dynamoClient } from '@database/dynamoClient'
import { formatDynamoItemResult } from '@util/formatDynamoItemResult'

export interface IUser {
	id: string
	email: string
	name: string
	password: string
	role: string
}

const USER_TABLE_NAME = process.env.USER_TABLE_NAME

export class UserRepository {
	public static async newUser(input: IUser, role: 'user' | 'admin' = 'user') {
		const userAlreadyExists = await UserRepository.getUser({
			key: 'email',
			value: input.email,
		})

		if (userAlreadyExists) {
			return { message: 'user already exists' }
		}

		await dynamoClient.send(
			new PutItemCommand({
				TableName: USER_TABLE_NAME,
				Item: {
					email: { S: input.email },
					password: { S: input.password },
					name: { S: input.name },
					role: { S: role },
				},
			})
		)

		return { email: input.email, name: input.name }
	}

	public static async getUser(input: {
		key: keyof IUser
		value: string
	}): Promise<IUser | null> {
		const response = await dynamoClient.send(
			new GetItemCommand({
				TableName: USER_TABLE_NAME,
				Key: {
					[input.key]: { S: input.value },
				},
			})
		)

		const formated = formatDynamoItemResult(response.Item) as undefined | IUser

		if (!formated) {
			return null
		}

		Object.defineProperty(formated, 'password', {
			enumerable: false,
		})

		return formated
	}

	public static async getAllUsers(): Promise<IUser[]> {
		const response = await dynamoClient.send(
			new ScanCommand({
				TableName: USER_TABLE_NAME,
			})
		)

		return (
			response.Items?.map((item) => {
				const formated = formatDynamoItemResult(item) as unknown as IUser

				Object.defineProperty(formated, 'password', {
					enumerable: false,
				})

				return formated
			}) || []
		)
	}
}
