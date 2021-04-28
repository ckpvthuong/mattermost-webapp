// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';

import {savePreferences} from 'mattermost-redux/actions/preferences';
import {getProfiles} from 'mattermost-redux/actions/users';
import {makeGetCategory} from 'mattermost-redux/selectors/entities/preferences';
import {getCurrentUser, isCurrentUserSystemAdmin} from 'mattermost-redux/selectors/entities/users';
import {getMyTeams} from 'mattermost-redux/selectors/entities/teams';
import {haveISystemPermission} from 'mattermost-redux/selectors/entities/roles';
import {Permissions} from 'mattermost-redux/constants';
import {getConfig} from 'mattermost-redux/selectors/entities/general';

import {setShowNextStepsView} from 'actions/views/next_steps';
import {closeRightHandSide} from 'actions/views/rhs';
import {GlobalState} from 'types/store';
import {Preferences} from 'utils/constants';
import {isGuest} from 'utils/utils';
import {switchTeam} from 'actions/team_actions.jsx';
import {getTeamsForUserWithOptions} from 'actions/team_extra_actions';

import {getSteps, isFirstAdmin} from './steps';

import NextStepsView from './next_steps_view';

function makeMapStateToProps() {
    const getCategory = makeGetCategory();

    return (state: GlobalState) => {
        const currentUser = getCurrentUser(state);
        const config = getConfig(state);

        return {
            siteName: config.SiteName,
            customDescriptionText: config.CustomDescriptionText,
            currentUserIsGuest: isGuest(currentUser),
            canCreateTeams: haveISystemPermission(state, {permission: Permissions.CREATE_TEAM}),
            myTeams: getMyTeams(state),
            currentUser: getCurrentUser(state),
            isAdmin: isCurrentUserSystemAdmin(state),
            preferences: getCategory(state, Preferences.RECOMMENDED_NEXT_STEPS),
            steps: getSteps(state),
            isFirstAdmin: isFirstAdmin(state),
        };
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        actions: bindActionCreators(
            {
                savePreferences,
                setShowNextStepsView,
                getProfiles,
                closeRightHandSide,
                switchTeam,
                getTeamsForUserWithOptions,
            },
            dispatch,
        ),
    };
}

export default connect(makeMapStateToProps, mapDispatchToProps)(NextStepsView);
