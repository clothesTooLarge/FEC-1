import React, { useState, useEffect } from 'react';
import Zoom from './Zoom.jsx';


const ProductImages = ({images, image,  imageChange}) => {
    const [showZoom, setShowZoom] = useState('none');

    const thumbnails = () => {
        return images.map((img) => {
            return (
            <div key={Math.random()*10000}><img  className='indThumnails' src={img.thumbnail_url}  onClick={imageChange} alt={'no image'}></img></div>
            )
        })
    }

    const zoomImage = (e) => {
        if( showZoom === 'none') {
            setShowZoom('block');
        } else if ( showZoom === 'block' ) {
            setShowZoom('none');
        }

    }


    return (
        <div className='styleImages'>
            <div className="imgThumbs">{thumbnails()}</div>
            <div className='image-box'>
                <button className='prev-image' onClick={imageChange}>Back</button>
                <img style={{ transform: `scale(${showZoom})` }} onClick={zoomImage} className='currImg' src={image.url} alt={'no image'}></img>
                <button className='next-image' onClick={imageChange}>Next</button>
            </div>

            <Zoom showZoom={showZoom} image={image} zoomImage={zoomImage} style={{display: showZoom}} />

        </div>


    )


}

export default ProductImages;