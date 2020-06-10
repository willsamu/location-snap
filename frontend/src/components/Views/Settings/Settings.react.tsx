import React, { FunctionComponent, useState, useEffect } from 'react'

import COLORS from '../colors'
import { Container, PictureContainer, Button } from './card.styled'
import { FiCamera } from 'react-icons/fi'
import { useFilePicker } from 'react-sage'
import { GetSnapsReqest } from 'types/Requests'

type SettingsProps = {
  auth: any
  params: GetSnapsReqest
}

const Settings: FunctionComponent<SettingsProps> = ({ auth, params }) => {
  const [file, setFile] = useState({} as File)
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
  return (
    <Container>
      <PictureContainer>
        <FiCamera size={40} color={COLORS.light} title="Add Picture" onClick={onClick} />
        <HiddenFileInput accept=".jpg, jpeg, .png" multiple={false} />
        <Button>Upload Image</Button>
      </PictureContainer>
    </Container>
  )
}

export default Settings
