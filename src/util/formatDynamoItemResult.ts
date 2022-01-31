import { ItemResponse } from '@aws-sdk/client-dynamodb'

export const formatDynamoItemResult = (
	item: ItemResponse['Item']
): { [k: string]: string } | undefined =>
	item &&
	Object.entries(item).reduce(
		(acc, [currentKey, keyObjValue]) => ({
			...acc,
			[currentKey]: keyObjValue[Object.keys(keyObjValue)[0] as 'S'],
		}),
		{}
	)
