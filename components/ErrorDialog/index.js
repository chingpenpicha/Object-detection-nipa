import Snackbar from '@material-ui/core/Snackbar';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  snackBar: {
    backgroundColor: '#f44336',
    color: 'white',
    borderRadius: '4px',
    padding: '4px',

  },
});

const ErrorModal = ({ text, setOpen, open }) => {
  const handleClose = () => {
    setOpen(false);
  };

  const classes = useStyles({});

  return <Snackbar
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    open={open}
    onClose={handleClose}
    className={classes.snackBar}
    autoHideDuration={5000}
  >
    <>
      <ErrorOutlineIcon style={{ marginRight: 4 }} />
      {text}
    </>
  </Snackbar>
}

export default ErrorModal;