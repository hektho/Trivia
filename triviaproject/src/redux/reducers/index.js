import { combineReducers } from "redux";
import loginReducer from './loginReducer';
import fetchReducer from "./fetchReducer";
import gameReducer from "./gameReducer";
import settingsReducer from "./settingsReducer";

const rootReducer = combineReducers({ loginReducer, fetchReducer, gameReducer, settingsReducer });

export default rootReducer;