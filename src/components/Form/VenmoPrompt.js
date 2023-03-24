import React from "react";
import "./form.css";

// requests the user's venmo account and updates the database 
function VenmoPrompt({data, setData}) {
    return (
        <input type="text" id="name-input" placeholder="What's your Venmo?" 
            value={data.venmo} onChange={(event) => {
                setData({...data, venmo:event.target.value})
            }}/>
    );
}

export default VenmoPrompt;