// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {Modal} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import Constants, {ModalIdentifiers} from 'utils/constants';
import {getShortenedURL} from 'utils/url';
import * as Utils from 'utils/utils.jsx';
import {t} from 'utils/i18n.jsx';

import ProfileInModal from '../profile_in_modal'


export default class UserProfileModal extends React.PureComponent {

    onModalDismissed = () => {
        this.props.actions.closeModal(ModalIdentifiers.USER_PROFILE);
    }


    render() {
        const profileSrc = (typeof this.props.profileSrc === 'string' && this.props.profileSrc !== '') ?
            this.props.profileSrc :
            this.props.src;
        
        return (
            <Modal 
                dialogClassName='a11y__modal new-channel__modal new-channel'
                show={true}
                onHide={this.onModalDismissed}
                onExited={this.props.onModalExited}
                bsSize='large'
                autoFocus={true}
                restoreFocus={true}
                role='dialog'
                aria-labelledby='newChannelModalLabel'
            >
                <Modal.Header>
                        <button
                            type='button'
                            className='close'
                            onClick={this.onModalDismissed}
                            aria-label='Close'
                            title='Close'
                        >
                            <span aria-hidden='true'>{'×'}</span>
                        </button>
                        <Modal.Title
                            componentClass='h1'
                            id='newChannelModalLabel'
                        >
                            <FormattedMessage
                                id='user_profile_modal.modalTitle'
                                defaultMessage='User Profile'
                            />
                        </Modal.Title>

                    </Modal.Header>
                <Modal.Body>
                        <ProfileInModal
                            className='user-profile-popover'
                            userId={this.props.userId}
                            src={profileSrc}
                            isBusy={this.props.isBusy}
                            hide={this.hideProfilePopover}
                            isRHS={this.props.isRHS}
                            hasMention={this.props.hasMention}
                            overwriteIcon={this.props.overwriteIcon}
                            overwriteName={this.props.overwriteName}
                        />
                </Modal.Body>

            </Modal>
        )
    }
}
