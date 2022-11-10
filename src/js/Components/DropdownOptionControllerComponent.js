import React, {useEffect, useState} from "react";
import DropdownOption from "./Select/DropdownOption";

export const DropdownOptionControllerComponent = ({handleInputChange, inputOptions}) => {
    const additionalOptions = [{
        key: 0, value: "Enable multi-select"
    }, {
        key: 1, value: "Enable option filtering"
    }, {
        key: 2, value: "Trigger validation error"
    }]
    const [selectedOptions, updateSelectedOptions] = useState({})

    const updateInputValues = (state, key) => {
        updateSelectedOptions((prevState) => ({
                ...prevState, [key]: state
            }))
    }

    useEffect(() => {
        handleInputChange(selectedOptions)
    }, [selectedOptions])

    return (<div className="options">
        <h2>Dropdown additional options</h2>
        {additionalOptions.map(({value, key}) => {
            return (<DropdownOption
                key={key}
                allEnabled={true}
                checked={!!selectedOptions[key]}
                handleOnClick={(state) => updateInputValues(state, key)}
                label={value}/>)
        })}
        <p>Update of any options resets element to default states</p>
    </div>)
}