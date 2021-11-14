import React from 'react';

import Camera, { FACING_MODES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

import { Button, Col, Image, Row, } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

class InsertionCamera extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataUri: '',
            destination: '/insertion_camera'
        }
    }

    handleTakingPhoto = (dataUri) => {
        this.setState({ dataUri: dataUri });
    }

    onImgLoad = ({ target: img }) => {
        this.setState({
            width: img.width,
            height: img.height,
        });
    };

    render() {
        var taken = <Image onLoad={this.onImgLoad} src={this.state.dataUri} style={{ width: '100%', borderStyle: 'solid', borderWidth: '2px' }} />
        return (
            <>
                <Redirect to={{ pathname: this.state.destination }} />

                {(this.state.dataUri)
                    ? <div className="lists mt-5">
                        <h3 className="mt-2 text-center">The product is</h3>
                        <h2 className="mb-3 text-center">SPAGHETTI</h2>
                        {/Win32|MacIntel|Linux i686/i.test(navigator.platform)
                            ?
                            <>
                                <div className="mx-auto" style={{ width: '100%' }}>{taken}</div>
                                <div className="mx-auto" style={{ width: '100%' }}><Image src={'./PhotosIngredients/Pasta/spaghettiOrizzontale.jpg'} style={{ width: '100%', borderStyle: 'solid', borderWidth: '2px' }}/></div>
                            </>
                            :
                            <Row className="mx-auto">
                                <Col xs={6} className="px-1"><div className="mx-auto" style={{ width: '100%' }}>{taken}</div></Col>
                                <Col xs={6} className="px-1"><div className="mx-auto" style={{ width: '100%' }}><Image src={'./PhotosIngredients/Pasta/spaghettiVerticale.jpg'} style={{ width: '100%', borderStyle: 'solid', borderWidth: '2px' }}/></div></Col>
                            </Row>}
                        <h4 className="mt-5 mb-3 text-center">Do you want to proceed?</h4>
                        <Row className="justify-content-between mx-auto">
                            <Col className="px-1"><Button variant="outline-success" className="mt-3 px-2 font_text" style={{ width: '100%' }} onClick={() => this.setState({ destination: '/results' }, () => this.props.addIngredient(this.props.spaghetti))}> <h4>YES</h4> <h6>Add the ingredient</h6></Button></Col>
                            <Col className="px-1"><Button variant="outline-danger" className="mt-3 px-2 font_text" style={{ width: '100%' }} onClick={() => this.setState({ dataUri: '' })}> <h4>NO</h4> <h6>Retake the photo</h6> </Button></Col>
                        </Row>
                    </div>
                    : <div style={{ marginRight: '-10px', marginLeft: '-10px', marginTop: '-15px' }} className="mx-auto my-auto d-flex justify-content-center">
                        <Camera
                            onTakePhotoAnimationDone={(dataUri) => { this.handleTakingPhoto(dataUri); }}
                            isFullscreen={true}
                            sizeFactor={1}
                            isMaxResolution={true}
                            idealFacingMode={FACING_MODES.ENVIRONMENT}
                            isImageMirror={false} />
                    </div>}
            </>
        );
    }
}


export default InsertionCamera;
