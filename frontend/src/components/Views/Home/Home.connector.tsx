import React, { FunctionComponent, useState, useEffect } from 'react'

import Home from './Home.react'
import { GetSnapsReqest } from 'types/Requests'
import { getSnaps } from 'api/location-snap-api'
import { SnapResult } from 'types/Snap'

type ConnectorProps = {
  auth?: any
}
type ParamsState = GetSnapsReqest

async function fetchSnaps(idToken: string, params: ParamsState, setSnaps: Function) {
  const result = await getSnaps(idToken, params)
  setSnaps(result)
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
    } else console.log('Position: ', params)
  }, [params])

  useEffect(() => {
    if (snaps.length === (0 || 2) && loggedIn) {
      fetchSnaps(auth.getIdToken(), params, setSnaps)
    }
  }, [snaps, loggedIn])
  const handleClick = async () => {
    console.log('Token: ', auth.getIdToken())
    const res = await getSnaps(auth.getIdToken(), params)
    console.log('RES: ', res)
  }

  const homeProps = {
    idToken: auth.getIdToken(),
    snaps,
    handleClick,
    params: { lat: params.lat, lon: params.lon },
  }

  return <Home {...homeProps} />
}

export default ConnectedHome
