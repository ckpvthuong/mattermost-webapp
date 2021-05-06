// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {ActionTypes} from 'utils/constants';

export function updateActiveSection(newActiveSection) {
    return {
        type: ActionTypes.UPDATE_ACTIVE_SECTION,
        data: newActiveSection,
    };
}

export function setCurrentTeamSetting(team) {
    return {
        type: ActionTypes.SET_CURRENT_TEAM_SETTING,
        data: team,
    };
}

export function setShowTeamsManagement(op) {
    return {
        type: ActionTypes.SET_SHOW_TEAMS_MANAGEMENT,
        data: op,
    };
}