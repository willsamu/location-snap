import { apiEndpoint } from '../config'
import { SnapItem, SnapResult } from '../types/Snap'
// import { CreateTodoRequest } from '../types/CreateTodoRequest'
import Axios, { AxiosRequestConfig } from 'axios'
import * as AxiosLogger from 'axios-logger'
import { GetSnapsReqest } from 'types/Requests'
// import { UpdateTodoRequest } from '../types/UpdateTodoRequest'

// const axios = Axios.create()
// axios.interceptors.request.use(AxiosLogger.requestLogger)

export async function getSnaps(idToken: string, params: GetSnapsReqest): Promise<SnapResult[]> {
  if (idToken) {
    console.log(`Fetching Snaps available.. ${idToken.length} | ${JSON.stringify(params)}`)
    try {
      const response = await Axios.get(
        //   const response = await fetch(
        // `${apiEndpoint}/data?range=${params.range}&lat=${params.lat}&lon=${params.lon}`,
        `${apiEndpoint}/todos`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        },
      )
      //   console.log('Respnose: ', response.json())
      //   return response.json()
      console.log('Snaps:', response.data)
      if (response.data.statusCode === 400) return [] // TODO: Proper Error handling
      return response.data.items
    } catch (e) {
      console.log(`Error: ${e}`)
      return [{ id: '-1', distance: -1 }]
    }
  }
  console.log('No token provided')
  return []
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
