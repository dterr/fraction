import React from 'react';
import "./form.css";

// drag drop file component
function ImgUpload({data, setData}) {
  // drag state
  const [isDragging, setIsDragging] = React.useState(false);
  // ref
  const inputRef = React.useRef(null);

  const handleUpload = (img) => {
    console.log("Upload input", img);
    if (img.length > 0) {
        setData({ ...data, image: img[0] });
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
  
  return (
    <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
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

export default ImgUpload;