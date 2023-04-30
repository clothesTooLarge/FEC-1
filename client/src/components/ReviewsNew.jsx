import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormData from 'form-data';


import buildPath from '../lib/getThumbnailPath.js';

const charText = {
  Size: ['A size too small', '1/2 a size too small', 'Perfect', '1/2 a size too big', 'A size too big'],
  Width: ['Too narrow', 'Slightly narrow', 'Perfect', 'Slightly wide', 'Too wide'],
  Comfort: ['Uncomfortable', 'Slightly uncomfortable', 'Ok', 'Comfortable', 'Perfect'],
  Quality: ['Poor', 'Below average', 'What I expected', 'Great', 'Wow!'],
  Length: ['Runs short', 'Runs slightly short', 'Perfect', 'Runs slightly long', 'Runs long'],
  Fit: ['Runs tight', 'Runs slightly tight', 'Perfect', 'Runs loose', 'Runs baggy']

}

const Thumbnails = ({ photos }) => {

  return (
    <div key={Math.random()}>
      {Object.keys(photos).map(photoNum => {
        if (photos[photoNum].loaded) {
          return (<img className='reviewThumbnail' key={photos[photoNum].photo.lastModified} src={buildPath(photos[photoNum].photo.name)}  />)
        } else if (photos[photoNum].photo) {
          return (<div key={Math.random()}>Loading ...</div>)
        }
      })}
    </div>
  );

}

var pCount = 0;
const ReviewsNew = (props) => {
  const [data, setData] = useState(
    {
      rating: 0,
      rec: true,
      chars: props.chars,
      sum: '',
      bod: '',
      email: '',
      nickname: ''
  });

  const [photos, setPhotos] = useState({
    0: {photo: false, loaded: false},
    1: {photo: false, loaded: false},
    2: {photo: false, loaded: false},
    3: {photo: false, loaded: false},
    4: {photo: false, loaded: false},
    5: {photo: false, loaded: false},
    urls: []
  });

  const [checked, setCheck] = useState({
    rec: 1,
    Size: -1,
    Width: -1,
    Comfort: -1,
    Quality: -1,
    Length: -1,
    Fit: -1
  });

  const handleRecChange = (value) => {

    setData(prevData => {
      return { ...prevData, rec: value };
    });

    setCheck(prevCheck => {
      return { ...prevCheck, rec: value}
    });

  };

  const handleRadioChange = (char, value) => {

    setData(prevData => {
      return { ...prevData, chars: { ...prevData.chars, [char]: {value: value, id: prevData.chars[char].id} } };
    });

    setCheck(prevCheck => {
      return { ...prevCheck, [char]: value - 1}
    });

  };

  const starSelect = (event) => {
    const divRect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - divRect.left;
    const mouseY = event.clientY - divRect.top;

    setData(prevData => {
      return { ...prevData, rating: Math.ceil(mouseX/15) }
    })
  }

  const sendReview = (event) => {
    event.preventDefault();
    // Check if all fields are filled out
    const checkFilled = () => {
      for (var char in checked) {
        if (Object.keys(data.chars).indexOf(char) > -1) {
          if (checked[char] === -1) {
            return false;
          }
        }
      }
      return true;
    }
    if (data.email === '' || data.bod === '' || data.rating === 0 || !checkFilled()) {
      alert('Please fill out all required fields.');
      return;
    }

    // Check if the message has at least 10 characters
    if (data.bod.length < 50) {
      alert('Minimum characters for review body not met.');
      return;
    }

    if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))) {
      alert('Email is not in correct format.')
      return;
    }


    const formattedChars = Object.keys(data.chars).reduce((acc, char) => {
      acc[data.chars[char].id] = data.chars[char].value
      return acc;
    }, {})

    const params = {
      "product_id": Number(props.id),
      "rating": data.rating,
      "summary": data.sum,
      "body": data.bod,
      "recommend": data.rec,
      "name": data.nickname,
      "email": data.email,
      "photos": photos.urls,
      "characteristics": formattedChars
    }

    console.log(params);

    let options = {
      'method': 'post',
      'data': params,
      'url': '/addReview'
    }

    axios.request(options).then((res) => {
      console.log(res);
      props.finished();
    }).catch((err) => {
      console.log(err);
    });
  }

  const uploadPhoto = (event) => {
    event.persist();

    console.log(event.target.files);
    setPhotos(prevPhotos => {
      return { ...prevPhotos, [pCount]: {photo: event.target.files[0], loaded: false}}
    })

  }

  useEffect(() => {
    if (photos[pCount].photo) {
      const formData = new FormData();
      formData.append("file", photos[pCount].photo);

      axios.post('/uploadReviewPic', formData).then((res) => {
        console.log(res.data);
        setPhotos(prevPhotos => {
          return { ...prevPhotos, [pCount]: {photo: prevPhotos[pCount].photo, loaded: true}, urls: prevPhotos.urls.concat([res.data]) };
        })

        pCount += 1;
        console.log(res);
      }).catch((err) => {
        console.log(err);
      });
    }
  }, [photos])


  return (
    <div className="reviewsNew">
      {/* {JSON.stringify(props)} */}
      <div className='rnTitle'>
        Write Your Review
      </div>
      <div className='rnSubtitle'>
        {'About the ' + props.name}
      </div>
      <form className='flexcolumn rnContainer'>
        <label className='flexcolumn'>
          Overall rating*
          <div className='starSelect flexrow' onClick={starSelect}>
            <div>
              {'★'.repeat(data.rating)}
            </div>
            <div>
              {'☆'.repeat(5-data.rating)}
            </div>
          </div>
        </label>
        <label className='flexcolumn'>
          Do you recommend this product?*
          <label className='yesNoSelect'>
            Yes
            <input type='radio' checked={checked.rec} onChange={() => {handleRecChange(true)}} value='Yes'/>
          </label>
          <label className='yesNoSelect'>
            No
            <input type='radio' checked={!checked.rec} onChange={() => {handleRecChange(false)}} value='No'/>
          </label>


        </label>
        {Object.keys(data.chars).map((char) => {
          return (
            <label key={Math.random()} className='flexcolumn'>
              <div>
                {char + '*'}
              </div>
              <div className='flexrow charButtonsRow'>
                {charText[char].map((desc, counter) => {
                  return (
                    <div key={Math.random()} className='flexcolumn'>
                      <input
                          className='charButtons' checked={counter === checked[char]} type="radio"
                          onClick={() => {
                            if (counter === checked[char]) {
                              handleRadioChange(char, 0);
                            }
                          }} onChange={() => handleRadioChange(char, counter + 1)}/>
                      <div className='charText'>{desc}</div>
                    </div>
                  )
                })}
              </div>
            </label>
          )
        })}
        <label>
          Review Summary
        </label>
        <textarea
          onChange={(event) => {
            event.persist();
            setData((prevData) => {
              return { ...prevData, sum: event.target.value };
            });
          }}
          maxLength={60} placeholder='Example: Best purchase ever!'>
        </textarea>
        <label>
          Review Body*
        </label>
        <textarea
          onChange={(event) => {
            event.persist();
            setData((prevData) => {
              return { ...prevData, bod: event.target.value };
            });
          }}
          className='rBodBox' placeholder="Enter your text here..."
          maxLength={1000}>

        </textarea>
        <div style={{fontSize: 'x-small'}}>
          {(50-data.bod.length > 0) ?
            'Minimum required characters left: ' + (50-data.bod.length)
            : 'Minimum reached'}
        </div>
        <label className='flexcolumn'>
          Upload your photos
          {pCount < 4 ? <input type='file' onChange={uploadPhoto}></input>: <></>}

          <Thumbnails photos={photos}/>
        </label>
        <label className='flexcolumn'>
          What is your nickname?
          <input
              onChange={(event) => {
                event.persist();
                setData((prevData) => {
                  return { ...prevData, nickname: event.target.value };
                });
              }}
              maxLength={60} placeholder='Example: jackson11!'>

          </input>
          <div style={{fontSize: 'x-small'}}>
            For privacy reasons, do not use your full name or email address
          </div>
        </label>
        <label className='flexcolumn'>
          Email*
          <input
              onChange={(event) => {
                event.persist();
                setData((prevData) => {
                  return { ...prevData, email: event.target.value };
                });
              }}
              maxLength={60} placeholder='Example: jackson11@email.com'>

          </input>
          <div style={{fontSize: 'x-small'}}>
            For authentication purposes, you will not be emailed.
          </div>
        </label>
        <button onClick={sendReview}>
          Submit
        </button>

      </form>
    </div>
  )
}

export default ReviewsNew;