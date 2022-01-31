import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { isLocal } from '../util/isLocal'

export const dynamoClient = new DynamoDBClient({
	region: isLocal() ? 'localhost' : ('us-east-2' as string),
	endpoint: isLocal()
		? 'http://localhost:8000'
		: `https://dynamodb.us-east-2.amazonaws.com`,
})
