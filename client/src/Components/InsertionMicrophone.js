import React from 'react';

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

import { Image } from 'react-bootstrap';

const InsertionMicrophone = (props) => {

  const { transcript } = useSpeechRecognition()

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null
  }

  return (
    <div className={!props.recording ? "" : "box"}>
	    <div className={!props.recording ? "" : "object"}>
			  {/*<div className={!props.recording ? "" : "outline"}></div>*/}
			  <div className={!props.recording ? "" : "outline"} id={!props.recording ? "" : "delayed"}></div>
			  {/*<div className={!props.recording ? "" : "button"}></div>*/}
			  <div className={!props.recording ? "" : "button"} id={!props.recording ? "" : "circlein"}>
          <Image src="icons/insertionBar/mic_icon.svg" className={!props.recording ? "mt-1" : "my-2"}
            width={props.recording ? 35 : 30}
            onTouchStart={() => {
              props.setRecording();
              SpeechRecognition.startListening();
            }}
            onTouchEnd={() => {
              SpeechRecognition.stopListening();
              props.setRecording();
              props.setSpeechToText(transcript);
            }} 
          />
			  </div>
	    </div>
    </div>
    
  );
}
export default InsertionMicrophone;