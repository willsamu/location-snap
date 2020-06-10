import { createSnapRequest } from 'types/Requests'
import { createSnap, uploadFile } from 'api/location-snap-api'

export const handleUpload: Function = async (
  file: any,
  idToken: string,
  location: createSnapRequest,
  setFile: Function,
) => {
  console.log('U P L O A D: ', location, file)
  if (!file) {
    console.log('No file.. cancel..')
    return
  }
  const snapData = await createSnap(idToken, location)
  await uploadFile(snapData.uploadUrl, file)
  console.log('ADDED SNAP!')
  alert('Sucessfully Added Snap!')
  setFile(null)
}
