// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {setCurrentTeamSetting} from 'actions/views/settings'

import MyTeamItem from './my_team_item';

import {getCurrentTeam, getTeam} from 'mattermost-redux/selectors/entities/teams';

function mapStateToProps(state, ownProps) {
    return {
        team:  getTeam(state, ownProps.team_id)
    };
}


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            setCurrentTeamSetting
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyTeamItem);
