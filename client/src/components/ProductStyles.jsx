import React, { useState, useEffect } from 'react';

const Styles = ({style, styles, styleClick}) => {



    const styleRender = () => {
        return styles.map((style) => {
            return (<img key={Math.random()*10000} onClick={styleClick} id={style.style_id} className='style_thumb' src={style.photos[0].thumbnail_url} alt={'no image'}></img>)
        })
    }



    return (
        <div className='style_selector'>
            <h3>Style: {style.name}</h3>
            {styleRender()}
        </div>
    )
}

export default Styles;