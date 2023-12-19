import React, { useEffect, useState } from 'react';

export default function Question(props){

    return (
        <div id='container'>
            <p id='question'>{props.question}</p>
            <div className='btn-grp'>
                <div className='sub-grp'>
                    <button id='0' className='answers btn' value='0' onClick={e => props.checkAnswer(e.target.value)}>{props.answers[0]}</button>
                    <button id='1' className='answers btn' value='1' onClick={e => props.checkAnswer(e.target.value)}>{props.answers[1]}</button>
                </div>
                <div className='sub-grp'>
                    <button id='2' className='answers btn' value='2' onClick={e => props.checkAnswer(e.target.value)}>{props.answers[2]}</button>
                    <button id='3' className='answers btn' value='3' onClick={e => props.checkAnswer(e.target.value)}>{props.answers[3]}</button>
                </div>
            </div>
        </div>
    );
}
