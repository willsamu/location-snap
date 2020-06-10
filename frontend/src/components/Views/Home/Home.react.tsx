import React, { FunctionComponent, useState, useEffect } from 'react'
import Modal from 'react-modal'

import { Container } from './home.styled'
import Card from '../Card/Card.react'
import { SnapResult } from '../../../types/Snap'
import Settings from '../Settings/Settings.react'
import { createSnapRequest } from 'types/Requests'

Modal.setAppElement('#root')

type HomeProps = {
  idToken: string
  snaps: SnapResult[]
  handleClick: any
  params: createSnapRequest
}

export type ModalState = {
  open: boolean
  id: string
  counter: number
}

const Home: FunctionComponent<HomeProps> = ({ idToken, snaps, handleClick, params }) => {
  const settingsProps = { idToken, params }

  const [modalState, setModalState] = useState({
    open: false,
    id: '',
    counter: 10,
  } as ModalState)
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  }
  function afterOpenModal() {
    console.log('CLOSED MODAL!')
  }

  function closeModal() {
    setModalState((oldState) => ({ open: !oldState.open, id: oldState.id, counter: 10 }))
  }
  useEffect(() => {
    let timer = 0
    if (modalState.open && modalState.counter > 0) {
      timer = setInterval(
        () =>
          setModalState(
            (oldState: ModalState) =>
              ({
                counter: oldState.counter - 1,
                open: oldState.open,
                id: oldState.id,
              } as ModalState),
          ),
        1000,
      )
    } else if (modalState.open) setModalState((oldState) => ({ open: false, id: '', counter: 10 }))
    return () => clearInterval(timer)
  }, [modalState])

  return (
    <Container>
      <Modal
        isOpen={modalState.open}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <p>HELLO WORLD</p>
        <p>{modalState.counter}</p>
      </Modal>
      <Settings {...settingsProps} />
      <button onClick={handleClick}>Press me</button>
      {snaps.map((item) => (
        <Card key={item.id} id={item.id} distance={item.distance} setModalState={setModalState} />
      ))}
    </Container>
  )
}

export default Home
