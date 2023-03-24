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
            {whatIs ? text.slice(0, 0) : text}
            <span onClick={toggleWhatIs} className="read-or-hide">
                {whatIs ? "What is Fraction?" : " hide"}
            </span>
        </p>
    );
};

const Content = () => {
    return (
        <div className="container" style={{display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 550, fontSize: 17}}>
                <WhatIsFraction>
                Fraction is a web-based application that allows you to upload a 
                receipt from a meal (or other activity!) that was shared between 
                you and your friends and allows you to easily select your items and 
                receive an automatically calculated subtotal. No more awkward 
                gathering around the receipt at the dinner table or trying to take 
                a weighted average of the tax and tip! We hope Fraction makes it 
                easier for you to enjoy that precious time with your friends without 
                worry. 
                </WhatIsFraction>
        </div>
    );
};

export default Content;