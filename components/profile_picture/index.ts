// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {openModal} from 'actions/views/modals';
import {GenericAction} from 'mattermost-redux/types/actions';

import ProfilePicture from './profile_picture';

function mapDispatchToProps(dispatch: Dispatch<GenericAction>) {
  return {
      actions: bindActionCreators({
          openModal
      }, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(ProfilePicture as any);

