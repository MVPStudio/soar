import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    italic: {
        fontStyle: 'italic'
    }
}));

const OrganizationTable = (props) => {
    const classes = useStyles();

    const rows = props.orgs.map(org => (
        { name: org.name, category: org.category, id: org._id }
    ))

    return (
        <Paper className={classes.root}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell component="th" align="left">Organization</TableCell>
                        <TableCell component="th" align="right">Category</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.length ? rows.map(row => (
                        <TableRow key={row.name}>
                            <TableCell align="left">
                                <Link
                                    component={RouterLink}
                                    to={`/org/${row.id}`}
                                >
                                    <Typography>{row.name}</Typography>
                                </Link>
                            </TableCell>
                            <TableCell align="right">
                                <Chip size="small" label={row.category} variant="outlined" />
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell align="left">
                                <Typography className={classes.italic}>
                                    No results match your search terms
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Paper>
    );
}

export default OrganizationTable;
