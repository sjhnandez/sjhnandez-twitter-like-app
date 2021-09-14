import React, { useState } from "react";


const ConfirmDialog = (props) => {

    const handleClick = (e) => {
        props.onChange(e);
    }

    return (
        <div className="body-container">
            <div className="confirm-dialog-main-container">
                <span className="title">Delete Tweet?</span>
                <p className="text">
                This can't be undone and it will be removed from your
                profile, the timeline of any accounts that follow you, and 
                from Twitter search results. 
                </p>
                <div className="btn-area">
                    <button className="btn gray-btn"
                        name="cancel"
                        onClick={handleClick}
                    >
                        Cancel
                    </button>
                    <button 
                        className="btn red-btn"
                        name="confirmation"
                        onClick={handleClick}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;