import React, { FunctionComponent, useState, useEffect } from 'react'

import COLORS from '../colors'
import { Container, PictureContainer, Button, Image } from './card.styled'
import { FiCamera } from 'react-icons/fi'
import { useFilePicker } from 'react-sage'
import { createSnapRequest } from 'types/Requests'
import { handleUpload } from './settings.helper'

type SettingsProps = {
  idToken: string
  params: createSnapRequest
}

const Settings: FunctionComponent<SettingsProps> = ({ idToken, params }) => {
  const [file, setFile] = useState(undefined as any)
  const [previewUrl, setPreviewUrl] = useState('')
  const { files, onClick, errors, HiddenFileInput } = useFilePicker({
    maxFileSize: 1,
    maxImageWidth: 1000,
    imageQuality: 0.92,
    resizeImage: true,
  })
  useEffect(() => {
    console.log('FILES: ', files)
    if (!files || files.length === 0) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setFile(files[0])
      console.log('Res: ', reader.result)
      reader.result && setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(files[0])
  }, [files])
  const handleClick = () => {
    handleUpload(file, idToken, params)
  }
  return (
    <Container>
      <PictureContainer>
        {file ? (
          <Image src={previewUrl} />
        ) : (
          <FiCamera size={40} color={COLORS.light} title="Add Picture" onClick={onClick} />
        )}
        <HiddenFileInput accept=".jpg, jpeg, .png" multiple={false} />
        <Button disabled={!file} onClick={handleClick}>
          Upload Image
        </Button>
      </PictureContainer>
    </Container>
  )
}

export default Settings
