import  { useState } from 'react';
import './Switch.css';
import type { PlasmoCSConfig } from "plasmo"


export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
}

// const endDiv = document.getElementById('end');
// endDiv.appendChild(Switch)

const Switch = () => {
  const [isChecked, setIsChecked] = useState(false);

  const toggleSwitch = () => {
    setIsChecked(prev => !prev);
  };

  return (
    <label className="switch">
      <input type="checkbox" checked={isChecked} onChange={toggleSwitch} />
      <span className="slider">
        <span className="circle"></span>
      </span>
    </label>
  );
};

export default Switch;
