import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";

export default function NotFound() {
  return (
    <div className="my-2-auto">
      <h1 className="centered-text">Trang không tồn tại</h1>
      <Player
        autoplay
        loop
        style={{ height: "500px" }}
        src="https://assets1.lottiefiles.com/packages/lf20_zxliqmhr.json"
      />
    </div>
  );
}
