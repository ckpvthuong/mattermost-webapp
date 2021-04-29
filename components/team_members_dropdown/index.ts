// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';

import {getChannelStats} from 'mattermost-redux/actions/channels';
import {
    getMyTeamMembers,
    getMyTeamUnreads,
    getTeamStats,
    getTeamMember,
    updateTeamMemberSchemeRoles,
    getTeamMembers,
    
} from 'mattermost-redux/actions/teams';
import {getUser, updateUserActive} from 'mattermost-redux/actions/users';
import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';
import {getCurrentRelativeTeamUrl, getCurrentTeam, getTeam} from 'mattermost-redux/selectors/entities/teams';

import {GlobalState} from 'mattermost-redux/types/store';

import {GenericAction} from 'mattermost-redux/types/actions';

import {removeUserFromTeamAndGetStats} from 'actions/team_actions.jsx';

import TeamMembersDropdown from './team_members_dropdown';
import { getCurrentTeamSetting, getRelativeTeamUrl } from 'selectors/views/settings';

const xgetTeamMembers: any = getTeamMembers

function mapStateToProps(state: GlobalState) {
    const cts = getCurrentTeamSetting(state)
    return {
        currentUser: getCurrentUser(state),
        teamUrl: cts ? getRelativeTeamUrl(state) : getCurrentRelativeTeamUrl(state),
        currentTeam:  cts || getCurrentTeam(state),
        cts:  cts,
    };
}

function mapDispatchToProps(dispatch: Dispatch<GenericAction>) {
    return {
        actions: bindActionCreators({
            getMyTeamMembers,
            getMyTeamUnreads,
            getUser,
            getTeamMember,
            getTeamStats,
            getChannelStats,
            updateUserActive,
            updateTeamMemberSchemeRoles,
            removeUserFromTeamAndGetStats,
            xgetTeamMembers,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamMembersDropdown);
