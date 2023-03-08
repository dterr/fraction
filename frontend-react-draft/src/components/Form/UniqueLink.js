import React from "react";
import "./form.css";
import { useState } from 'react';

function UniqueLink({link}) {

    const [copySuccess, setCopySuccess] = useState('');

    return (
        <div>
            <p>{link}</p>
            <button onClick={() =>  navigator.clipboard.writeText(link)} >
            Copy
            </button>
        </div>
    );
}

export default UniqueLink;