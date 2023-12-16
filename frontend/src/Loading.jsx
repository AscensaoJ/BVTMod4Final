import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Loading(props) {
    const navigate = useNavigate();

    useEffect(() => {
        if(props.loading === false) {
            console.log('bib');
            return navigate('/quiz');
        }
        console.log(props.loading);
    }, [props.loading])

    return (
        <>
            <img height="30%" src="../Loading.gif" />
        </>
    )
}