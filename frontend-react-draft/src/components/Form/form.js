import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import ImgUpload from './ImgUpload';
import NamePrompt from './NamePrompt';
import TipPrompt from './TipPrompt';
import UniqueLink from './UniqueLink';

import "./form.css";

function DominicForm() {
    const [page, setPage] = useState(0);
    const [data, setData] = useState({
        name: '',
        tip: '',
        image: '',
    });
    const [link, setLink] = useState('');

    const formTitles = [
        'Upload your receipt here',
        'While we wait, what\'s your name?',
        'Did you tip? If so, how much was it?',
    ];

    const cleanForm = () => {
        setData({
            name: '',
            tip: '',
            image: '',
        });
    }

    const pageFlow = () => {
        if (page == 0) {
            return <ImgUpload data={data} setData={setData}/>
        } else if (page == 1) {
            return <NamePrompt data={data} setData={setData}/>
        } else if (page == 2) {
            return <TipPrompt data={data} setData={setData}/>
        } else if (page == 3) {
            return <p>Thank you, please wait while your receipt processes.</p>
        } else {
            return <UniqueLink link={link}/>
        }
    }
    const uploadForm = () => {
        const imageUp = new FormData();
        imageUp.append("file", data.image);
        imageUp.append("name",data.name); 
        imageUp.append("tip",data.tip);
        //imageUp.append("test",true);
        setPage(page + 1);
        console.log("Upload Form", page);
        axios.post("/api/receipt", imageUp).then(res => {
            console.log("Successful upload", res);
            setLink(res.data.link);
            setPage({page:page + 1});
            console.log(page, link);
            cleanForm();
          }).catch();
    }

    return (
        <div>
            <p>{formTitles[page]}</p>
            {pageFlow()}
            {page < 3 &&
                <button id="next-button"
                    onClick={() => {
                        console.log("next button clicked", page);
                        if (page == 0) {
                            if (data.image == '') {
                                //alert('You must upload an image');
                                setPage(page + 1);
                                return
                            } else {
                                setPage(page + 1);
                                console.log(data);
                            }
                        } else if (page == 1) {
                            if (data.name == '') {
                                alert('You must have a name!');
                                return;
                            } else {
                                setPage(page + 1);
                            }
                        } else if (page == 2) {
                            if (data.tip == '') {
                                setData({tip: 0});
                            }
                            setPage(page + 1);
                            uploadForm();
                        } 
                    }}
                >
                    {page == 2 
                    ? 'Submit'
                    : 'Next'
                    }
                </button>
            }
        </div>
    );
}
export default DominicForm;