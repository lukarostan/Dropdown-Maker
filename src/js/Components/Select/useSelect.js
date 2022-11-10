import React, {useEffect, useRef, useState} from "react";
import DropdownOption from "./DropdownOption";

/**
 *
 * @param label
 * @param items
 * @param inputOptions
 * @returns {[*[],JSX.Element,boolean,handleSetError]}
 * {[currently selected value, form item element, isError, set error handler]}
 */
export const getSelectComponent = ({
									   label, items, inputOptions = {},
								   }) => {
	const [inputValue, updateInputValue] = useState([]); // state to track which elements are selected
	const [dropdownVisible, setDropdownVisible] = useState(false);
	const [refreshComponent, setRefreshComponent] = useState(false); // used to manually rerender component after filtering
	const inputRef = useRef(null); // used for reference to filter text input field
	const [error, setError] = useState(false)

	useEffect(() => {
		resetToDefaults()
	}, [inputOptions.multiSelect, inputOptions.enableFiltering, inputOptions.validationError])

	const resetToDefaults = () => {
		updateInputValue([])
		setDropdownVisible(false)
		setError(null)
		if (inputRef.current) {
			inputRef.current.value = ""
		}
	}

	const handleValueToggle = (key) => {
		let newInputValue;

		// If we have current value, filter it out
		if (inputValue.includes(key)) {
			newInputValue = inputValue.filter(v => v !== key)
		} else if (inputOptions.multiSelect) {
			// If multi-select, then we are adding into value
			newInputValue = [...inputValue, key];
		} else {
			// If single select, then just replace value with current selection
			newInputValue = [key];
		}

		updateInputValue(newInputValue);

		if (inputOptions.enableFiltering) {
			inputRef.current.value = "";
			setDropdownVisible(!dropdownVisible)
		}
	};

	const handleSetError = (newError) => {
		setError(newError);
	};

	const handleFieldClick = () => {
		setDropdownVisible(!dropdownVisible)
		setError(null)
	}

	useEffect(() => {
		if (!inputOptions.enableFiltering) {
			return;
		}

		if (dropdownVisible) {
			inputRef.current?.focus();
		} else {
			inputRef.current?.blur();
		}
	}, [dropdownVisible])

	const handleActionButtonClick = () => {
		if (selectedItems.length > 0) {
			// clear selection and filter
			updateInputValue([]);
			if (inputOptions.enableFiltering && selectedItems < 1) {
				inputRef.current.value = "";
			}
			return
		}
		handleFieldClick()
	}

	const selectedItems = items.filter(({key}) => inputValue.includes(key));
	let displayedItems = items;
	if (inputOptions.enableFiltering && inputRef.current?.value) {
		const filterValue = inputRef.current?.value.toLowerCase();
		displayedItems = items.filter(({value}) => value.toLowerCase().includes(filterValue))
	}

	// form-item-dropdown could have been conditionally removed from the DOM
	// ,but I chose to hide it with CSS for animations
	const component = ( <div className="form-item">
		<div className={`form-item-wrapper ${error ? "is-error" : ""}`}>
			<div className="select-filter-component" onClick={() => handleFieldClick()}>
				{!!selectedItems.length && <div className="selected-items">
					{selectedItems.map((i, idx) => {
						if (idx < 2) {
							return <span key={idx}>{`${idx > 0 ? "," : ""} ${i.value}`}</span>
						}
					})}
					{selectedItems.length > 2 && ( <span>{` + ${selectedItems.length - 2}`}</span> )}
				</div>}
				{inputOptions.enableFiltering ? ( !selectedItems.length || inputOptions.multiSelect ) && <input
					type={"text"}
					placeholder={label}
					ref={inputRef}
					className={inputOptions.multiSelect && selectedItems.length > 0 ? "compressed" : ""}
					onInput={(e) => setRefreshComponent(!refreshComponent)}
				/> : ( !selectedItems.length && ( <label>{label}</label> ) )}

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
					return ( <DropdownOption
						key={key}
						label={value}
						checked={inputValue.includes(key)}
						allEnabled={!!inputOptions.multiSelect || inputValue.length === 0}
						handleOnClick={() => handleValueToggle(key)}
					/> );
				})}
				{displayedItems.length === 0 && ( <span>Search returned no result.</span> )}
			</div>
		</div>
	</div> );

	return [inputValue, component, error, handleSetError];
};
