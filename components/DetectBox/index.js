import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import { TYPE_TO_COLOR } from '../../utils/constants'

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

const useStyles = makeStyles({
  boxStyle: {
    width: ({ width }) => width,
    height: ({ height }) => height,
    left: ({ left }) => left,
    top: ({ top }) => top,
    border: ({ color }) => `2px solid ${color}`,
    position: 'absolute',
  },
  textStyle: {
    color: ({ color }) => color,
    backgroundColor: 'white',
    display: 'flex',
    width: 'max-content',
    fontSize: 12,
    position: 'relative',
    top: -18,
    left: 6,
    padding: '0 4px',
    borderRadius: '2px',
  },
  percentStyle: {
    color: ({ color }) => color,
    backgroundColor: 'white',
    borderRadius: '20px',
    width: '24px !important',
    height: '24px !important',
  },
  textPercentStyle: {
    color: ({ color }) => color,
    fontSize: 8,
  }
});

const DetectBox = ({ text = "", percent = 0, type, size }) => {
  const classes = useStyles({
    ...size,
    color: TYPE_TO_COLOR[type] ?? '#72a9c2',
  });

  return (
    <div className={classes.boxStyle}>
      <div className={classes.textStyle}>
        {text.capitalize()}
      </div>
      <Box top={-39} left={-16} position="relative" display="inline-flex">
        <CircularProgress variant="determinate" value={percent} className={classes.percentStyle} />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
          className={classes.textPercentStyle}
        >
          {`${percent}%`}
        </Box>
      </Box>

    </div>
  );
};

export default DetectBox;