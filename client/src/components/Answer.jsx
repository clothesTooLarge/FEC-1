import React, { useState, useEffect } from 'react'
import { format, parseISO } from 'date-fns';

const Answer = (props) => {
  const [answer, setAnswer] = useState({});
  const [helpful, setHelpful] = useState(false);
  const [reported, setReported] = useState(false);

  useEffect(() => {
    setAnswer(props.answer);
  }, [props]);

  const onClickHelpful = (e) => {
    setHelpful(!helpful);
    props.isHelpful(e, answer.id)
  };

  const onClickReport = (e) => {
    setReported(!reported);
    props.isReported(e, answer.id)
  };

  let date = answer.date ? format(parseISO(answer.date), 'MMMM dd, yyyy') : answer.date

  return (
    <div className='Answer' key={answer.id}>
      <p>{answer.body}</p>
      { answer.photos && answer.photos.map(image => {
        console.log(image);
        //  <img src=`${image}` alt='thumbnail' key={image}/>
      })}
      <span className='Answer-NameDate'>
        By&ensp;
        {
          answer.answerer_name === 'Seller' ?
          <strong>{answer.answerer_name}</strong> :
          <span>{answer.answerer_name}</span>
        }
        , {date}&ensp;|&ensp;</span>
      {!helpful ?
        <span className='Answer-helpful' onClick={onClickHelpful}> Helpful?&ensp;<u>Yes</u> ({answer.helpfulness})</span> :
        <span className='Answer-helpful'> Helpful?&ensp;<u>Yes</u> ({answer.helpfulness + 1})</span>
      }
      {!reported ?
      <span className='Answer-report' onClick={onClickReport}>&ensp;|&ensp;<u>Report</u></span> :
      <span className='Answer-report'>&ensp;|&ensp;<u>Reported</u></span>
      }
  </div>
  );
}

export default Answer