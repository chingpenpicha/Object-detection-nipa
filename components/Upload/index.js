import React, { useState } from 'react';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import styles from '../../styles/Home.module.css'
import ErrorModal from '../ErrorDialog';

const MAX_WIDTH = 1048;
const MAX_HEIGHT = 1048;

const getFileNameAndBase64 = (file) => (
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        let { width, height } = img;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
        canvas.width = width;
        canvas.height = height;

        ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg');
        resolve({ name: file.name, url: dataUrl, width, height });
      };
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  })
);

const Upload = ({
  setImageInfo,
}) => {

  const [open, setOpen] = useState(false)
  const [errorText, setErrorText] = useState('')

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      setOpen(true);
      setErrorText('You can only upload JPG/PNG file!');
    }
    const isLt3M = file.size / 1024 / 1024 < 3;
    if (!isLt3M) {
      setOpen(true);
      setErrorText('Image must smaller than 3MB.');
    }
    return isJpgOrPng && isLt3M;
  };

  const handleChange = async (file) => {
    if (file[0] && beforeUpload(file[0])) {
      const res = await getFileNameAndBase64(file[0]);
      if (res) {
        setImageInfo(res);
      }
    }
  };
  return (
    <>
      <label className={styles.card}>
        <span tabIndex="0" role="button">
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { handleChange(e.target.files) }} />
          <AddPhotoAlternateIcon />
        </span>
        <h3>Uploading Image</h3>
      </label>
      <ErrorModal open={open} setOpen={setOpen} text={errorText} />
    </>
  );
};

export default Upload;