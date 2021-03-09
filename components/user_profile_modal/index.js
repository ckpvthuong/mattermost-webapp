// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators, Dispatch,} from 'redux';

import {closeModal} from 'actions/views/modals';

import UserProfileModal from './user_profile_modal';

function mapDispatchToProps(dispatch) {
  return {
      actions: bindActionCreators({
          closeModal
      }, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(UserProfileModal);
