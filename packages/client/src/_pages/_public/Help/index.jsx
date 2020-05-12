import React from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const Help = props => {
  return (
    <div style={{ minHeight: '25vh', margin: '2em auto', padding: '0 4em' }}>
      <h1>Help</h1>
      <hr />
      <ButtonGroup>
        <LinkContainer to="/facility">
          <Button variant="info">Facility</Button>
        </LinkContainer>
        <LinkContainer to="/requestline">
          <Button variant="info">Request Lines</Button>
        </LinkContainer>
      </ButtonGroup>
      <br />
      <br />
      <ButtonGroup>
        <LinkContainer to="/droppoint">
          <Button variant="info">Droppoint</Button>
        </LinkContainer>
        <LinkContainer to="/request">
          <Button variant="info">Requests</Button>
        </LinkContainer>
      </ButtonGroup>
    </div>
  )
}


export default Help