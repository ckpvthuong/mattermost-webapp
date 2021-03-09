// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {getUser, makeGetDisplayName} from 'mattermost-redux/selectors/entities/users';

import {GlobalState} from 'mattermost-redux/types/store';

import UserProfile from './user_profile';
import { bindActionCreators, Dispatch, ActionCreatorsMapObject } from 'redux';
import {openModal} from 'actions/views/modals';
import {GenericAction, ActionFunc} from 'mattermost-redux/types/actions';

type OwnProps = {
    userId: string;
}
type Actions = {
    openModal: (modalData: {modalId: string; dialogType: any; dialogProps?: any}) => Promise<{
        data: boolean;
    }>;
};

function makeMapStateToProps() {
    const getDisplayName = makeGetDisplayName();

    return (state: GlobalState, ownProps: OwnProps) => {
        return {
            displayName: getDisplayName(state, ownProps.userId, true),
            user: getUser(state, ownProps.userId),
        };
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        actions: bindActionCreators<ActionCreatorsMapObject<ActionFunc>, Actions>({
            openModal
        }, dispatch),
    };
  }

export default connect(makeMapStateToProps, mapDispatchToProps)(UserProfile);
