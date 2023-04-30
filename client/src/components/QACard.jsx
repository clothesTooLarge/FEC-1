import React, { useState, useMemo } from 'react';
import Answer from './Answer.jsx';
import axios from 'axios';

const QACard = ({ id, question, helpfulness, isReported, answers, isHelpful, toggleShowAnswerModal }) => {
  const [moreAnswers, setMoreAnswers] = useState(false);
  const [helpful, setHelpful] = useState(false);


  const onClickHelpful = (e) => {
    setHelpful(!helpful);
    isHelpful(e, id);
  };

  const isHelpfulAnswer = async (e, id) => {
    await axios.put('/answer/helpful', {'answer_id': id});
    console.log('working');
  };

  const isReportedAnswer = async (e, id) => {
    await axios.put('/answer/report', {'answer_id': id });
  };

  const toggleMoreAnswers = (e) => {
    setMoreAnswers(!moreAnswers);
  };

  const answerComponent = Object.values(answers).sort((a, b) => {
    if (a.answerer_name === 'Seller' && b.name === 'Seller') return a.helpful - b.helpful;
    if (a.answerer_name === 'Seller') return -1;
    if (a.answerer_name === 'Seller') return 1;
      // if (a.name !== 'Seller' && b.name !== 'Seller') return a.name - b.name;

    return a.helpful - b.helpful;
  }).map((answer) => {
    return (
        <Answer
          key={answer.id}
          isHelpful={isHelpfulAnswer}
          isReported={isReportedAnswer}
          answer={answer}
        />
      )
  });

  return (
    <div className='QACard'>
      <div className='Question'>
        <div>Q: {question}</div>
        <div className='QA-Option'>
          <span className='Helpful'>Helpful?&ensp;</span>
          {
            helpful === false ?
            <span onClick={onClickHelpful}>&ensp;<u>Yes</u> ({helpfulness})&ensp;|&ensp;</span> :
            <span><u>Yes</u> ({helpfulness + 1})</span>
          }
          <span className='Question-add' onClick={(e) => toggleShowAnswerModal(e, question, id)}> <u>Add answer</u></span>
        </div>
      </div>

      <div className='QA-Answer'>
        A:
        {!moreAnswers ? answerComponent[0] : answerComponent}
        {!moreAnswers && answerComponent[1]}
        {!moreAnswers && answerComponent.length > 2
        && <div className='QA-more' onClick={toggleMoreAnswers}><u>See more answers</u></div>}
        {moreAnswers && <div className='QA-more' onClick={toggleMoreAnswers}><u>Collapse answers</u></div>}
      </div>
      <>_______________________________________________________________________________________________________________________________________________________________________________</>
    </div>
  );
}

export default QACard