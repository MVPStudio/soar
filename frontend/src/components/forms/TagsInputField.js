import React, { useEffect, useState, useRef } from 'react';
import deburr from 'lodash/deburr';
import Downshift from 'downshift';
import { object, number, string, shape } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';

const suggestions = [
    { label: 'Afghanistan' },
    { label: 'Aland Islands' },
    { label: 'Albania' },
    { label: 'Algeria' },
    { label: 'American Samoa' },
    { label: 'Andorra' },
    { label: 'Angola' },
    { label: 'Anguilla' },
    { label: 'Antarctica' },
    { label: 'Antigua and Barbuda' },
    { label: 'Argentina' },
    { label: 'Armenia' },
    { label: 'Aruba' },
    { label: 'Australia' },
    { label: 'Austria' },
    { label: 'Azerbaijan' },
    { label: 'Bahamas' },
    { label: 'Bahrain' },
    { label: 'Bangladesh' },
    { label: 'Barbados' },
    { label: 'Belarus' },
    { label: 'Belgium' },
    { label: 'Belize' },
    { label: 'Benin' },
    { label: 'Bermuda' },
    { label: 'Bhutan' },
    { label: 'Bolivia, Plurinational State of' },
    { label: 'Bonaire, Sint Eustatius and Saba' },
    { label: 'Bosnia and Herzegovina' },
    { label: 'Botswana' },
    { label: 'Bouvet Island' },
    { label: 'Brazil' },
    { label: 'British Indian Ocean Territory' },
    { label: 'Brunei Darussalam' },
];

const useStyles = makeStyles(theme => ({
    textField: {
        width: '85%'
    },
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    dropdownPaper: {
        width: '85%',
        position: 'absolute',
        marginTop: theme.spacing(0.5),
        transform: 'translateX(8.85%)',
        overflow: 'auto',
        zIndex: 2,
    }
}));

const TagsInputField = (props) => {
    const classes = useStyles();
    const [ isSuggestionMenuOpen, setSuggestionMenuOpen ] = useState(false);

    const tagsInputFieldRef = useRef(null);

    useEffect(() => {
        if (isSuggestionMenuOpen) {
            setSuggestionMenuOpen(false);
            tagsInputFieldRef.current.blur();
        }
    }, [props.tags.length]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleStateChange = (changes, downshiftState) => {
        if (changes.hasOwnProperty('isOpen')) {
            setSuggestionMenuOpen(changes.isOpen)
        }
    }

    const handleMenuItemClick = (suggestionLabel) => {
        props.addTag(suggestionLabel)

    }

    const renderTagsInput = (inputProps) => {
        const { InputProps, classes, ...other } = inputProps;

        return (
            <TextField
                variant="outlined"
                className={classes.textField}
                margin="normal"
                InputProps={{
                    inputRef: tagsInputFieldRef,
                    ...InputProps,
                }}
                {...other}
            />
        );
    }

    const renderTagsSuggestion = (suggestionProps) => {
        const { suggestion, index, itemProps, highlightedIndex, selectedItem } = suggestionProps;
        const isHighlighted = highlightedIndex === index;
        const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

        return (
            <MenuItem
                {...itemProps}
                key={suggestion.label}
                selected={isHighlighted}
                component="div"
                style={{
                    fontWeight: isSelected ? 500 : 400,
                }}
                onClick={() => handleMenuItemClick(suggestion.label)}
            >
                {suggestion.label}
            </MenuItem>
        );
    }

    renderTagsSuggestion.propTypes = {
        highlightedIndex: number,
        index: number,
        itemProps: object,
        selectedItem: string,
        suggestion: shape({ label: string }).isRequired,
    };

    const getTagSuggestions = (value, { showEmpty = false } = {}) => {
        const inputValue = deburr(value.trim()).toLowerCase();
        const inputLength = inputValue.length;
        let count = 0;

        return inputLength === 0 && !showEmpty
            ? []
            : suggestions.filter(suggestion => {
                const keep = count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;
                if (keep) count += 1;

                return keep;
            });
    }

    return (
        <Downshift onStateChange={handleStateChange}>
            {({
                getInputProps,
                getItemProps,
                getLabelProps,
                getMenuProps,
                highlightedIndex,
                inputValue,
                selectedItem,
            }) => {
                const { onBlur, onFocus, ...inputProps } = getInputProps({
                    placeholder: 'Search for an action',
                });

                const unusedSuggestions = getTagSuggestions(inputValue).filter(suggestion => {
                    return !props.tags.includes(suggestion.label)
                });

                return (
                    <div className={classes.container}>
                        {renderTagsInput({
                            fullWidth: true,
                            classes,
                            label: 'Actions',
                            InputLabelProps: getLabelProps({ shrink: true }),
                            InputProps: { onBlur, onFocus },
                            inputProps,
                        })}

                        <div {...getMenuProps()}>
                            {isSuggestionMenuOpen ? (
                                unusedSuggestions.length > 0 &&
                                <Paper className={classes.dropdownPaper}>
                                    {unusedSuggestions.map((suggestion, index) =>
                                        renderTagsSuggestion({
                                            index,
                                            suggestion,
                                            itemProps: getItemProps({ item: suggestion.label }),
                                            highlightedIndex,
                                            selectedItem,
                                        }),
                                    )}
                                </Paper>
                            ) : null}
                        </div>
                    </div>
                );
            }}
        </Downshift>
    )
}

export default TagsInputField;
