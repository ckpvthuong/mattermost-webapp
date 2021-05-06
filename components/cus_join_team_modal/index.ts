// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators, Dispatch, ActionCreatorsMapObject} from 'redux';
import {ActionFunc} from 'mattermost-redux/types/actions';

import {getTeams} from 'mattermost-redux/actions/teams';
import {loadRolesIfNeeded} from 'mattermost-redux/actions/roles';
import {getConfig} from 'mattermost-redux/selectors/entities/general';
import {Permissions} from 'mattermost-redux/constants';
import {haveISystemPermission} from 'mattermost-redux/selectors/entities/roles';
import {getSortedListableTeams, getTeamMemberships} from 'mattermost-redux/selectors/entities/teams';
import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';

import {ModalIdentifiers} from 'utils/constants';
import {isModalOpen} from 'selectors/views/modals';
import {openModal} from 'actions/views/modals';
import {GlobalState} from 'types/store';

import {addUserToTeam} from 'actions/team_actions';
import {isGuest} from 'utils/utils';

import {JoinTeamModal} from './join_team_modal';

type Actions = {
    openModal: (modalData: {modalId: string; dialogType: React.Component }) => Promise<{
        data: boolean;
    }>;
    getTeams: (page?: number, perPage?: number, includeTotalCount?: boolean) => any;
    loadRolesIfNeeded: (roles: Iterable<string>) => any;
    addUserToTeam: (teamId: string, userId?: string) => any;
}

function mapStateToProps(state: GlobalState) {
    const modalId = ModalIdentifiers.JOIN_ANOTHER_TEAM;
    const config = getConfig(state);
    const currentUser = getCurrentUser(state);
    const myTeamMemberships = Object.values(getTeamMemberships(state));

    return {
        show: isModalOpen(state, modalId),
        currentUserId: currentUser.id,
        currentUserRoles: currentUser.roles || '',
        currentUserIsGuest: isGuest(currentUser),
        customDescriptionText: config.CustomDescriptionText,
        isMemberOfTeam: myTeamMemberships && myTeamMemberships.length > 0,
        listableTeams: getSortedListableTeams(state, currentUser.locale),
        siteName: config.SiteName,
        canCreateTeams: haveISystemPermission(state, {permission: Permissions.CREATE_TEAM}),
        canManageSystem: haveISystemPermission(state, {permission: Permissions.MANAGE_SYSTEM}),
        canJoinPublicTeams: haveISystemPermission(state, {permission: Permissions.JOIN_PUBLIC_TEAMS}),
        canJoinPrivateTeams: haveISystemPermission(state, {permission: Permissions.JOIN_PRIVATE_TEAMS}),
        siteURL: config.SiteURL,
        totalTeamsCount: state.entities.teams.totalCount || 0,
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        actions: bindActionCreators<ActionCreatorsMapObject<ActionFunc>, Actions>({
            openModal,
            getTeams,
            loadRolesIfNeeded,
            addUserToTeam,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(JoinTeamModal);
