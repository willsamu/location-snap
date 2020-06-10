import React, { FunctionComponent, useState, useEffect } from 'react'

import Home from './Home.react'
import { GetSnapsReqest } from 'types/Requests'
import { getSnaps, accessPicture } from 'api/location-snap-api'
import { SnapResult } from 'types/Snap'

type ConnectorProps = {
  auth?: any
}
type ParamsState = GetSnapsReqest

export type ModalState = {
  open: boolean
  id: string
  counter: number
  url: string
}

const ConnectedHome: FunctionComponent<ConnectorProps> = ({ auth }) => {
  const loggedIn = localStorage.getItem('isLoggedIn') == 'true'
  const [params, setParams] = useState({ lat: 0, lon: 0, range: 10000 })
  const [snaps, setSnaps] = useState([
    { id: '1', distance: 2 },
    { id: '2', distance: 5 },
  ] as SnapResult[])

  const getPosition = async () => {
    await navigator.geolocation.getCurrentPosition(
      (params) =>
        setParams(
          (prevState) =>
            ({
              lat: params.coords.latitude,
              lon: params.coords.longitude,
              range: prevState.range,
            } as ParamsState),
        ),
      (err) => console.log(err),
    )
  }

  useEffect(() => {
    if ((params.lat || params.lat) === 0.0) {
      getPosition()
    }
  }, [params])

  useEffect(() => {
    console.log('Fetch snaps?', loggedIn)
    if (snaps.length === (0 || 2) && loggedIn) {
      console.log('YES!')
      fetchSnaps(auth.getIdToken(), params, setSnaps)
    }
  }, [snaps, loggedIn])

  const [modalState, setModalState] = useState({
    open: false,
    id: '',
    counter: 10,
  } as ModalState)

  const afterOpenModal = () => {
    console.log('CLOSED MODAL!')
    getImageData(auth.getIdToken(), modalState.id, setModalState)
  }

  const closeModal = () => {
    setModalState((oldState) => ({ open: false, id: '', counter: oldState.counter, url: '' }))
    setSnaps((snaps) => snaps.filter(({ id }) => id !== modalState.id))
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
                url: oldState.url,
              } as ModalState),
          ),
        1000,
      )
    } else if (modalState.id) {
      setSnaps((snaps) => snaps.filter(({ id }) => id !== modalState.id))
      setModalState(() => ({ open: false, id: '', counter: 10, url: '' }))
    }
    return () => clearInterval(timer)
  }, [modalState])

  const homeProps = {
    idToken: auth.getIdToken(),
    snaps,
    params: { lat: params.lat, lon: params.lon },
    modalState,
    setModalState,
    afterOpenModal,
    closeModal,
  }

  return <Home {...homeProps} />
}

async function getImageData(idToken: string, pictureId: string, setData: Function) {
  const url = await accessPicture(idToken, pictureId)
  setData((oldState: ModalState) => ({ open: true, id: oldState.id, counter: 10, url }))
}

async function fetchSnaps(idToken: string, params: ParamsState, setSnaps: Function) {
  const result = await getSnaps(idToken, params)
  setSnaps(result)
}

export default ConnectedHome
