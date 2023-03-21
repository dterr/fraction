import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import ImgUpload from './ImgUpload';
import NamePrompt from './NamePrompt';
import TipPrompt from './TipPrompt';
import UniqueLink from './UniqueLink';
import ReceiptEditor from './ReceiptEditor';

import "./form.css";

/* This contains the entirety of the first flow.
 * We take in the receipt, creator name, and tip (if there is one)
 * At the end of the flow we provide the user with a link to share and start the second flow
 * 
 */ 
function DominicForm({ sendBack }) {

    /* Using react hooks for control of form flow
     * int page - what part of the form flow the user is on. 0 = image upload
     * struct data - container to hold the String name, int tip, and file image.
     * string link - the unique link that contains the mongo ID for the newly generated Receipt object
    */
    const [page, setPage] = useState(0);
    const [data, setData] = useState({
        name: '',
        tip: '',
        image: '',
    });
    const [link, setLink] = useState('');
    const [ocrResults, setOcrResults] = useState(null);
    const [editedReceipt, setEditedReceipt] = useState(null);

    const formTitles = [
        'Upload your receipt here',
        'While we wait, what\'s your name?',
        'Did you tip? If so, how much was it?',
        'Thank you, please wait while your receipt processes.',
        'Here\'s what our AI found, fix any errors you see.',
    ];

    // In case the API rejects and we need to refill the form
    const cleanForm = () => {
        setData({
            name: '',
            tip: '',
            image: '',
        });
    }

    // This component will react to the changing page state to step thru form
    const pageFlow = () => {
        if (page === 0) {
            return <ImgUpload data={data} setData={setData}/>
        } else if (page === 1) {
            return <NamePrompt data={data} setData={setData}/>
        } else if (page === 2) {
            return <TipPrompt data={data} setData={setData}/>
        } else if (page === 3) {
            return <div>
                        <div className="loading">. . .</div>
                    </div>
        } else if (page === 4 && ocrResults) {
            return <ReceiptEditor ocrResults={ocrResults} saveApprovedReceipt={saveApprovedReceipt}/>
        } else {
            return <UniqueLink link={link}/>
        }
    }
    const uploadForm = () => {
        const imageUp = new FormData();

        //imageUp.append("test",true); // Test Flag
        imageUp.append("file", data.image);
        imageUp.append("name",data.name); 
        imageUp.append("tip",data.tip);
        
        setPage(page + 1);
        console.log("Upload Form", page);
        axios.post("/api/receipt", imageUp).then(res => {
            console.log("Successful upload", res);
            console.log("What we got from the OCR %O", res.data.receipt)
            setOcrResults(res.data.receipt);
            //Let's view the OCR receipt now
            setPage(4);
          }).catch();
    }

    const saveApprovedReceipt = (data) => {
        setEditedReceipt(data);
        axios.post("/api/approved-receipt", {approved_receipt: editedReceipt}).then(
            (res) => {
                console.log("Successfully saved %O", res);
                setLink(res.data.link);
                setPage(page + 1);
                sendBack(data.name);
                cleanForm();
            }
        );
    }

    return (
        <div>
            <p>{formTitles[page]}</p>
            {pageFlow()}
            {page < 3 &&
                <button id="next-button"
                    onClick={() => {
                        if (page === 0) {
                            if (data.image === '') {
                                alert('You must upload an image');
                                return
                            } else {
                                setPage(page + 1);
                            }
                        } else if (page === 1) {
                            if (data.name === '') {
                                alert('You must have a name!');
                                return;
                            } else {
                                setPage(page + 1);
                            }
                        } else if (page === 2) {
                            // Tip is not necessary.
                            if (data.tip === '') {
                                setData({tip: 0});
                            }
                            setPage(page + 1);
                            uploadForm();
                        } 
                    }}
                >
                    {page === 2 
                    ? 'Submit'
                    : 'Next'
                    }
                </button>
            }
        </div>
    );
}
export default DominicForm;