export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-06'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token = assertValue(
  "skiAtRblg3mK3mtUqGWVhZt0yxgLbdi78FS3WdccxVlYPbprXplFb99LaDk5FGxIWQ5zivj21rVpqXMd5yWktZUfNFG8kYftOCUjEfjuwOKftconHfy7oZ1fFToybGabfsaeb5umpoXu1BscgGNd6DXpcOBBUmE62WBGcfVpUsjfv2FpFwk2",
   'Missing environment variable: NEXT_API_TOKEN'
 )
 
function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
