import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import ImgUpload from './ImgUpload';
import NamePrompt from './NamePrompt';
import TipPrompt from './TipPrompt';

function DominicForm() {
    const [page, setPage] = useState(0);
    const [data, setData] = useState({
        name: '',
        tip: '',
        image: '',
    });

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
        } else {
            return <p>Thanks!</p>
        }
    }
    const uploadForm = () => {
        const imageUp = new FormData();
        imageUp.append("file", data.image);
        imageUp.append("name",data.name); 
        imageUp.append("tip",data.tip)

        axios.post("/api/receipt", imageUp).then(res => {
            console.log("Successful upload", res);
            cleanForm();
          }).catch();
    }

    return (
        <div>
            <p>{formTitles[page]}</p>
            {pageFlow()}
            <button
                onClick={() => {
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



            />
        </div>
    );
}
export default DominicForm;