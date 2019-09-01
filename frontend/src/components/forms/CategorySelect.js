import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import { categories } from './FormValues';

const useStyles = makeStyles(theme => ({
    selectField: {
        width: '100%',
        textAlign: 'left',
        flex: 1
    },
    selectFieldMarginLeft: {
        width: '100%',
        textAlign: 'left',
        flex: 1,
        marginLeft: '5px'
    }
}));

const CategorySelect = (props) => {
    const classes = useStyles();

    return (
        <TextField
            select
            label={props.isFilter ? 'Category Filter' : 'Category'}
            className={props.isFilter ? classes.selectFieldMarginLeft : classes.selectField}
            value={props.selectedCategory}
            onChange={props.setSelectedCategory}
            margin="normal"
            variant="outlined"
        >
            {props.isFilter && <MenuItem value='All Categories'><i>All Categories</i></MenuItem>}
            {categories.map((category, i) => (
                <MenuItem key={`${category}-${i}`} value={category}>
                    {category}
                </MenuItem>
            ))}
        </TextField>
    )
}

export default CategorySelect;
