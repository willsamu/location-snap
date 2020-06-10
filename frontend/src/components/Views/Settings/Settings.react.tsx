import React, { FunctionComponent, useState, useEffect } from 'react'

import COLORS from '../colors'
import { Container, PictureContainer, Button } from './card.styled'
import { FiCamera } from 'react-icons/fi'
import { useFilePicker } from 'react-sage'
import { createSnapRequest } from 'types/Requests'
import { handleUpload } from './settings.helper'

type SettingsProps = {
  idToken: string
  params: createSnapRequest
}

const Settings: FunctionComponent<SettingsProps> = ({ idToken, params }) => {
  const [file, setFile] = useState({} as any)
  const { files, onClick, errors, HiddenFileInput } = useFilePicker({
    maxFileSize: 1,
    maxImageWidth: 1000,
    imageQuality: 0.92,
    resizeImage: true,
  })
  useEffect(() => {
    console.log('FILES: ', files)
    if (!files) return
    setFile(files[0] as File)
  }, [files])
  const handleClick = () => {
    handleUpload(file, idToken, params)
  }
  return (
    <Container>
      <PictureContainer>
        <FiCamera size={40} color={COLORS.light} title="Add Picture" onClick={onClick} />
        <HiddenFileInput accept=".jpg, jpeg, .png" multiple={false} />
        <Button disabled={!file} onClick={handleClick}>
          Upload Image
        </Button>
      </PictureContainer>
    </Container>
  )
}

export default Settings
