import React from "react";
import PropTypes from "prop-types";

const DropdownOption = ({label, checked, allEnabled, handleOnClick}) => {

    return (
        <div
            className={`option ${!checked && !allEnabled ? "disabled" : ""}`}
            onClick={() => handleOnClick(!checked)}>
            <input
                className={`option-checkbox ${checked ? "checked" : ""}`}
                type={"checkbox"}
            />
            <span className="option-label">{label}</span>
        </div>
    );
}

DropdownOption.propTypes = {
    label: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    allEnabled: PropTypes.bool.isRequired,
    handleOnClick: PropTypes.func.isRequired,
}

export default DropdownOption
