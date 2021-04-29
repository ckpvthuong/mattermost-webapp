// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import { UserProfile } from 'mattermost-redux/src/types/users';
import { Channel } from 'mattermost-redux/src/types/channels';
import { ActionFunc } from 'mattermost-redux/types/actions';
import { localizeMessage } from 'utils/utils';

import Menu from 'components/widgets/menu/menu';
import { ChannelModeration, ChannelModerationPatch } from 'mattermost-redux/types/channels';

export type Actions = {
    patchChannelModerations: (channelId: string, patch: ChannelModerationPatch[]) => ActionFunc;
    getChannelModerations: (channelId: string) => {data: {channelId: string, moderations: ChannelModeration[]}}
};

export type States = {
   canPost: boolean
};

type Props = {

    /**
     * Object with info about the current user
     */
    user: UserProfile;

    /**
     * Object with info about the current channel
     */
    channel: Channel;

    /**
     * Boolean whether the current channel is muted
     */
    isReadonly: boolean;

    /**
     * Use for test selector
     */
    id?: string;

    /**
     * Object with action creators
     */
    actions: Actions;
};

export default class MenuItemToggleReadOnlyChannel extends React.PureComponent<Props, States> {

    constructor(props: Props) {
        super(props);

        this.state = {
            canPost: false
        };
    }

    componentDidMount = async () => {
        const {data} = await this.props.actions.getChannelModerations(this.props.channel.id)
        const mr: ChannelModeration = data.moderations.filter(item => item.name === 'create_post')[0]
        this.setState({canPost: mr.roles.members.value})
    }

    handleClick = () => {
        const canPost = !this.state.canPost
        const {
            user,
            channel,
            
            actions: {
                patchChannelModerations,
            },
        } = this.props;

        const patchChannelPermissionsArray: ChannelModerationPatch[] = [
            { name: "create_post", 
              roles: { 
                  guests: canPost, 
                  members: canPost
                } 
            }
        ]
        patchChannelModerations(channel.id,patchChannelPermissionsArray)
        this.setState({canPost: canPost})
    }

    render() {
        const {
            id,
        } = this.props;

        

        let text;
        if (this.state.canPost) {
            text = localizeMessage('channel_header.readonly', 'Change to can post Channel');
        } else {
            text = localizeMessage('channel_header.unreadonly', 'Change to Read Only Channel');
        }

        return (
            <Menu.ItemAction
                id={id}
                onClick={this.handleClick}
                text={text}
            />
        );
    }
}
