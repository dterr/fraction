import React from "react";
import "./form.css";
import { useState } from 'react';

function UniqueLink({link}) {

    return (
        <div>
            <button id="unique-link" onClick={() =>  navigator.clipboard.writeText(link)} >
            {link}
            </button>
        </div>
    );
}

export default UniqueLink;