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

import LoadingDots from '../utils/LoadingDots';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    italic: {
        fontStyle: 'italic'
    },
    loadingDotsContainer: {
        display: 'flex',
        justifyContent: 'center',
    }
}));

const OrganizationTable = (props) => {
    const classes = useStyles();

    const rows = props.orgs.slice(0, props.resultsLimit).map(org => (
        { name: org.Name, id: org._id }
    ))

    const renderResults = () => {
        if (!props.orgsLoaded) {
            return (
                <TableRow>
                    <div className={classes.loadingDotsContainer}>
                        <LoadingDots />
                    </div>
                </TableRow>
            )
        }

        return (
            rows.length ? rows.map(row => (
                <TableRow key={row.name}>
                    <TableCell align="left">
                        <Link
                            component={RouterLink}
                            to={`/org/${row.id}`}
                        >
                            <Typography>{row.name}</Typography>
                        </Link>
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
            )
        )
    }

    return (
        <Paper className={classes.root}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell component="th" align="left">Organization</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {renderResults()}
                </TableBody>
            </Table>
        </Paper>
    );
}

export default OrganizationTable;
