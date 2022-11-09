import React, {useEffect, useRef, useState} from "react";
import DropdownOption from "./DropdownOption";

/**
 *
 * @param label
 * @param items
 * @param inputOptions
 * @returns {[*[],JSX.Element,boolean,handleSetError,handleSetValue]}
 * {[currently selected value, form item element, isError, set error handler, set value handler]}
 */
export const getSelectComponent = ({
                                       label, items, inputOptions = {},
                                   }) => {
    const [inputValue, updateInputValue] = useState([]);
    const [selectedItems, updateSelectedItems] = useState([]); // used for showing selected items in the input field
    const inputRef = useRef(null); // used for reference to filter text input field
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [displayedItems, setDisplayedItems] = useState(items) // used for filtering
    const [error, setError] = useState(false)

    useEffect(() => {
        resetToDefaults()
    }, [inputOptions.multiSelect, inputOptions.enableFiltering, inputOptions.validationError,])

    const resetToDefaults = () => {
        updateInputValue([])
        updateSelectedItems([])
        setDropdownVisible(false)
        setDisplayedItems(items)
    }


    const handleSetValue = (state, key) => {
        if (state) {
            updateInputValue([key])
        } else {
            updateInputValue([])
        }
        setDisplayedItems(items)
    };

    const handleMultiselectSetValue = (state, key) => {
        if (state) {
            updateInputValue((prevState) => {
                return [...prevState, key]
            })
        } else {
            updateInputValue((prevState) => {
                return prevState.slice().filter(i => i !== key)
            })
        }
        setDisplayedItems(items)
        if (inputOptions.enableFiltering) {
            inputRef.current.value = "";
            setDropdownVisible(!dropdownVisible)
        }
    }

    useEffect(() => {
        // use slice to prevent original array mutation
        const newSelectedItems = items.slice().filter(i => inputValue.includes(i.key))
        updateSelectedItems(newSelectedItems)
    }, [inputValue])

    const handleSetError = (newError) => {
        setError(newError);
        setError(newError !== null);
    };


    const handleFieldClick = () => {
        setDropdownVisible(!dropdownVisible)
        setError(null)
        if (inputOptions.enableFiltering && selectedItems.length > 0) {
            if (!dropdownVisible) {
                inputRef.current.focus();
                return;
            }
            if (selectedItems < 1) {
                inputRef.current.blur();
            }
        }
    }

    const handleFiltering = (e) => {
        const filteredItems = items.filter(i => {
            return i.value.toLowerCase().includes(e.target.value.toLowerCase())
        })
        setDisplayedItems(filteredItems)
    }

    const handleActionButtonClick = () => {
        if (selectedItems.length > 0) {
            // clear selection and filter
            handleSetValue(null)
            setDisplayedItems(items);
            if (inputOptions.enableFiltering && selectedItems < 1) {
                inputRef.current.value = "";
            }
            return
        }
        handleFieldClick()
    }

    // form-item-dropdown could have been conditionally removed from the DOM
    // ,but I chose to hide it with CSS for animations
    const component = (<div className="form-item">
        <div className={`form-item-wrapper ${error ? "is-error" : ""}`}>
            <div className="select-filter-component" onClick={() => handleFieldClick()}>
                {!!selectedItems.length && <div className="selected-items">
                    {selectedItems.map((i, idx) => {
                        if (idx < 2) {
                            return <span key={idx}>{`${idx > 0 ? "," : ""} ${i.value}`}</span>
                        }
                    })}
                    {selectedItems.length > 2 && (<span>{` + ${selectedItems.length - 2}`}</span>)}
                </div>}
                {inputOptions.enableFiltering ? (!selectedItems.length || inputOptions.multiSelect) && <input
                    type={"text"}
                    placeholder={label}
                    ref={inputRef}
                    className={inputOptions.multiSelect && selectedItems.length > 0 ? "compressed" : ""}
                    onInput={(e) => handleFiltering(e)}
                /> : (!selectedItems.length && (<label>{label}</label>))}

            </div>
            <div className={`
                    action-button
                    ${!dropdownVisible ? "plus" : ""}
                    ${selectedItems.length > 0 ? "cross" : ""}
                 `}
                 onClick={() => handleActionButtonClick()}
            ></div>
        </div>

        {error && <div className="error">This field is required.</div>}
        <div className={`form-item-dropdown ${!dropdownVisible ? "hidden" : ""}`}>
            <div className="option-container">
                {displayedItems.map(({key, value}) => {
                    return (<DropdownOption
                        key={key}
                        optionKey={key}
                        value={value}
                        initialState={() => {
                            if (inputOptions.multiSelect) {
                                return inputValue.includes(key)
                            }
                            return inputValue[0] === key
                        }}
                        allEnabled={inputOptions.multiSelect || inputValue.length === 0}
                        handleOnClick={(state) => {
                            if (inputOptions.multiSelect) {
                                handleMultiselectSetValue(state, key)
                            } else {
                                handleSetValue(state, key)
                            }
                        }}
                    />);
                })}
                {displayedItems.length === 0 && (<span>Search returned no result.</span>)}
            </div>
        </div>
    </div>);

    return [inputValue, component, error, handleSetError, handleSetValue];
};