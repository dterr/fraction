import React from "react";
import "./form.css";

// takes in the user's name and adds it to the database 
function NamePrompt({data, setData}) {
    return (
        <input type="text" id="name-input" placeholder="What's your name?" 
            value={data.name} onChange={(event) => {
                setData({...data, name:event.target.value})
            }}/>
    );
}

export default NamePrompt;