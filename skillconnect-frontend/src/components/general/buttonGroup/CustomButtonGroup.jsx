import React, { useState } from "react";
import "./buttonGroup.css";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

export default function CustomButtonGroup({ buttons, changeProjectToggle, projectTypeToggleState }) {

  const handleClick = (event) => {
    changeProjectToggle(event);
  };

  return (
    <div>
      <ButtonGroup variant="text" aria-label="text button group">
        {
          buttons.map((buttonLabel, i) => (
            <Button
              key={i}
              name={buttonLabel}
              onClick={(event) => handleClick(event)}
              variant={buttonLabel == projectTypeToggleState ? 'contained' : 'text'}
              color="success">
              {buttonLabel}
            </Button>
          ))}
      </ButtonGroup>
    </div>
  );
};