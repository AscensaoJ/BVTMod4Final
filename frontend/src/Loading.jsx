import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Loading(props) {
    const navigate = useNavigate();

    // Workaround to have loading screen
    useEffect(() => {
        if(props.loading === false) {
            return navigate('/quiz');
        }
    }, [props.loading])

    return (
        <>
            <img height="30%" src="../Loading.gif" />
        </>
    )
}
