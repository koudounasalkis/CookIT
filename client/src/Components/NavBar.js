import React from 'react';

import { Image, Navbar, Nav, Row } from 'react-bootstrap';
import { useHistory } from "react-router-dom";

function NavBar(props) {
    let history = useHistory();

    function handleBack(history) {
        if (props.location === "Results") {
            history.push('/');
            props.clearFilterChoices();
        } else if (props.location === "Category" && props.category) {
            props.setCategory("");
        } else {
            history.goBack();
        }
    }

    function toggleFullScreen() {
        var doc = window.document;
        var docEl = doc.documentElement;
    
        var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
    
        if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            requestFullScreen.call(docEl);
        }
        else {
            cancelFullScreen.call(doc);
        }
    }

    return (
        <Navbar bg="white" variant="white" expand="sm" className="d-flex justify-content-center mx-auto p-0" style={props.location === 'Home' ? { height: '9%' } : props.camera ? { height: '0%' } : { height: '7%' }}  >
            {props.location === 'Home'
                ?
                <Row className="d-flex justify-content-between mx-0 px-0 py-auto mt-3">
                    <Navbar.Brand style={{width:'27%'}} className="px-0 py-0 my-auto">
                        <Image src="icons/logo.jpg" style={{width:'100%'}} onClick={() => toggleFullScreen()} />
                    </Navbar.Brand>
                    <Nav.Item style={{width:'11%'}} className="my-auto">
                        <Image src="icons/user.svg" style={{width:'100%'}}/>
                    </Nav.Item>
                </Row>
                :
                <Row className="d-flex justify-content-between py-2" style={{width:'100%'}}>
                    <Nav.Link className="font_text px-0 py-0" style={{ color: 'rgba(0, 0, 0)' }} onClick={() => handleBack(history)}>
                        <h4>
                            <i className="fas fa-angle-left" />
                            <span className="ml-1">
                                {props.location === "Results" ? "Home" : "Back"}
                            </span>
                        </h4>
                    </Nav.Link>

                    <Nav.Item>
                        <span className="font_text" style={{ fontSize: '120%', width:'100%' }}>{props.category ? props.category : props.location}</span>
                    </Nav.Item>
                </Row>}
        </Navbar>
    );
}

export default NavBar;