import React, { useEffect, useState } from "react";
import SignupForm from "./SignupForm";

export default function Signup() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  return (
    <div className="signup">
      {width <= 650 ? (
        <div className="center-panel">
          <h2 className="centered-text">Đăng kí miễn phí</h2>
          <SignupForm />
        </div>
      ) : (
        <>
          <div className="center-panel-small">
            <h2 className="centered-text">Đăng kí miễn phí</h2>
            <SignupForm />
          </div>
        </>
      )}
    </div>
  );
}
