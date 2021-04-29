// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {connect} from 'react-redux';

import {getChannelModerations, patchChannelModerations} from 'mattermost-redux/actions/channels';
import {ActionFunc} from 'mattermost-redux/types/actions';
import MenuItemToggleReadOnlyChannel from './toggle_readonly_channel'

import  {Actions} from './toggle_readonly_channel';

const mapDispatchToProps = (dispatch: Dispatch) => ({
    actions: bindActionCreators<ActionCreatorsMapObject<ActionFunc>, Actions>({
        patchChannelModerations,
        getChannelModerations
    }, dispatch),
});

export default connect(null, mapDispatchToProps)(MenuItemToggleReadOnlyChannel);
