// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators, Dispatch, ActionCreatorsMapObject} from 'redux';

import {getTeamStats, getTeamMembers} from 'mattermost-redux/actions/teams';
import {GetTeamMembersOpts, TeamStats, TeamMembership} from 'mattermost-redux/types/teams';
import {haveITeamPermission} from 'mattermost-redux/selectors/entities/roles';
import {getMembersInCurrentTeam, getCurrentTeamStats, 
    getMembersInTeams,
    getTeamStats as xgetTeamStats
} 
    from 'mattermost-redux/selectors/entities/teams';
import {getProfilesInCurrentTeam, getProfilesInTeam, 
        searchProfilesInCurrentTeam, searchProfilesInTeam} 
        from 'mattermost-redux/selectors/entities/users';
import {Permissions} from 'mattermost-redux/constants';
import {searchProfiles} from 'mattermost-redux/actions/users';
import {ActionFunc, GenericAction, ActionResult} from 'mattermost-redux/types/actions';
import {UserProfile} from 'mattermost-redux/types/users';

import {loadStatusesForProfilesList} from 'actions/status_actions.jsx';
import {loadProfilesAndTeamMembers, loadTeamMembersForProfilesList} from 'actions/user_actions.jsx';
import {setModalSearchTerm} from 'actions/views/search';

import {GlobalState} from 'types/store';

import MemberListTeam from './member_list_team';
import { getCurrentTeamSetting } from 'selectors/views/settings';

type Props = {
    teamId: string;
}

type Actions = {
    getTeamMembers: (teamId: string, page?: number, perPage?: number, options?: GetTeamMembersOpts) => Promise<{data: TeamMembership}>;
    searchProfiles: (term: string, options?: {[key: string]: any}) => Promise<{data: UserProfile[]}>;
    getTeamStats: (teamId: string) => Promise<{data: TeamStats}>;
    loadProfilesAndTeamMembers: (page: number, perPage: number, teamId?: string, options?: {[key: string]: any}) => Promise<{
        data: boolean;
    }>;
    loadStatusesForProfilesList: (users: UserProfile[]) => Promise<{
        data: boolean;
    }>;
    loadTeamMembersForProfilesList: (profiles: any, teamId: string, reloadAllMembers: boolean) => Promise<{
        data: boolean;
    }>;
    setModalSearchTerm: (term: string) => ActionResult;
}

function mapStateToProps(state: GlobalState, ownProps: Props) {
    const canManageTeamMembers = haveITeamPermission(state, {team: ownProps.teamId, permission: Permissions.MANAGE_TEAM_ROLES});

    const searchTerm = state.views.search.modalSearch;

    let users;
    if (searchTerm) {
        users = searchProfilesInTeam(state, ownProps.teamId, searchTerm);
    } else {
        users = getProfilesInTeam(state, ownProps.teamId);
    }

    const cts = getCurrentTeamSetting(state)

    let stats = cts ? xgetTeamStats(state)[cts.id] : getCurrentTeamStats(state) ;
    stats = stats || {active_member_count: 0}
    return {
        searchTerm,
        users,
        teamMembers: cts ? getMembersInTeams(state)[cts.id] : getMembersInCurrentTeam(state) || {},
        //currentTeamId: state.entities.teams.currentTeamId,
        totalTeamMembers: stats.active_member_count,
        canManageTeamMembers,
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        actions: bindActionCreators<ActionCreatorsMapObject<ActionFunc | GenericAction>, Actions>({
            searchProfiles,
            getTeamStats,
            getTeamMembers,
            loadProfilesAndTeamMembers,
            loadStatusesForProfilesList,
            loadTeamMembersForProfilesList,
            setModalSearchTerm,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MemberListTeam);
