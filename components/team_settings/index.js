// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {getCurrentTeam, getTeam} from 'mattermost-redux/selectors/entities/teams';

import TeamSettings from './team_settings.jsx';

import {getCurrentTeamSetting} from 'selectors/views/settings';

function mapStateToProps(state) {
    const cts = getCurrentTeamSetting(state)
    return {
        team:  getCurrentTeam(state),
        currentTeamSetting:  cts ? getTeam(state, cts.id) : null
    };
}

export default connect(mapStateToProps)(TeamSettings);
