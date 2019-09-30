import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
// import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
// import Paper from '@material-ui/core/Paper';
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
    card: {
        marginBottom: theme.spacing(2)
    }
}));

const OrganizationCards = (props) => {
    const classes = useStyles();

    const cards = props.orgs.slice(0, props.resultsLimit).map(org => (
        { name: org.Name, id: org._id, actions: org.Actions }
    ))

    const renderResults = () => {
        if (!props.orgsLoaded) {
            return (
                <div className={classes.loadingDotsContainer}>
                    <LoadingDots />
                </div>
            )
        }

        return (
            cards.length ? cards.map(card => (
                <Card className={classes.card} key={card.id}>
                    <CardContent>
                        <Link
                            component={RouterLink}
                            to={{
                                pathname: `/org/${card.id}`,
                                state: { 
                                    searchTerm: props.searchTerm,
                                    scrollY: window.scrollY
                                }
                            }}
                        >
                            <Typography className={classes.orgName}>{card.name}</Typography>
                        </Link>
                        {card.actions.length && <Divider className={classes.divider} />}
                        <div className={classes.flexContainer}>
                            <Chip 
                                size="small"
                                label="Actions:"
                                className={classes.actionChip}
                                variant="outlined"
                            />
                            {card.actions.map((action, i) => {
                                return (
                                    <Chip 
                                        key={`${action}-${i}`} 
                                        size="small" 
                                        className={classes.actionChip} 
                                        label={action} 
                                        clickable
                                        component={RouterLink}
                                        to={{ 
                                            pathname: '/',
                                            state: { searchTerm: action.trim() }
                                        }}
                                    />
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )) : (
                <Card>
                    <Typography className={classes.italic}>
                        <CardContent>No results match your search terms</CardContent>
                    </Typography>
                </Card>
            )
        )
    }

    return renderResults();
}

export default OrganizationCards;
