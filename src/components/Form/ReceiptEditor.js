import React from "react";
import { useState } from 'react';
import "./form.css";

// allows the user to edit the receipt information manually 
function ReceiptEditor({ocrResults, saveApprovedReceipt}) {
    const [editedData, setEditedData] = useState(ocrResults);
    console.log("The ocrResults %O", editedData);

    const handleInputChange = (field, index, event) => {
        const newData = {...editedData};
        newData.lineItems[index][field] = event.target.value;
        setEditedData(newData);
    };
    
      return (
        <div>
          <p>Here's what our AI found from your receipt. 🤖</p>
          <p>If you see any errors, correct them here. ✍️</p>
          <div className="establishment">
            <label>Establishment:</label>
            <input
                type="text"
                value={editedData.establishment}
                onChange={(e) =>
                setEditedData({ ...editedData, establishment: e.target.value })
                }
            />
            </div>
          {editedData.lineItems.map((item, index) => (
            <div key={index} className="receipt-item">
              <label>Description:</label>
              <input
                type="text"
                value={item.desc}
                onChange={(e) => handleInputChange('desc', index, e)}
              />
            </div>
          ))}
          <button id="next-button" onClick={() => saveApprovedReceipt(editedData)}>Save</button>
        </div>
      );
    }
    
    export default ReceiptEditor;