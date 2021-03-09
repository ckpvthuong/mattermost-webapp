// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ComponentProps} from 'react';

import OverlayTrigger, {BaseOverlayTrigger} from 'components/overlay_trigger';
import ProfilePopover from 'components/profile_popover';
import StatusIcon from 'components/status_icon';
import Avatar from 'components/widgets/users/avatar';
import {ModalIdentifiers} from 'utils/constants';
import {trackEvent} from 'actions/telemetry_actions';
import UserProfileModal from 'components/user_profile_modal';

import './profile_picture.scss';

interface MMOverlayTrigger extends BaseOverlayTrigger {
    hide: () => void;
}

type Props = {
    hasMention?: boolean;
    isBusy?: boolean;
    isEmoji?: boolean;
    isRHS?: boolean;
    profileSrc?: string;
    size?: ComponentProps<typeof Avatar>['size'];
    src: string;
    status?: string;
    userId?: string;
    username?: string;
    wrapperClass?: string;
    overwriteIcon?: string;
    overwriteName?: string;
    actions: {
        openModal: (modalData: {modalId: string; dialogType: any; dialogProps?: any}) => Promise<{
            data: boolean;
        }>;
    };
}


export default class ProfilePicture extends React.PureComponent<Props> {

    public static defaultProps = {
        size: 'md',
        isRHS: false,
        isEmoji: false,
        hasMention: false,
        wrapperClass: '',
    };

   

    overlay = React.createRef<MMOverlayTrigger>();

    public hideProfilePopover = () => {
        if (this.overlay.current) {
            this.overlay.current.hide();
        }
    }

    public showUserProfileModal = () => {
        this.props.actions.openModal({
            modalId: ModalIdentifiers.USER_PROFILE,
            dialogType: UserProfileModal,
            dialogProps: {
                userId: this.props.userId,
                isBusy: this.props.isBusy,
                hide: this.hideProfilePopover,
                isRHS: this.props.isRHS,
                hasMention: this.props.hasMention,
                overwriteIcon: this.props.overwriteIcon,
                overwriteName: this.props.overwriteName,
                profileSrc: this.props.profileSrc,
                src: this.props.src
            }
        });
        //trackEvent('ui', 'ui_channels_create_channel_v2');
    }

    public render() {
        // profileSrc will, if possible, be the original user profile picture even if the icon
        // for the post is overriden, so that the popup shows the user identity
        const profileSrc = (typeof this.props.profileSrc === 'string' && this.props.profileSrc !== '') ?
            this.props.profileSrc :
            this.props.src;

        const profileIconClass = `profile-icon ${this.props.isEmoji ? 'emoji' : ''}`;

        if (this.props.userId) {
            return (
                    <div
                        className={`status-wrapper style--none ${this.props.wrapperClass}`}
                        tabIndex={-1}
                        onClick={this.showUserProfileModal}
                    >
                        <span className={profileIconClass}>
                            <Avatar
                                username={this.props.username}
                                size={this.props.size}
                                url={this.props.src}
                            />
                        </span>
                        <StatusIcon status={this.props.status}/>
                    </div>
            );
        }
        return (
            <span className='status-wrapper'>
                <span className={profileIconClass}>
                    <Avatar
                        size={this.props.size}
                        url={this.props.src}
                    />
                </span>
                <StatusIcon status={this.props.status}/>
            </span>
        );
    }
}
