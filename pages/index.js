import React, { useState, useRef, useEffect } from 'react'
import { Upload, Camera, ErrorDialog, DetectBox, Chip } from '../components'
import styles from '../styles/Home.module.css'
import { Backdrop, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MotorcycleIcon from '@material-ui/icons/Motorcycle';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import DeckIcon from '@material-ui/icons/Deck';
import SportsHandballIcon from '@material-ui/icons/SportsHandball';
import PersonIcon from '@material-ui/icons/Person';
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import PetsIcon from '@material-ui/icons/Pets';

import { PARENT_TYPE, TYPE_TO_COLOR } from '../utils/constants'

const Home = () => {
  //constant
  const filterList = [
    { value: '', icon: undefined },
    { value: PARENT_TYPE.VEHICLE, icon: < MotorcycleIcon /> },
    { value: PARENT_TYPE.OBJECT, icon: < EmojiObjectsIcon /> },
    { value: PARENT_TYPE.FURNITURE, icon: < DeckIcon /> },
    { value: PARENT_TYPE.SPORT, icon: < SportsHandballIcon /> },
    { value: PARENT_TYPE.HUMAN, icon: < PersonIcon /> },
    { value: PARENT_TYPE.ELECTRONIC, icon: < ImportantDevicesIcon /> },
    { value: PARENT_TYPE.ACCESSORY, icon: < LocalMallIcon /> },
    { value: PARENT_TYPE.ANIMAL, icon: < PetsIcon /> },
  ]

  const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },

  }));

  //init
  const classes = useStyles();

  const canvasRef = useRef(null);

  const [imageUrl, setImageUrl] = useState(undefined)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [openError, setOpenError] = useState(false)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [isOpenCamera, setIsOpenCamera] = useState(false);
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    function updateSize() {
      if (canvasRef?.current) {
        setCanvasSize({
          width: canvasRef.current.offsetWidth,
          height: canvasRef.current.offsetHeight
        });
      }
    }
    updateSize();
    window.addEventListener('resize', updateSize);
    window.addEventListener('mousemove', updateSize);
    window.addEventListener('scroll', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', updateSize);
      window.removeEventListener('scroll', updateSize);
    }
  }, [canvasRef, imageUrl, loading]);

  useEffect(() => {
    setFilterType('')
  }, [imageUrl]);

  const changeFilter = (value) => {
    setFilterType(value)
  }

  const handleClose = () => {
    setLoading(false);
  };

  const loadImage = async ({ url, width, height }) => {
    setLoading(true);
    if (url && isBrowser()) {
      const nvision = require('@nipacloud/nvision/dist/browser/nvision');
      const objectDetectionService = await nvision.objectDetection({
        apiKey: process.env.apiKey
      });
      const result = await objectDetectionService.predict({
        rawData: url.replace(/data:image\/(png|jpeg);base64,/, ""),
      })

      if (result?.detected_objects) {
        setData(result.detected_objects);
        setImageSize({ width, height })
        setImageUrl(url);
      } else {
        setOpenError(true);
      }
    }
    setLoading(false);
  }

  const isBrowser = () => typeof window !== "undefined"

  const isIOS = () => {
    if (process.browser) {
      // Client-side-only code
      return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
      ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    }
    return false;
  }

  const filterData = filterType ? data.filter(i => i.parent === filterType) : data;
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <ErrorDialog open={openError} setOpen={setOpenError} text="Cannot detect object." />
        <Backdrop className={classes.backdrop} open={loading} onClick={handleClose}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <div>
          <h1 className={styles.title}>
            OBJECT DETECTION
        </h1>
          <a
            href="https://docs.nvision.nipa.cloud/how-to-guides/detect-objects"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.refDocs}
          >by Nvision </a>
        </div>
        <p className={styles.description}>
          {`Try the API by using your own image. \n
          ( Image must be .jpeg or .png, and no larger than 3 MB. )`}
        </p>
        <div className={styles.grid}>
          <Upload setImageInfo={loadImage} />
          {!isIOS() && 'or'}
          {!isIOS() && <Camera isOpenCamera={isOpenCamera} setIsOpenCamera={setIsOpenCamera} setImageInfo={loadImage} />} {/**TODO: make camera can use in IOS */}
        </div>

        {imageUrl && data.length > 0 && (
          <>
            <div className={styles.grid}>
              <div className={styles.canvas} ref={canvasRef}>
                {filterData.map((item) => {
                  let size = { ...item.bounding_box };
                  size.width = Math.floor((item.bounding_box.right - item.bounding_box.left) / imageSize.width * canvasSize.width);
                  size.height = Math.floor((item.bounding_box.bottom - item.bounding_box.top) / imageSize.height * canvasSize.height);
                  size.top = Math.floor(item.bounding_box.top / imageSize.height * canvasSize.height);
                  size.left = Math.floor(item.bounding_box.left / imageSize.width * canvasSize.width);
                  return <DetectBox
                    key={`${item.bounding_box.left}-${item.bounding_box.top}-${item.confidence}`}
                    size={size}
                    text={item.name}
                    percent={Math.round(item.confidence * 100)}
                    type={item.parent} />
                }
                )}
                <img src={imageUrl} className={styles.uploadPicture} alt="preview" />
              </div>
            </div>
            <div className={styles.grid + ' ' + styles.flexWrap}>
              {filterList.map(item => <Chip
                key={item.value}
                label={`${item.value || 'All'}${filterType === item.value ? ` (${filterData.length})` : ''}`}
                onClick={changeFilter}
                type={item.value}
                icon={item.icon}
                active={filterType === item.value}
                style={{ color: TYPE_TO_COLOR[item.value] ?? 'grey', borderColor: TYPE_TO_COLOR[item.value] ?? 'grey' }}
              />
              )}
            </div>
          </>
        )}

      </main>
    </div >
  )
}

export default Home;