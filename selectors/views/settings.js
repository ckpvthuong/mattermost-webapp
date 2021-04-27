// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

export function getPreviousActiveSection(state) {
    return state.views.settings.previousActiveSection;
}

export function getCurrentTeamSetting(state) {
    return state.views.settings.current_team_setting;
}

