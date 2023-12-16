import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Handles how many questions the user would like to answer
export default function QueSetup(props) {
    const navigate = useNavigate();

    function start(value) {
        props.setQueNum(value);
        return navigate('/quiz/loading');
    }

    return (
        <div id='category' className='btn-grp'>
            <p id="head">Number of Questions</p>
            <div className='quad'>
                <span className='pair'>
                    <button onClick={e => start(e.target.value)} value="5">5</button>
                    <button onClick={e => start(e.target.value)} value="6">6</button>
                </span>
                <span className='pair'>
                    <button onClick={e => start(e.target.value)} value="7">7</button>
                    <button onClick={e => start(e.target.value)} value="8">8</button>
                </span>
            </div>
            <div className='quad'>
                <span className='pair'>
                    <button onClick={e => start(e.target.value)} value="9">9</button>
                    <button onClick={e => start(e.target.value)} value="10">10</button>
                </span>
                <span className='pair'>
                    <button onClick={e => start(e.target.value)} value="11">11</button>
                    <button onClick={e => start(e.target.value)} value="12">12</button>
                </span>
            </div>
            <div className='quad'>
                <span className='pair'>
                    <button onClick={e => start(e.target.value)} value="13">13</button>
                    <button onClick={e => start(e.target.value)} value="14">14</button>
                </span>
                <span className='pair'>
                    <button onClick={e => start(e.target.value)} value="15">15</button>
                    <button onClick={e => start(e.target.value)} value="16">16</button>
                </span>
            </div>
            {/* <div className='col'>
                <button onClick={e => start(e.target.value)} value="5">5</button>
                <button onClick={e => start(e.target.value)} value="9">9</button>
                <button onClick={e => start(e.target.value)} value="13">13</button>
            </div>
            <div className='col'>
                <button onClick={e => start(e.target.value)} value="6">6</button>
                <button onClick={e => start(e.target.value)} value="10">10</button>
                <button onClick={e => start(e.target.value)} value="14">14</button>
            </div>
            <div className='col'>
                <button onClick={e => start(e.target.value)} value="7">7</button>
                <button onClick={e => start(e.target.value)} value="11">11</button>
                <button onClick={e => start(e.target.value)} value="15">15</button>
            </div>
            <div className='col'>
                <button onClick={e => start(e.target.value)} value="8">8</button>
                <button onClick={e => start(e.target.value)} value="12">12</button>
                <button onClick={e => start(e.target.value)} value="16">16</button>
            </div> */}
        </div>
    )
}