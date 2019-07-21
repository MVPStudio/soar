import React, { useEffect, useState, useRef } from 'react';
import deburr from 'lodash/deburr';
import Downshift from 'downshift';
import { object, number, string, shape } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';

import { tags as suggestions } from './FormValues';

const useStyles = makeStyles(theme => ({
    textField: {
        width: '100%',
        flex: 1
    },
    container: {
        flex: 1,
        position: 'relative',
    },
    containerMarginRight: {
        flex: 1,
        position: 'relative',
        marginRight: '5px'
    },
    dropdownPaper: {
        width: '100%',
        position: 'absolute',
        marginTop: theme.spacing(0.5),
        overflow: 'auto',
        zIndex: 2,
    },
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

    const handleStateChange = (changes) => {
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
                disabled={!suggestions.length}
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
                    placeholder: suggestions.length ? 'Search for an action' : 'Loading actions...',
                });

                const unusedSuggestions = getTagSuggestions(inputValue).filter(suggestion => {
                    return !props.tags.includes(suggestion.label)
                });

                return (
                    <div className={props.isFilter ? classes.containerMarginRight : classes.container}>
                        {renderTagsInput({
                            fullWidth: true,
                            classes,
                            label: props.isFilter ? 'Action Filter' : 'Actions',
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
