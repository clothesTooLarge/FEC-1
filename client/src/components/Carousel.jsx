import React, { useState, useEffect } from 'react';

import RelatedProduct from './RelatedProduct.jsx';

const Carousel = (props) => {
  const [array, setArray] = useState([]);
  const [display, setDisplay] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const nextItem = () => {
    if (currentIndex + 1 < array.length) {
      setCurrentIndex(currentIndex++);
    }
  };

  const previousItem = () => {
    if (currentIndex - 1 >= 0) {
      setCurrentIndex(currentIndex--);
    }
  };

  useEffect(() => {
    setArray(props.relatedProductIDs);
    setDisplay(array.slice(0, 5));
    if (array.length > 4) {
      setShowRight(true);
    }
  }, [props]);

  useEffect(() => {
    if (currentIndex < 4) {
      setDisplay(array.slice(0, 5));
    } else if (currentIndex < array.length && currentIndex >= array.length - 4) {
      setDisplay(array.slice(array.length - 4, array.length));
    } else {
      setDisplay(array.slice(currentIndex - 3, currentIndex + 1));
    }
  }, [currentIndex]);

  return (
    <div className='carousel-container' >
      {showLeft ? <button className='carousel-left' onClick={previousItem} >left</button> : null}
      {props.children}
      {/* {display.map((relatedProductID) => {
        return (
          <div key={relatedProductID}>
            <RelatedProduct originalProduct={props.originalProduct} relatedProductID={relatedProductID} setProductID={props.setProductID} />
          </div>
        )
      })} */}
      {/* {showRight ?  <button className='carousel-right' onClick={nextItem} >right</button> : null} */}
    </div>
  )
}

export default Carousel;