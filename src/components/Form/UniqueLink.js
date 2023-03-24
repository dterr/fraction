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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p>Share this unique link with your friends so you can all select what you ordered! 📤</p>
            <button id="unique-link" onClick={() => copyToClipboard()} >
            {link}
            </button>
            {copySuccess}
        </div>
    );
}

export default UniqueLink;