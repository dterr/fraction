import React from "react";

function TipPrompt({data, setData}) {
    return (
        <input type="number" id="tip-input" placeholder="How much did you tip?" 
            value={data.tip} onChange={(event) => {
                setData({...data, tip:event.target.value})
            }}/>
    );
}

export default TipPrompt;