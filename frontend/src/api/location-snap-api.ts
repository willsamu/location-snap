import { apiEndpoint } from '../config'
import { SnapItem, SnapResult } from '../types/Snap'
import Axios, { AxiosRequestConfig } from 'axios'
import * as AxiosLogger from 'axios-logger'
import { GetSnapsReqest } from 'types/Requests'

const axios = Axios.create()
axios.interceptors.request.use(AxiosLogger.requestLogger)

export async function getSnaps(idToken: string, params: GetSnapsReqest): Promise<SnapResult[]> {
  if (idToken) {
    console.log(`Fetching Snaps available.. ${idToken.length} | ${JSON.stringify(params)}`)
    try {
      const response = await axios.get(`${apiEndpoint}/data?range=${params.range}&lat=34&lon=35`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      })
      console.log('Snaps:', response.data)
      if (response.data.statusCode === 400) return [] // TODO: Proper Error handling
      return response.data.sort((a: SnapResult, b: SnapResult) => a.distance - b.distance) //TODO: return array as item key
    } catch (e) {
      console.log(`Error: ${e}`)
      return [{ id: '-1', distance: -1 }]
    }
  }
  console.log('No token provided')
  return []
  //   TODO:
  // HANDLE {
  //     "message": "Endpoint request timed out"
  // }
}

// export async function createTodo(idToken: string, newTodo: CreateTodoRequest): Promise<Todo> {
//   const response = await Axios.post(`${apiEndpoint}/todos`, JSON.stringify(newTodo), {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${idToken}`,
//     },
//   })
//   return response.data.item
// }

// export async function patchTodo(
//   idToken: string,
//   todoId: string,
//   updatedTodo: UpdateTodoRequest,
// ): Promise<void> {
//   await Axios.patch(`${apiEndpoint}/todos/${todoId}`, JSON.stringify(updatedTodo), {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${idToken}`,
//     },
//   })
// }

// export async function deleteTodo(idToken: string, todoId: string): Promise<void> {
//   await Axios.delete(`${apiEndpoint}/todos/${todoId}`, {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${idToken}`,
//     },
//   })
// }

// export async function getUploadUrl(idToken: string, todoId: string): Promise<string> {
//   const response = await Axios.post(`${apiEndpoint}/todos/${todoId}/attachment`, '', {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${idToken}`,
//     },
//   })
//   return response.data.uploadUrl
// }

// export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
//   await Axios.put(uploadUrl, file)
// }

export {}
