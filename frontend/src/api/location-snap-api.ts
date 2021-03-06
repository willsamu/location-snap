import { apiEndpoint } from '../config'
import { SnapResult } from '../types/Snap'
import Axios from 'axios'
import * as AxiosLogger from 'axios-logger'
import { GetSnapsReqest, createSnapRequest } from 'types/Requests'
import { createImageResponse } from 'types/Responses'

const axios = Axios.create()
axios.interceptors.request.use(AxiosLogger.requestLogger)

export async function getSnaps(idToken: string, params: GetSnapsReqest): Promise<SnapResult[]> {
  if (idToken) {
    console.log(`Fetching Snaps available.. ${idToken.length} | ${JSON.stringify(params)}`)
    try {
      const response = await axios.get(
        `${apiEndpoint}/data?range=${params.range}&lat=${params.lat}&lon=${params.lon}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        },
      )
      console.log('Snaps:', response)
      if (response.status !== 200) return []
      return response.data.items.sort((a: SnapResult, b: SnapResult) => a.distance - b.distance)
    } catch (e) {
      console.log(`Error: ${e}`)
      return [{ id: '-1', distance: -1 }]
    }
  }
  console.log('No token provided')
  return []
}

export async function createSnap(
  idToken: string,
  newSnap: createSnapRequest,
): Promise<createImageResponse> {
  const response = await axios.put(`${apiEndpoint}/pictures`, JSON.stringify(newSnap), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  })
  console.log('Create Snap Response: ', response)
  return response.data
}

export async function accessPicture(idToken: string, pictureId: string): Promise<string> {
  const response = await axios.post(`${apiEndpoint}/pictures/${pictureId}`, '', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  })
  console.log('Result: ', response.data)
  if (response.status !== 200) return '' //TODO: Error handling
  return response.data.url
}

export async function getUploadUrl(idToken: string, todoId: string): Promise<string> {
  const response = await axios.post(`${apiEndpoint}/todos/${todoId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  const result = await axios.put(uploadUrl, file)
  console.log('Picture Upload: ', result)
}

export async function wakeUpPostgres(): Promise<void> {
  axios.get(`${apiEndpoint}/wakeuppostgres`)
}
