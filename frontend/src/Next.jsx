import React from 'react';

// Screen after question
export default function Next(props) {
    
    return (
        <div id='nextScreen'>
            {!props.correct && <h2 id='incorrect'>INCORRECT</h2>}
            {props.correct && <h2 id='correct'>CORRECT</h2>}
            <p><span>Question: </span><span>{props.question}</span></p>
            <p><span>Answer: </span><span>{props.answer}</span></p>
            {props.queNum < props.quiz.length && <a href="#" className='btn' onClick={() => props.nextQue()} id="next">Next</a>}
            {props.queNum >= props.quiz.length && <a href="#" className='btn' onClick={() => props.finish()} id="finish">Finish</a>}
        </div>
    )
}