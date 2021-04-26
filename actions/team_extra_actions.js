var utils_helpers = require( "mattermost-redux/utils/helpers");
var actions_helpers = require( "mattermost-redux/actions/helpers");
var client_1 = require("mattermost-redux/client");
var action_types_1 = require("mattermost-redux/action_types");
var tslib_1 = require("tslib");
import store from 'stores/redux_store.jsx';
var dispatch = store.dispatch

var doGet = function (userId, options) {
  return client_1.Client4.doFetch(client_1.Client4.getUserRoute(userId) + "/teams" + 
                                  utils_helpers.buildQueryString(tslib_1.__assign(options)), 
                                  { method: 'get' });
};

function getAction(userId, options) {
    return actions_helpers.bindClientFunc({
        clientFunc: doGet,
        onRequest: action_types_1.TeamTypes.GET_TEAMS_REQUEST,
        onSuccess: [action_types_1.TeamTypes.RECEIVED_TEAMS_LIST, action_types_1.TeamTypes.GET_TEAMS_SUCCESS],
        onFailure: action_types_1.TeamTypes.GET_TEAMS_FAILURE,
        params: [
            userId,
            options
        ],
    });
}

export function getTeamsForUserWithOptions(userId, options) {
  return async (dispatch) => {
      const {data} = await dispatch(getAction(userId, options));
      return data;
  };
}