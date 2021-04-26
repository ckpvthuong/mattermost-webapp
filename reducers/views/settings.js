// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {ActionTypes} from 'utils/constants';

export default function settings(state = {}, action) {
    switch (action.type) {
    case ActionTypes.UPDATE_ACTIVE_SECTION:
        return {
            activeSection: action.data,
            previousActiveSection: state.activeSection,
        };
    case ActionTypes.SET_CURRENT_TEAM_SETTING:
        return {
            current_team_setting: action.data,
        };
    default:
        return state;
    }
}
