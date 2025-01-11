import React from "react";

export default function Header() {
    return (
        <div className="header">
            <div className="flex">
                <span className="headerTitle">Docs</span>
                <span className="headerTitle">Contact us</span>
            </div>

            <img className="imgLogo" src="/logo.png"></img>
            <div className="flex">
                <span className="headerTitle">Tokenomics</span>
                <span className="btnBuy">BUY NOW</span>
            </div>
        </div>
    );
}
