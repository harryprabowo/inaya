import React from 'react'
import { Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const About = props => {
  return (
    <div style={{ minHeight: '25vh', textAlign: 'center', margin: '2em auto', padding: '0 4em' }}>
      <h1>About page</h1>
      <hr />
      <LinkContainer to="/facility">
        <Button variant="info">Facility</Button>
      </LinkContainer>
      <br />
      <br />
      <LinkContainer to="/droppoint">
        <Button variant="info">Droppoint</Button>
      </LinkContainer>
    </div>
  )
}


export default About