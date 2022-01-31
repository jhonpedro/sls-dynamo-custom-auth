export const isLocal = () => (process.env.IS_OFFLINE === 'true' ? true : false)
