import React from "react";
import "./form.css";

function TipPrompt({data, setData}) {
    return (
        <div>
            <input type="number" id="name-input" placeholder="Tip amount." 
                value={data.tip} onChange={(event) => {
                    setData({...data, tip:event.target.value})
                }}/>
        </div>
    );
}

export default TipPrompt;