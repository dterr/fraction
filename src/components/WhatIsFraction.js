import React, {useState} from "react";
import './App.css';

const WhatIsFraction = ({children}) => {
    const text = children;
    const [whatIs, setWhatIs] = useState(true);
    const toggleWhatIs = () => {
        setWhatIs(!whatIs);
    };
    return (
        <p className="text">
            {whatIs ? text.slice(0, 18) : text}
            <span onClick={toggleWhatIs} className="read-or-hide">
                {whatIs ? "more" : "less"}
            </span>
        </p>
    );
};

const Content = () => {
    return (
        <div className="container">
            <h2>
                <WhatIsFraction>
                What is Fraction? Fraction is a web-based application that allows you to upload a 
                receipt from a meal (or other activity!) that was shared between 
                you and your friends and allows you to easily select your items and 
                receive an automatically calculated subtotal. No more awkward 
                gathering around the receipt at the dinner table or trying to take 
                a weighted average of the tax and tip! We hope Fraction makes it 
                easier for you to enjoy that precious time with your friends without 
                worry. 
                </WhatIsFraction>
            </h2>
        </div>
    );
};

export default Content;