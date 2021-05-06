// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var reselect_1 = require("reselect");
export function getPreviousActiveSection(state) {
    return state.views.settings.previousActiveSection;
}

export function getCurrentTeamSetting(state) {
    return state.views.settings.current_team_setting;
}

export function getShowTeamsManagement(state) {
    return state.views.settings.show_teams_management;
}

export const getRelativeTeamUrl = reselect_1.createSelector(getCurrentTeamSetting, function (team) {
    if (!team) {t
        return '/';
    }
    return "/" + team.name;
});


