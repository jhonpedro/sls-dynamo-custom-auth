export const APP_SECRET = process.env.APP_SECRET as string

if (!APP_SECRET) {
	throw new Error('No secret provided in env')
}
