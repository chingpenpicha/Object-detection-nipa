import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TYPE_TO_COLOR } from '../../utils/constants'
import Chip from '@material-ui/core/Chip'

const useStyles = makeStyles({
  chip: {
    margin: 4,
    color: ({ color }) => color,
    borderColor: ({ color }) => color,
  },
  icon: {
    color: ({ color }) => color,
  },
  iconActive: {
    color: 'white !important',
  },
  chipActive: {
    color: 'white !important',
    borderColor: ({ color }) => color,
    backgroundColor: ({ color }) => color,
    '&:focus': {
      backgroundColor: ({ color }) => `${color} !important`,
    },
    '&:hover': {
      backgroundColor: ({ color }) => `${color} !important`,
      opacity: 0.5,
    }
  },
});

const TypeChip = ({ label, onClick, type, active = false, icon }) => {
  const classes = useStyles({
    color: TYPE_TO_COLOR[type] ?? '#444',
  });

  return (
    <Chip
      label={label || 'All'}
      onClick={() => onClick(type)}
      variant="outlined"
      icon={icon ? React.cloneElement(
        icon,
        { className: `${classes.icon}${active ? ` ${classes.iconActive}` : ""}` },
      ) : undefined}
      className={`${classes.chip}${active ? ` ${classes.chipActive}` : ""}`}
    />
  );
};

export default TypeChip;