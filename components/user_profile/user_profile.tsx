// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';

import {UserProfile as UserProfileType} from 'mattermost-redux/types/users';

import {imageURLForUser, isMobile, isGuest} from 'utils/utils.jsx';

import OverlayTrigger, {BaseOverlayTrigger} from 'components/overlay_trigger';
import ProfilePopover from 'components/profile_popover';
import BotBadge from 'components/widgets/badges/bot_badge';
import GuestBadge from 'components/widgets/badges/guest_badge';
import {ModalIdentifiers} from 'utils/constants';
import UserProfileModal from 'components/user_profile_modal';

export type UserProfileProps = {
    userId: string;
    displayName?: string;
    isBusy?: boolean;
    overwriteName?: React.ReactNode;
    overwriteIcon?: React.ReactNode;
    user?: UserProfileType;
    disablePopover?: boolean;
    displayUsername?: boolean;
    hasMention?: boolean;
    hideStatus?: boolean;
    isRHS?: boolean;
    overwriteImage?: React.ReactNode;
    actions: {
        openModal: (modalData: {modalId: string; dialogType: any; dialogProps?: any}) => Promise<{
            data: boolean;
        }>;
    };
}


function normalizeName (str?: string){
    if(!str) return "";
    let arr = str.split(" ");
    let rs = ""

    for (let word of arr){
        rs += word[0].toUpperCase() + word.slice(1).toLowerCase() + " ";
    }
    return rs.trim()
}

export default class UserProfile extends PureComponent<UserProfileProps> {
    private overlay?: BaseOverlayTrigger;

    static defaultProps: Partial<UserProfileProps> = {
        disablePopover: false,
        displayUsername: false,
        hasMention: false,
        hideStatus: false,
        isRHS: false,
        overwriteImage: '',
        overwriteName: '',
    }

    hideProfilePopover = (): void => {
        if (this.overlay) {
            this.overlay.hide();
        }
    }

    setOverlaynRef = (ref: BaseOverlayTrigger): void => {
        this.overlay = ref;
    }

    showUserProfileModal = (profileImg: string) => {
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
                src: profileImg
            }
        })
    }


    render(): React.ReactNode {
        const {
            disablePopover,
            displayName,
            displayUsername,
            isBusy,
            isRHS,
            hasMention,
            hideStatus,
            overwriteName,
            overwriteIcon,
            user,
            userId,
        } = this.props;

        let name: React.ReactNode;
        if (user && displayUsername) {
            name = `@${(user.username)}`;
        } else {
            name = overwriteName || normalizeName(displayName) || '...';
        }

        const ariaName: string = typeof name === 'string' ? name.toLowerCase() : '';

        if (disablePopover) {
            return <div className='user-popover'>{name}</div>;
        }

        let placement = 'right';
        if (isRHS && !isMobile()) {
            placement = 'left';
        }

        let profileImg = '';
        if (user) {
            profileImg = imageURLForUser(user.id, user.last_picture_update);
        }

        return (
            <React.Fragment>
                <div
                    onClick={() => this.showUserProfileModal(profileImg)}
                >
                    <button
                        aria-label={ariaName}
                        className='user-popover style--none'
                    >
                        {name}
                    </button>
                </div>
                <BotBadge
                    show={Boolean(user && user.is_bot)}
                    className='badge-popoverlist'
                />
                <GuestBadge
                    show={Boolean(user && isGuest(user))}
                    className='badge-popoverlist'
                />
            </React.Fragment>
        );
    }
}
