// drag drop file component
function DragImgUpload() {
    return (
      <form id="form-img-upload" accept="image/png, image/jpeg, image/jpg">
        <input type="image" id="input-img-upload" multiple={false} />
        <label id="label-img-upload" htmlFor="input-img-upload">
          <div>
            <p>Drop your image here or</p>
            <button className="upload-button">Upload</button>
          </div> 
        </label>
      </form>
    );
  };