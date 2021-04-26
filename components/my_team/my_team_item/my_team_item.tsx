// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.




import { FormattedMessage } from 'react-intl';
import { Constants, ModalIdentifiers } from 'utils/constants';
import Popover from 'components/widgets/popover';
import React, { ReactNode, MouseEvent } from 'react';
import { Tooltip, Overlay, Button } from 'react-bootstrap';
import { Team } from 'mattermost-redux/types/teams';

// import LocalizedIcon from 'components/localized_icon';
import OverlayTrigger from 'components/overlay_trigger';
import TeamInfoIcon from 'components/widgets/icons/team_info_icon';

// import {t} from 'utils/i18n';
import * as Utils from 'utils/utils.jsx';
import MenuIcon from 'components/widgets/icons/menu_icon';

import TeamPermissionGate from 'components/permissions_gates/team_permission_gate';
import { Permissions } from 'mattermost-redux/constants';
import TeamSettingsModal from 'components/team_settings_modal';
import Menu from 'components/widgets/menu/menu';
import {injectIntl} from 'react-intl';


type Actions = {
    setCurrentTeamSetting: (team: Team | null) => any
}

type Props = {
    team: Team;
    onTeamClick: (url: string) => void;
    actions: Actions
    intl: any
};

type State = {
    showPopover: boolean
}
class MyTeamItem extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            showPopover: false,
        };

    }

    handleTeamClick = (e: MouseEvent): void => {
        e.preventDefault();
        this.props.onTeamClick(`/${this.props.team.name}`);
    }

    renderDescriptionTooltip = (): ReactNode => {
        const team = this.props.team;
        if (!team.description) {
            return null;
        }

        const descriptionTooltip = (
            <Tooltip id='team-description__tooltip'>
                {team.description}
            </Tooltip>
        );

        return (
            <OverlayTrigger
                delayShow={1000}
                placement='top'
                overlay={descriptionTooltip}
                rootClose={true}
                container={this}
            >
                <TeamInfoIcon className='icon icon--info' />
            </OverlayTrigger>
        );
    }
    channelMembersTooltip = (
        <Tooltip id='channelMembersTooltip'>
            <FormattedMessage
                id='team_settings.tooltip'
                defaultMessage='Setting'
            />
        </Tooltip>
    );

    handleSettingModal = () => {
        this.setState({ showPopover: !this.state.showPopover });
    };

    closePopover = () => {
        this.setState({ showPopover: false });
    };

    openSetting = () => {
        this.props.actions.setCurrentTeamSetting(this.props.team)
        this.closePopover()
    }

    closeSetting = () => {
        this.props.actions.setCurrentTeamSetting(null)
    }

    render() {
        const { team } = this.props;
        const {formatMessage} = this.props.intl;

        const settingsButton = (<>

            <button
                id='member_popover'
                className={'style--none sidebar-header-dropdown__icon'}
                ref={'btn_setting_ref'}
                onClick={this.handleSettingModal}
                style={{ position: 'absolute', right: 5, top: 2 }}
            >
                <MenuIcon fillColor='blue' />
            </button>
            <Overlay
                rootClose={true}
                onHide={this.closePopover}
                show={this.state.showPopover}
                target={this.refs.btn_setting_ref}
                placement='bottom'
            >
                <Popover
                    className='team_settings_pop'
                    style={{margin:0}}
                >
                    <Menu
                        ariaLabel={'menu_team_setts'}
                    >
                        <Menu.Group>
                            <div onClick={this.openSetting} >
                                <TeamPermissionGate
                                    teamId={this.props.team.id}
                                    permissions={[Permissions.MANAGE_TEAM]}
                                >   <ul style={{ listStyleType: 'none' }}>
                                        <Menu.ItemToggleModalRedux
                                            id='teamSettings'
                                            modalId={ModalIdentifiers.TEAM_SETTINGS}
                                            dialogType={TeamSettingsModal}
                                            dialogProps={{ onClose: this.closeSetting }}
                                            text={formatMessage({id: 'myteams.settings', defaultMessage: 'Team Settings'})}
                                        />

                                    </ul>
                                </TeamPermissionGate>
                            </div>
                        </Menu.Group>
                    </Menu>
                </Popover>
            </Overlay>
        </>
        )

        return (

            <div className='select_team_item col-xs-4'>
                {settingsButton}
                <a
                    href='#'
                    id={Utils.createSafeId(team.display_name)}
                    onClick={this.handleTeamClick}
                    style={{ flexDirection: 'column' }}
                >
                    <div
                        style={{
                            width: '80px',
                            height: '80px',
                            backgroundColor: '#166DE0',
                            color: '#FFF',
                            fontSize: 20,
                            borderRadius: '4px',
                            textAlign: 'center',
                            paddingTop: '15px',
                            paddingBottom: '15px',
                        }}
                    >
                        {team.display_name.match(/\b(\w)/g)?.join('').slice(0, 3)}
                    </div>
                    <span className='select_team_item__name'>{team.display_name}</span>
                </a>
            </div>
        );
    }
}

export default injectIntl(MyTeamItem)
