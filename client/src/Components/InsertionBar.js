import React from 'react';

import { Image, Form, FormControl, Badge, Row, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import InsertionMicrophone from './InsertionMicrophone';

class InsertionBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            destination: '',
            recording: false,
            firstTimeCategory: true
        }
    }

    componentDidMount() {
        if (localStorage.getItem('firstTimeCategory') === 'false') this.setState({firstTimeCategory: false})
        document.addEventListener('contextmenu', (e) => { e.preventDefault(); });
        document.addEventListener('keydown', (e) => {if (e.code === 'Enter') e.preventDefault()});
    };

    setRecording = () => {
        this.setState({ recording: !this.state.recording });
    }

    toggleFirstTimeCategory = () => {
        localStorage.setItem('firstTimeCategory', JSON.stringify(false));
        this.setState({firstTimeCategory: false});
    }

    render() {
        return (
            <Row style={{ marginLeft: '-12px', marginRight: '-12px' }}>
                <Badge pill className="insertion_style mt-3" style={{ /*marginLeft: '-15px', marginRight: '-15px', */width: '100%' }}>
                    <Form className="my-1 mx-auto">
                        <Form.Row className="justify-content-between mx-auto">
                            <FormControl style={this.state.recording ? { borderRadius: '15px', width: '80%', fontFamily: 'Lato' } : { borderRadius: '15px', width: '60%', fontFamily: 'Lato' }}
                                type="text" placeholder="Insert ingredient" name="text"
                                value={this.props.text || ''} 
                                onChange={(ev) => this.props.updateKeyboardField(ev.target.name, ev.target.value)} 
                                autoComplete="off" 
                                />
                            {!this.state.recording && <OverlayTrigger
                                placement={"top"}
                                show={this.state.firstTimeCategory}
                                overlay={
                                    <Tooltip id={"cat"} onClick={() => this.toggleFirstTimeCategory()}>
                                        <div>Insertion </div>
                                        <div>by category</div>
                                    </Tooltip>
                                }>
                                <Link to='/insertion_category' ref={"cat"} className="ml-3 my-1"><Image src="icons/insertionBar/food_icon.png" width={30} /></Link>
                            </OverlayTrigger>}
                            {!this.state.recording && <Link to='/insertion_camera' className="mx-auto my-1"><Image src="icons/insertionBar/camera_icon.svg" width={30} /></Link>}
                            <InsertionMicrophone setSpeechToText={this.props.setSpeechToText} setRecording={this.setRecording} recording={this.state.recording} />

                        </Form.Row>
                    </Form>
                </Badge>
            </Row>
        );
    }
}

export default InsertionBar;
