import { SnapItem } from './Snap'

export interface createImageResponse {
  newSnapObject: SnapItem
  uploadUrl: string
}

type responseEvent = {
  generatedFields: any[]
  numberOfRecordsUpdated: number
}

export interface imageData {
  event: responseEvent
  url: string
}
