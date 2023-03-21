import React from "react";
import "./form.css";

function ReceiptEditor({ocrResults, saveApprovedReceipt}) {
    const [editedData, setEditedData] = useState(ocrResults);

    const handleInputChange = (field, index, event) => {
        const newData = [...editedData];
        newData[index][field] = event.target.value;
        setEditedData(newData);
      };
    
      return (
        <div>
          <h2>Edit Receipt</h2>
          {editedData.map((item, index) => (
            <div key={index} className="receipt-item">
              <label>Description:</label>
              <input
                type="text"
                value={item.desc}
                onChange={(e) => handleInputChange('desc', index, e)}
              />
              <label>Quantity:</label>
              <input
                type="number"
                value={item.qty}
                onChange={(e) => handleInputChange('qty', index, e)}
              />
              <label>Price:</label>
              <input
                type="number"
                value={item.price}
                onChange={(e) => handleInputChange('price', index, e)}
              />
              <label>Line Total:</label>
              <input
                type="number"
                value={item.lineTotal}
                onChange={(e) => handleInputChange('lineTotal', index, e)}
              />
            </div>
          ))}
          <button onClick={() => saveApprovedReceipt(editedData)}>Save</button>
        </div>
      );
    }
    
    export default ReceiptEditor;