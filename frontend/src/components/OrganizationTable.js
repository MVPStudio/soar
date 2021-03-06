import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Chip from '@material-ui/core/Chip';

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
    },
    orgName: {
        fontSize: '1.15rem',
        marginBottom: '0.5rem'
    },
    actionChip: {
        marginRight: '0.25rem',
        marginBottom: '0.25rem'
    },
    flexContainer: {
        display: 'flex',
        flexFlow: 'row wrap'
    },
    divider: {
        marginBottom: theme.spacing(2)
    },
}));

const OrganizationTable = (props) => {
    const classes = useStyles();

    const rows = props.orgs.slice(0, props.resultsLimit).map(org => (
        { name: org.Name, id: org._id, actions: org.Actions }
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
                            <Typography className={classes.orgName}>{row.name}</Typography>
                        </Link>
                        {row.actions.length && <Divider className={classes.divider} />}
                        <div className={classes.flexContainer}>
                            <Chip 
                                size="small"
                                label="Actions:"
                                className={classes.actionChip}
                                variant="outlined"
                            />
                            {row.actions.map((action, i) => {
                                return (
                                    <Chip 
                                        key={`${action}-${i}`} 
                                        size="small" 
                                        className={classes.actionChip} 
                                        label={action} 
                                        // clickable
                                        // component={RouterLink}
                                        // to={`/?${action}`}
                                    />
                                )
                            })}
                        </div>
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
                        <TableCell component="th" align="left">Organizations</TableCell>
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
