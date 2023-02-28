import React from "react";
import styles from "./endPage.module.css";

function TotalBreakdownPage() {
    var name = "NAME";
    const greeting = "Hey " + name + "!";
    const header = "Here's the breakdown:";
    const text = "[per-person totals (ex. Joe: $32.19)]";
    const receipt = "View Receipt";
    const instruction = "Please Venmo accordingly. Thanks for using Fraction!";

    return (
    <>
      <div>
        {greeting}
      </div>
      <br></br>
      <br></br>
      <div>
        {header}
        <br></br>
        {text}
      </div>
      <br></br>
      <div className={styles.text}>
        <button>
          {receipt}
        </button>
      </div>
      <br></br>
      <div className={styles.text}>
        {instruction}
      </div>
    </>
    )
  }
  
  export default TotalBreakdownPage;