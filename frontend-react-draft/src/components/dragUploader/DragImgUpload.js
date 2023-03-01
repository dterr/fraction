import React from 'react';
import axios from 'axios';
import './DragImgUpload.css';
import { stripBasename } from '@remix-run/router';

// drag drop file component
function DragDropFile(props) {
  // drag state
  const [isDragging, setIsDragging] = React.useState(false);
  // ref
  const inputRef = React.useRef(null);
  // state for name input
  const [name, setName] = React.useState('');

  const handleUpload = (img) => {
    console.log("Upload input", img);
    if (img.length > 0) {
      const imageUp = new FormData();
      imageUp.append("file", img[0]);
      imageUp.append("name",name);
      props.onUpload();

      axios.post("/api/receipt", imageUp).then(res => {
          console.log("Successful upload", res);
          this.props.onUpload();
        }).catch();
    }
  };
  
  // handle drag events
  const handleDrag = function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };
  
  // triggers when file is dropped
  const handleDrop = function(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files);
    }
  };
  
  // triggers when file is selected with click
  const handleChange = function(e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files);
    }
  };
  
// triggers the input when the button is clicked
  const handleButtonClick = () => {
    inputRef.current.click();
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  }
  
  return (
    <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
      <input type="text" id="name-input" placeholder="Enter your name first" value={name} onChange={handleNameChange}/>
      <input ref={inputRef} type="file" id="input-file-upload" multiple={true} onChange={handleChange} />
      <label id="label-file-upload" htmlFor="input-file-upload" className={isDragging ? "dragging" : "" }>
        <div>
          <p id="form-file-text">Drag and drop your image here or</p>
          <button className="upload-button" onClick={handleButtonClick}>Upload an image</button>
        </div> 
      </label>
      { isDragging && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div> }
    </form>
  );
}

export default DragDropFile;