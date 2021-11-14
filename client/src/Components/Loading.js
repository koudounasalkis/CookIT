import React from 'react';
import {Image, Spinner} from 'react-bootstrap';

class Loading extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
  }
    
  render() {
    return (
      <>
        <Image src={'./icons/logo.jpg'} style={{ marginTop: '65%', marginLeft:'25%', marginRight:'25%', marginBottom:'7%', width: '60%'}}/>
        <Spinner animation="border" variant="info" style={{ /*marginTop: '70%', marginBottom:'50%, color: '#f3a42d',*/ marginLeft:'47%'}}>
          <span className="sr-only">Loading...</span>
        </Spinner>
      </>
    );
  }
}


export default Loading;