import React, { useState, useEffect } from 'react';
import ShadedStar from './ShadedStar.jsx';
import percentHelper from '../lib/percentHelper.jsx';

const descripts = {
  'Fit': ['Too tight', 'Perfect', 'Too baggy'],
  'Comfort': ['Uncomfortable', 'Ok', 'Perfect'],
  'Size': ['Too small', 'Perfect', 'Too large'],
  'Width': ['Too narrow', 'Perfect', 'Too wide'],
  'Length': ['Too short', 'Perfect', 'Too long'],
  'Quality': ['Poor', 'Perfect']
}

const ReviewsOver = ({data, total, average, filterFunc}) => {
  const [stars, setStars] = useState(0);

  const [hov, setHov] = useState({1: false, 2: false, 3: false, 4: false, 5: false});


  useEffect(() => {
    setStars(((Math.round(average * 4) / 4).toFixed(2)));

  }, [average]);

  return (
    <div>
      {/* {JSON.stringify(data)} */}
      <div className='averageStars'>
        <div className='averageStarText'>
          {Math.round(average * 100)/100}
        </div>
        <div>
          {'★'.repeat(Math.floor(stars))}
        </div>
        <ShadedStar shade={stars % 1}/>
        <div>
          {'☆'.repeat(5-Math.floor(stars))}
        </div>
      </div>
      <div className='percentRecommended'>
        {Math.floor(Number(data.recommended[true])
          /(Number(data.recommended[true]) + Number(data.recommended[false]))
          * 100) + '% of reviews recommend this product'}
      </div>
      <div className='reviewsByStar'>
        {Object.keys(data.ratings).map((rating) => {
          return (
            <div key={rating} style={{display: 'flex', paddingBottom: 10}}>
              <button
                className='starsTextBtn'
                style={hov[rating] ? {cursor: 'pointer'} : { textDecoration: 'underline' }}
                onMouseEnter={() => {setHov({...hov, [rating]: true})}}
                onMouseLeave={() => {setHov({...hov, [rating]: false})}}
                onClick={() => {filterFunc(rating)}}>
                {rating + ' stars'}
              </button>
              <div style={{flex: '1 1 auto', backgroundColor: 'rgb(87, 245, 78)', height: '15px', width: `${percentHelper(data.ratings[rating], total)}%`}}>

              </div>
              <div style={{flex: '1 1 auto', backgroundColor: 'darkgrey', height: '15px', width: `${percentHelper(data.ratings[rating], total, 1)}%`}}>

              </div>

            </div>
          );
        })}
      </div>
      <div className='ratingDescript'>
        {Object.keys(data.characteristics).map((cName) => {
          return (
            <div key={data.characteristics[cName].id}>
              <div>
                {'' + cName}
              </div>
              {/* <div>
                {'' + data.characteristics[cName].value}
              </div> */}
              <div className='descriptors'>
                {descripts[cName].map((desc, index) => {

                  if (descripts[cName].length === 2) {
                    return (
                      <div key={Math.random()}>
                        <div className='flexrow'>
                          <div style={{margin: '0 4px 10px 0'}} className='descriptorBox1'>

                          </div>
                          <div className='descriptorBox1'>

                          </div>
                        </div>

                        <div className='descriptorText' id={'descriptor1' + index}>
                          {desc}
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div key={Math.random()}>
                        <div style={{margin: '0 0 10px 0'}}>
                          <div className='descriptorBox'>

                          </div>

                        </div>
                        <div className='descriptorText' id={'descriptor' + index}>
                          {desc}
                        </div>
                      </div>
                    )
                  }
                })}
                <div className='triangle' style={{left: `${percentHelper(data.characteristics[cName].value, 5)}%`}}>

                </div>


              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ReviewsOver;