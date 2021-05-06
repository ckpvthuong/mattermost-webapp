// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {createSelector} from 'reselect';

import {getTeams as fetchTeams, searchTeams} from 'mattermost-redux/actions/teams';
import {getTeams, getMyTeams} from 'mattermost-redux/selectors/entities/teams';

import {ActionFunc} from 'mattermost-redux/types/actions';

import {Team, TeamSearchOpts, TeamsWithCount} from 'mattermost-redux/types/teams';

import {GlobalState} from 'types/store';

import TeamList from './team_list';
import { IDMappedObjects } from 'mattermost-redux/types/utilities';
import {switchTeam, updateTeamsOrderForUser} from 'actions/team_actions.jsx';

// type Actions = {
//     searchTeams(term: string, opts: TeamSearchOpts): Promise<{data: TeamsWithCount}>;
//     getData(page: number, size: number): void;
//     switchTeam(url: any): void;
// }


// const filter = (teams: IDMappedObjects<Team>, myTeams: Team[]) => {

//     let ids = myTeams.map(team => team.id)
//     let renderTeams = Object.values(teams).filter(team => team.delete_at == 0 && (!ids.includes(team.id)) )
//     return renderTeams.sort((a, b) => a.display_name.localeCompare(b.display_name))
// }

const getSortedListOfTeams = createSelector(
    getTeams, 
    (teams) => Object.values(teams).sort((a, b) => a.display_name.localeCompare(b.display_name)),
);

// const getSortedListOfTeams = createSelector(
//     getTeams, getMyTeams,
//     filter,
// );

function mapStateToProps(state) {

    

    return {
        data: getSortedListOfTeams(state),
        total: state.entities.teams.totalCount || 0,
        myTeams: getMyTeams(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            getData: (page, pageSize) => fetchTeams(page, pageSize, true),
            searchTeams,
            switchTeam,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamList);
