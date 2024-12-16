import NodeCache from 'node-cache'

export const queryCache = new NodeCache({ stdTTL: 300 })

// export async function cachedQuery(key, queryFn) {
//   const cachedData = queryCache.get(key)
//   if (cachedData) {
//     console.log(`Cache hit for key: ${key}`)
//     return cachedData
//   }
//
//   console.log(`Cache miss for key: ${key}`)
//   const result = await queryFn()
//   queryCache.set(key, result)
//   return result
// }

export async function cachedQuery(key, queryFn) {
  console.log(`Query executed for key: ${key}`)
  const result = await queryFn()
  return result
}
