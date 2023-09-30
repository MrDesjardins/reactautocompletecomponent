import React, { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import useMeasure from "react-use-measure";
import "./AutoCompleteTextBox.css";
export interface AutoCompleteTextBoxOption {
  value: string;
  label: string;
}
export interface AutoCompleteTextBoxProps {
  options: AutoCompleteTextBoxOption[];
  onSelect: (option: AutoCompleteTextBoxOption | undefined) => void;
  maximumAutocompleteOptions?: number;
}
export const AutoCompleteTextBox = (props: AutoCompleteTextBoxProps) => {
  const [refInputContainer, bounds] = useMeasure();
  const [inputValue, setInputValue] = useState("");
  const [indexSelectedOption, setIndexSelectedOption] = useState(-1);
  const [indexOffset, setIndexOffset] = useState(0);
  const [, setSelectedOption] = useState<undefined | AutoCompleteTextBoxOption>(undefined);
  const [showResultPanel, setShowResultPanel] = useState(false);

  const filteredOptions = useMemo(() => {
    if (inputValue !== "") {
      return props.options.filter((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()));
    } else {
      return props.options;
    }
  }, [props.options, inputValue]);

  /**
   * On top of the filter, we must display a maximum subset of the options to the user.
   *
   * The function ensure we are slicing the filtered list according to the index of the selected option.
   **/
  const optionsToShow = useMemo(() => {
    const maxOptionToShow = props.maximumAutocompleteOptions ?? 3;

    // In the case that we are crossing the maximum number of options to show, we need to offset the index
    if (indexSelectedOption >= maxOptionToShow) {
      // We are over the maximum but we are still not reaching the end of the list
      if (indexSelectedOption + maxOptionToShow <= filteredOptions.length) {
        setIndexOffset(indexSelectedOption);
        return filteredOptions.slice(indexSelectedOption, indexSelectedOption + maxOptionToShow);
      } else {
        // We are reaching the end of the list, we want to ensure to keep at least the X last options
        setIndexOffset(indexSelectedOption + filteredOptions.length - maxOptionToShow - indexSelectedOption);
        return filteredOptions.slice(filteredOptions.length - maxOptionToShow, filteredOptions.length);
      }
    } else {
      // We are under the maximum number of options to show, we can reset the offset and display the X first options
      setIndexOffset(0);
      return filteredOptions.slice(0, maxOptionToShow);
    }
  }, [filteredOptions, indexSelectedOption, props.maximumAutocompleteOptions]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setShowResultPanel(true);
      setInputValue(e.target.value);
      setIndexSelectedOption(filteredOptions.length === 0 ? -1 : 0);
    },
    [filteredOptions],
  );

  const handleSelect = useCallback(
    (option: AutoCompleteTextBoxOption | undefined) => {
      setSelectedOption(option);
      if (option !== undefined) {
        setInputValue(option.label);
      }
      setShowResultPanel(false);
      props.onSelect(option);
    },
    [props],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.code === "Enter") {
        setIndexSelectedOption(-1);
        setShowResultPanel(false);
        if (indexSelectedOption >= 0) {
          setInputValue(filteredOptions[indexSelectedOption].label);
          props.onSelect(filteredOptions[indexSelectedOption]);
        }
      } else if (e.code === "Escape") {
        setShowResultPanel(false);
      } else if (e.code === "ArrowUp") {
        if (indexSelectedOption === 0) {
          return;
        }
        setShowResultPanel(true);
        setIndexSelectedOption((indexSelectedOption) => indexSelectedOption - 1);
      } else if (e.code === "ArrowDown") {
        if (indexSelectedOption === filteredOptions.length - 1) {
          return;
        }
        setShowResultPanel(true);
        setIndexSelectedOption((indexSelectedOption) => indexSelectedOption + 1);
      }
    },
    [filteredOptions, indexSelectedOption, props],
  );

  return (
    <div className="autocomplete">
      <div ref={refInputContainer}>
        <input
          className="autocompletetextboxinput"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      {showResultPanel &&
        createPortal(
          <ul
            className="autocompletetextboxresultpanel"
            style={{
              left: bounds.left,
              top: bounds.top + bounds.height,
              width: bounds.width,
            }}
          >
            {optionsToShow.map((option: AutoCompleteTextBoxOption, index: number) => {
              return (
                <li
                  style={{
                    backgroundColor: index === indexSelectedOption - indexOffset ? "lightblue" : "white",
                  }}
                  key={option.value}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </div>
  );
};
