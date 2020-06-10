import React, { FunctionComponent, useState, useEffect } from 'react'
import Modal from 'react-modal'
import { SpinnerRoundFilled } from 'spinners-react'

import { Container, Image, MessageContainer, Message, Name, customStyles } from './home.styled'
import Card from '../Card/Card.react'
import { SnapResult } from '../../../types/Snap'
import Settings from '../Settings/Settings.react'
import { createSnapRequest } from 'types/Requests'
import { ModalState } from './Home.connector'

Modal.setAppElement('#root')

type HomeProps = {
  idToken: string
  snaps: SnapResult[]
  params: createSnapRequest
  modalState: ModalState
  setModalState: Function
  afterOpenModal: any
  closeModal: any
}

const Home: FunctionComponent<HomeProps> = ({
  idToken,
  snaps,
  params,
  modalState,
  setModalState,
  afterOpenModal,
  closeModal,
}) => {
  const settingsProps = { idToken, params }

  return (
    <Container>
      {idToken ? (
        <div>
          <Modal
            isOpen={modalState.open}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            {modalState.url ? <Image src={modalState.url} /> : <SpinnerRoundFilled />}
          </Modal>
          <Settings {...settingsProps} />
          {snaps.map((item) => (
            <Card
              key={item.id}
              id={item.id}
              distance={item.distance}
              setModalState={setModalState}
            />
          ))}
        </div>
      ) : (
        <MessageContainer>
          <Message>Please Login To Acces </Message>
          <Name>Location-Snap!</Name>
        </MessageContainer>
      )}
    </Container>
  )
}

export default Home
