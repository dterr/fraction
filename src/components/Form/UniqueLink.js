import React from "react";
import "./form.css";
import { useState } from 'react';

function UniqueLink({link}) {
    const [copySuccess, setCopySuccess] = useState('');

    function copyToClipboard() {
        navigator.clipboard.writeText(link);
        setCopySuccess("Copied to clipboard!");
    }

    return (
        <div>
            <button id="unique-link" onClick={() => copyToClipboard()} >
            {link}
            </button>
            {copySuccess}
        </div>
    );
}

export default UniqueLink;