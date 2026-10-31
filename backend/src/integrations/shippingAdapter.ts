import { z } from 'zod'

const API_KEY = process.env.POSTNORD_API_KEY ?? ''

const SERVICE_POINTS_URL =
  'https://atapi2.postnord.com/rest/businesslocation/v5/servicepoints/nearest/byaddress'

if (!API_KEY) {
  throw new Error('PostNord är inte konfigurerat. Fyll i POSTNORD_API_KEY i .env.')
}

const PostNordAnswer = z.object({
  servicePointInformationResponse: z.object({
    servicePoints: z.array(
      z.object({
        servicePointId: z.string(),
        name: z.string(),
        visitingAddress: z.object({
          streetName: z.string(),
          streetNumber: z.string().optional(),
          postalCode: z.string(),
          city: z.string(),
        }),
      }),
    ),
  }),
})


export type ServicePoint = { id: string; name: string; address: string }

export async function findServicePoints(postalCode: string): Promise<ServicePoint[]> {
  const params = new URLSearchParams({
    apikey: API_KEY, 
    returnType: 'json',
    countryCode: 'SE',
    postalCode,
    numberOfServicePoints: '5',
  })

  const response = await fetch(`${SERVICE_POINTS_URL}?${params}`, {
    signal: AbortSignal.timeout(5_000),
  })
  if (!response.ok) {
    throw new Error(`PostNord svarade ${response.status}`)
  }

  const answer = PostNordAnswer.safeParse(await response.json())
  if (!answer.success) {
    throw new Error(`Oväntat svar från PostNord: ${z.prettifyError(answer.error)}`)
  }

  return answer.data.servicePointInformationResponse.servicePoints.map((p) => ({
    id: p.servicePointId,
    name: p.name,
    address: `${p.visitingAddress.streetName} ${p.visitingAddress.streetNumber ?? ''}, ${p.visitingAddress.city}`.replace(' ,', ','),
  }))
}