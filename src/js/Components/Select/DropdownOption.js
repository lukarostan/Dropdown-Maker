import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";

const DropdownOption = ({optionKey, value, initialState = false, allEnabled, handleOnClick}) => {
    const [checked, setChecked] = useState(initialState)

    const onClick = () => {
        setChecked(!checked)
        if(!checked){
            handleOnClick(true)
            return
        }
        handleOnClick(false)
    }

    useEffect(() => {
        setChecked(initialState);
    }, [initialState]);

    return (
        <div
            className={`option ${!checked && !allEnabled ? "disabled" : ""}`}
            key={optionKey}
            value={optionKey}
            onClick={() => onClick()}>
            <input
                className={`option-checkbox ${checked ? "checked" : ""}`}
                type={"checkbox"}
            />
            <span className="option-label">{value}</span>
        </div>
    );
}

DropdownOption.propTypes = {
    optionKey: PropTypes.number.isRequired,
    value: PropTypes.string.isRequired,
    handleOnClick: PropTypes.func.isRequired,
}

export default DropdownOption
