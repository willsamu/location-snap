import React, { FunctionComponent, useState, useEffect } from 'react'

import COLORS from '../colors'
import { Container, PictureContainer, Button, Image } from './settings.styled'
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
  const { files, onClick, HiddenFileInput } = useFilePicker({
    maxFileSize: 1,
    maxImageWidth: 1000,
    imageQuality: 0.92,
    resizeImage: true,
  })
  useEffect(() => {
    if (!files || files.length === 0) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setFile(files[0])
      reader.result && setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(files[0])
  }, [files])
  const handleClick = () => {
    handleUpload(file, idToken, params, setFile)
  }
  return (
    <Container>
      <PictureContainer>
        {file ? (
          <Image src={previewUrl} />
        ) : (
          <FiCamera size={40} color={COLORS.light} title="Add Picture" onClick={onClick} />
        )}
        <HiddenFileInput accept=".jpg, .jpeg, .png" multiple={false} />
        <Button disabled={!file} onClick={handleClick}>
          Upload Image
        </Button>
      </PictureContainer>
    </Container>
  )
}

export default Settings
