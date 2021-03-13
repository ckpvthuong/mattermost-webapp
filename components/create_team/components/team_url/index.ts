// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {connect} from 'react-redux';

import {ActionFunc} from 'mattermost-redux/types/actions';
import {checkIfTeamExists, createTeam, getTeams as searchTeams} from 'mattermost-redux/actions/teams';

import {Team, TeamSearchOpts} from 'mattermost-redux/types/teams';
import {Client4Error} from 'mattermost-redux/types/client4';

import TeamUrl from './team_url';

type Actions = {
    searchTeams: (term: string, opts: TeamSearchOpts) => Promise<{data: any}>;
    checkIfTeamExists: (teamName: string) => Promise<{exists: boolean}>;
    createTeam: (team: Team) => Promise<{data: Team; error: Client4Error}>;
};

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        actions: bindActionCreators<ActionCreatorsMapObject<ActionFunc>, Actions>({
            checkIfTeamExists,
            createTeam,
            searchTeams,
        }, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(TeamUrl);
