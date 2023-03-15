import { combineReducers } from "redux";
import user from './user_reducer';
//import comment form './comment_reducer';

const rootReducer = combineReducers({
    user
})

export default rootReducer;