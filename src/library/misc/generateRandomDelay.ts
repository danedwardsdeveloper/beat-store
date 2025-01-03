export default async function generateRandomDelay() {
    const randomDelay = Math.floor(Math.random() * (2978 - 500 + 1)) + 492
    return await new Promise(resolve => setTimeout(resolve, randomDelay))
}