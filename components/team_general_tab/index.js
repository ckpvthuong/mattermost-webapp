// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {getConfig} from 'mattermost-redux/selectors/entities/general';
import {getTeam, patchTeam, removeTeamIcon, setTeamIcon, regenerateTeamInviteId, deleteTeam} from 'mattermost-redux/actions/teams';
import {Permissions} from 'mattermost-redux/constants';
import {haveITeamPermission} from 'mattermost-redux/selectors/entities/roles';

import TeamGeneralTab from './team_general_tab.jsx';
import {openModal} from 'actions/views/modals';
import {redirectUserToDefaultTeam} from 'actions/global_actions';
import {setCurrentTeamSetting} from 'actions/views/settings'

function mapStateToProps(state, ownProps) {
    const config = getConfig(state);
    const maxFileSize = parseInt(config.MaxFileSize, 10);

    const canInviteTeamMembers = haveITeamPermission(state, {team: ownProps.team.id, permission: Permissions.INVITE_USER});

    return {
        maxFileSize,
        canInviteTeamMembers,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            getTeam,
            patchTeam,
            regenerateTeamInviteId,
            removeTeamIcon,
            setTeamIcon,
            deleteTeam,
            openModal,
            redirectUserToDefaultTeam,
            setCurrentTeamSetting,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamGeneralTab);
