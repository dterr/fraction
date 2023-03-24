import React from "react";
import "./form.css";

function TipPrompt({data, setData}) {
    return (
        <div>
            <p> If there were any other charges not on the receipt that you would like to add, feel free to add them here!</p>
            <input type="number" id="name-input" placeholder="Tip amount." 
                value={data.tip} onChange={(event) => {
                    setData({...data, tip:event.target.value})
                }}/>
        </div>
    );
}

export default TipPrompt;