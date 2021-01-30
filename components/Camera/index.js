import React, { useState, useRef, useCallback } from 'react'
import Webcam from "react-webcam";
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { Button, Dialog, AppBar, Toolbar, IconButton, Slide } from '@material-ui/core';
import SwitchCameraIcon from '@material-ui/icons/SwitchCamera';
import CloseIcon from '@material-ui/icons/Close';
import styles from '../../styles/Home.module.css';
import cameraStyles from './camera.module.css';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const WebcamComponent = ({ isOpenCamera = false, setIsOpenCamera, setImageInfo }) => {
  const [imageSrc, setImageSrc] = useState(undefined)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })

  const webcamRef = useRef(null);

  const capture = useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      const width = parseInt(webcamRef.current.canvas.attributes.width.value, 10)
      const height = parseInt(webcamRef.current.canvas.attributes.height.value, 10)
      setImageSize({ width, height })
      setImageSrc(imageSrc);
    },
    [webcamRef]
  );
  const [videoConstraints, setVideoConstraints] = useState({ facingMode: 'user' })

  const toggleCamera = () => {
    setVideoConstraints((videoConstraints.facingMode === 'user') ?
      { facingMode: { exact: "environment" } } :
      { facingMode: "user" }
    );
  }

  const retakePhoto = () => {
    setImageSrc(undefined);
  };

  const handleClose = () => {
    setIsOpenCamera(false);
  };

  const sendImageBack = () => {
    setImageInfo({ url: imageSrc, ...imageSize });
    setImageSrc(undefined);
    handleClose();
  };

  return (
    <>
      <div className={styles.card} onClick={() => setIsOpenCamera(true)} >
        <PhotoCamera />
        <h3>Taking a picture</h3>
      </div>
      {isOpenCamera && <Dialog fullScreen className={cameraStyles.blackBackground} open={isOpenCamera} onClose={handleClose} TransitionComponent={Transition}>
        <div className={cameraStyles.divCenter}>
          {!imageSrc && <Webcam
            screenshotFormat="image/jpeg"
            height='auto' width='100%'
            audio={false}
            videoConstraints={videoConstraints}
            ref={webcamRef} />}
          {imageSrc && <img src={imageSrc} alt="preview" width='100%' />}
        </div>

        <AppBar className={cameraStyles.appBar}>
          <Toolbar>
            <IconButton className={cameraStyles.desktop} edge="start" color="inherit" onClick={handleClose} aria-label="close" style={{ justifySelf: 'start' }}>
              <CloseIcon />
            </IconButton>
            {!imageSrc && <div className={cameraStyles.grid}>
              <IconButton edge="start" className={cameraStyles.mobile} color="inherit" onClick={handleClose} aria-label="close" style={{ justifySelf: 'start' }}>
                <CloseIcon />
              </IconButton>
              <IconButton aria-label="upload picture" className={cameraStyles.mobile} onClick={capture} component="span" style={{ justifySelf: 'center' }}>
                <PhotoCamera />
              </IconButton>
              <IconButton aria-label="swap picture" onClick={toggleCamera} className={cameraStyles.mobile} component="span" style={{ justifySelf: 'end' }}>
                <SwitchCameraIcon />
              </IconButton>
            </div>}
            {imageSrc && <div className={cameraStyles.flexSpaceBetween + ' ' + cameraStyles.mobile}>
              <Button size="large" onClick={retakePhoto}>
                Retake
              </Button>
              <Button size="large" onClick={sendImageBack}>
                Use photo
              </Button>
            </div>}
          </Toolbar>
        </AppBar>
        <Toolbar className={cameraStyles.toolbar + ' ' + cameraStyles.desktop}>
          {!imageSrc && <div className={cameraStyles.grid}>
            <div >
              .
            </div>
            <IconButton aria-label="upload picture" onClick={capture} component="span" style={{ justifySelf: 'center', color: 'white' }}>
              <PhotoCamera />
            </IconButton>
            <IconButton aria-label="upload picture" onClick={toggleCamera} component="span" style={{ justifySelf: 'end', color: 'white' }} >
              <SwitchCameraIcon />
            </IconButton>
          </div>
          }
          {imageSrc && <div className={cameraStyles.flexSpaceBetween} >
            <Button size="large" style={{ color: "white" }} onClick={retakePhoto}>
              Retake
              </Button>
            <Button size="large" style={{ color: "white" }} onClick={sendImageBack}>
              Use photo
              </Button>
          </div>}
        </Toolbar>
      </Dialog>}
    </>);
}
export default WebcamComponent;