import React, {useEffect} from "react";
import {getSelectComponent} from "./Select/useSelect";
import {euList} from "../Data/EuCountries";

export const DropdownHolder = ({inputOptions}) => {
    const extraProps = {
        multiSelect: inputOptions["0"] || false,
        enableFiltering: inputOptions["1"] || false,
        validationError: inputOptions["2"] || false,
    };

    const [selectedValue, formSelectComponent, error, setError] = getSelectComponent({
        label: "Select EU Country", items: euList, value: "", inputOptions: extraProps
    })

    useEffect(() => {
        if (extraProps.validationError) {
            setError("This field is required");
            return
        }
        setError(null)
    }, [inputOptions])


    return (<div className="main-container">{formSelectComponent}</div>)
}