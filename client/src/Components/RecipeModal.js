import React from 'react';

import { Redirect } from 'react-router-dom';
import { Image, Modal, Row, Card, Col } from 'react-bootstrap';
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css';

class RecipeModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            actives: this.props.preparation.map((p) => p.index === 0 ? true : false),
            textShown: false,
            destination: '/recipe'
        }
    }

    setNextActive = (index) => {
        if (index !== this.state.actives.length - 1) {
            let actives = [...this.state.actives];
            actives[index] = false;
            actives[index + 1] = true;
            this.setState({ actives: actives });
        } else {
            this.setState({ destination: '/' });
        }
    }

    setPreviousActive = (index) => {
        if (index !== 0) {
            let actives = [...this.state.actives];
            actives[index] = false;
            actives[index - 1] = true;
            this.setState({ actives: actives });
        }
    }

    setTextShown = () => {
        this.setState({ textShown: !this.state.textShown });
    }


    render() {
        return (<>
            <Redirect to={{ pathname: this.state.destination }} />
            <Modal show={this.props.show} centered onHide={()=> this.props.setShow()}>
                <Modal.Header closeButton onClick={()=> this.props.setShow()}/>
                <Modal.Body>
                    {this.props.preparation.map((p) => {
                        if (!this.state.actives[p.index]) {
                            return null
                        } else {
                            return (
                                <div key={`${p.txt}`}>
                                    <Card className="justify-content-between mx-auto">
                                        <Row className="justify-content-center mx-auto">
                                            {p.pic2
                                                ? <>
                                                    <Col xs={6} className="px-0"><Image src={p.pic1} style={{ width: '100%', borderRightStyle: 'solid', borderWidth: '1px', borderColor: 'white' }} /></Col>
                                                    <Col xs={6} className="px-0"><Image src={p.pic2} style={{ width: '100%', borderLeftStyle: 'solid', borderWidth: '1px', borderColor: 'white' }} /></Col>
                                                </>
                                                : <Image src={this.props.cover} style={{ width: '70%' }} />}
                                        </Row>
                                        {this.state.textShown
                                            ? <div className="bg_caption_steps mx-auto text-center">
                                                <div className="caption_recipes font_text">
                                                    {/*<i className="fas fa-chevron-up" onClick={() => this.setTextShown()}/>*/}
                                                    <Image src={'/icons/up-chevron.png'} style={{width: 20, height: 10}} onClick={() => this.setTextShown()}/>
                                                    <h6>{p.txt}</h6>
                                                </div>
                                            </div>
                                            :
                                            <div style={{ position: 'absolute', width: '100%', textShadow: '0 0 8px #000'}} className="mx-auto text-center">
                                                <h6 className="font_text font-weight-bold" style={{color: 'white', /*textShadow: '0 0 3px #000', fontSize: '12px',*/ marginBottom: '0'}}>READ THE STEPS</h6>
                                                {/*<Image src={'/icons/down-chevron.png'} style={{width: 20, height: 10, marginTop: '-15px'}} onClick={() => this.setTextShown()}/>*/}
                                                <i className="fas fa-chevron-down fa-2x" style={{color: 'white', textShadow: '0 0 3px #000', width: 20, height: 10, marginTop: '-5px', marginLeft: '-8px'}} onClick={() => this.setTextShown()}/>
                                            </div>
                                        }
                                        <Card.Footer>
                                            <div className="font_text">
                                                <AudioPlayer
                                                    src={p.audio}
                                                    showSkipControls={true}
                                                    showJumpControls={false}
                                                    customVolumeControls={[]}
                                                    customAdditionalControls={[]}
                                                    customIcons={{
                                                        next: <i className={p.index !== this.state.actives.length - 1 ? "fas fa-step-forward fa-xs" : "fas fa-home fa-xs"} />,
                                                        previous: <i className={p.index === 0 ? "" : "fas fa-step-backward fa-xs"} />
                                                    }}

                                                    onClickNext={() => { this.setNextActive(p.index); }}
                                                    onClickPrevious={() => { this.setPreviousActive(p.index); }}
                                                />
                                            </div>
                                        </Card.Footer>
                                    </Card>
                                </div>
                            );
                        }
                    })}
                </Modal.Body>
            </Modal>
        </>);
    }
}

export default RecipeModal;