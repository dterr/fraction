import React from "react";
import styles from "./endPage.module.css";

function EndPage() {
    const title = "You're done!";
    const text = "If you want to change anything, log back in with your name and password.";
    return (
    <>
      <div>
        {title}
      </div>
      <div className={styles.text}>
        {text}
      </div>
    </>
    )
  }
  
  export default EndPage;