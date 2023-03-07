import React from "react";
import "./form.css";

function TipPrompt({data, setData}) {
    return (
        <input type="number" id="tip-input" placeholder="Tip amount." 
            value={data.tip} onChange={(event) => {
                setData({...data, tip:event.target.value})
            }}/>
    );
}

export default TipPrompt;