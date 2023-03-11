import React from "react";
import styles from "./endPage.module.css";

function ThankYouPage() {
    const title = "Thanks for selecting your order!";
    const instruction = "Please wait while your friends finish selecting their orders.";
    const text = "Log back in with your name and password if you want to change anything!";
    const timer = "Countdown timer";
    const link = "this is user A's unique link";
    // create an element and text node for the link included in the header
    //var elem = document.createElement('elem');
    //var link = document.createTextNode("this is user A's unique link");
    //elem.appendChild(link);
    //elem.title = "this is user A's unique link"}
    //elem.href = "https://www.github.com/StanfordCS194/win2023-team15"}
    return (
    <>
      <div className={styles.text}>
        <button>
          {link}
        </button>
      </div>
      <br></br>
      <br></br>
      <div>
        {instruction}
        <br></br>
        {title}
      </div>
      <br></br>
      <div className={styles.text}>
        <button>
          {text}
        </button>
      </div>
      <br></br>
      <div className={styles.text}>
        <button>
          {timer}
        </button>
      </div>
    </>
    )
  }
  
  export default ThankYouPage;