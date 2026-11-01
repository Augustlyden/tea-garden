import { z } from 'zod'
import { NoServicePointsError } from '../utils/error'

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

  if (response.status === 400) {
    throw new NoServicePointsError()
  }
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

const TRANSIT_TIME_URL =
  'https://atapi2.postnord.com/rest/transport/v2/transittime/addresstoaddress' 
const SHOP_POSTAL_CODE = '11138'

const TransitTimeAnswer = z.array(
  z.object({
    service: z.object({
      basicServiceCode: z.string(),
      additionalServices: z.unknown().optional(),
    }),
    estimatedTimeOfArrival: z
      .object({ timeOfArrival: z.string().optional() })
      .optional(),
    isBookable: z.boolean(),
  }),
)

export type DeliveryEstimates = { homeDelivery: string | null; servicePoint: string | null }

function stockholmNow(): string {
  return new Date()
    .toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' })
    .replace(' ', 'T')
    .slice(0, 16)
}

export async function fetchDeliveryEstimates(postalCode: string): Promise<DeliveryEstimates> {
  const params = new URLSearchParams({
    apikey: API_KEY,
    startTime: stockholmNow(),
    originCountryCode: 'SE',
    originPostalCode: SHOP_POSTAL_CODE,
    destinationCountryCode: 'SE',
    destinationPostalCode: postalCode,
  })

  const response = await fetch(`${TRANSIT_TIME_URL}?${params}`, {
    signal: AbortSignal.timeout(5_000),
  })
  if (!response.ok) {
    throw new Error(`PostNord svarade ${response.status}`)
  }

  const answer = TransitTimeAnswer.safeParse(await response.json())
  if (!answer.success) {
    throw new Error(`Oväntat svar från PostNord: ${z.prettifyError(answer.error)}`)
  }

  const arrivalDate = (serviceCode: string): string | null => {
    const match = answer.data.find(
      (t) => t.service.basicServiceCode === serviceCode && !t.service.additionalServices && t.isBookable,
    )
    return match?.estimatedTimeOfArrival?.timeOfArrival?.slice(0, 10) ?? null
  }

  return { homeDelivery: arrivalDate('17'), servicePoint: arrivalDate('19') }
}