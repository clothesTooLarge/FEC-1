import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Zoom = ({ showZoom, image, zoomImage }) => {

  return (
    <div onClick={zoomImage} className='zoom-box' style={{display: showZoom}}>
      <img className="img-zoom"  src={image.url}  alt='No Photo to Display'></img>
        {/* <button className='closeButton' type="button" onClick={handleClose}>✖</button> */}
    </div>
  );
};

export default Zoom;