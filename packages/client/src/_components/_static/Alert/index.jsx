import React, { useEffect } from 'react'

import { isNullOrUndefined } from "util"

import { Alert as BAlert } from "react-bootstrap"

const Alert = ({ alert, showAlert, setShowAlert }) => {
  useEffect(() => {
    setShowAlert(!isNullOrUndefined(alert))

    let timer;
    if (!isNullOrUndefined(alert)) {
      timer = setTimeout(() => setShowAlert(), 5000)
    }

    return () => {
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alert])

  return (
    <BAlert
      className={showAlert ? "alert-show" : null}
      variant={isNullOrUndefined(alert) ? "danger" : isNullOrUndefined(alert.variant) ? "warning" : alert.variant}
      onClose={() => setShowAlert(false)}
      dismissible
    >
      {isNullOrUndefined(alert) ? null : (
        <>
          {alert.status ? (
            <>
              <BAlert.Link>Error {alert.status}</BAlert.Link>
              <br />
            </>
          ) : null}
          <span style={{ fontSize: "9pt" }}>
            {typeof alert.message === "string" ? alert.message : "An error occurred"}
          </span>
        </>
      )}
    </BAlert>
  )
}

export default Alert