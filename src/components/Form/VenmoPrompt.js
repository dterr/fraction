import React from "react";
import "./form.css";

function VenmoPrompt({data, setData}) {
    return (
        <input type="text" id="name-input" placeholder="What's your Venmo?" 
            value={data.venmo} onChange={(event) => {
                setData({...data, venmo:event.target.value})
            }}/>
    );
}

export default VenmoPrompt;