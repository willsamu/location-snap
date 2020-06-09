import React, { FunctionComponent, useState, useEffect } from 'react'

import Home from './Home.react'
import { GetSnapsReqest } from 'types/Requests'
import { getSnaps } from 'api/location-snap-api'

type ConnectorProps = {
  auth?: any
}
type ParamsState = GetSnapsReqest

const ConnectedHome: FunctionComponent<ConnectorProps> = ({ auth }) => {
  const [params, setParams] = useState({ lat: 0, lon: 0, range: 1000 })
  const [snaps, setSnaps] = useState([
    // { id: '1', distance: 2 },
    // { id: '2', distance: 5 },
  ])
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
  const loggedIn = localStorage.getItem('isLoggedIn') == 'true'
  useEffect(() => {
    if (snaps.length === 0 && loggedIn) {
      const result = getSnaps(auth.getIdToken(), params)
    }
  }, [snaps, loggedIn])
  const handleClick = async () => {
    console.log('Token: ', auth.getIdToken())
    const res = await getSnaps(auth.getIdToken(), params)
    console.log('RES: ', res)
  }

  const homeProps = {
    auth,
    snaps,
    handleClick,
  }

  return <Home {...homeProps} />
}

export default ConnectedHome
