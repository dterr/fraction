import React, { useEffect, useState } from "react";
import "./form.css";

function UniqueLink({ link }) {
  const [copySuccess, setCopySuccess] = useState("");
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const iOS = !!userAgent.match(/iPad/i) || !!userAgent.match(/iPhone/i);
    setIsIOS(iOS);
  }, []);

  // next function is from https://stackoverflow.com/a/34046084
  function iosCopyToClipboard(el) {
    var oldContentEditable = el.contentEditable,
      oldReadOnly = el.readOnly,
      range = document.createRange();

    el.contentEditable = true;
    el.readOnly = false;
    range.selectNodeContents(el);

    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(range);

    el.setSelectionRange(0, 999999); // A big number, to cover anything that could be inside the element.

    el.contentEditable = oldContentEditable;
    el.readOnly = oldReadOnly;

    document.execCommand("copy");
  }

  function copyToClipboard() {
    if (isIOS) {
      const el = document.getElementById("unique-link-text");
      iosCopyToClipboard(el);
    } else {
      navigator.clipboard.writeText(link);
    }
    setCopySuccess("Copied to clipboard!");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <p>Share this unique link with your friends so you can all select what you ordered! 📤</p>
      <button id="unique-link" onClick={() => copyToClipboard()}>
        <span id="unique-link-text" style={{ display: "none" }}>
          {link}
        </span>
        {link}
      </button>
      {copySuccess}
    </div>
  );
}

export default UniqueLink;
