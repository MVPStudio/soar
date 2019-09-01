import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const inititalState = {};
const middleware = [applyMiddleware(thunk)];

if (window.__REDUX_DEVTOOLS_EXTENSION__ != null) {
    middleware.push(window.__REDUX_DEVTOOLS_EXTENSION__())
}

const store = createStore(
    rootReducer,
    inititalState,
    compose(...middleware)
);

export default store;
