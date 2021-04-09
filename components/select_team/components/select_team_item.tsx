// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode, MouseEvent} from 'react';
import {Tooltip} from 'react-bootstrap';

import {Team} from 'mattermost-redux/types/teams';

// import LocalizedIcon from 'components/localized_icon';
import OverlayTrigger from 'components/overlay_trigger';
import TeamInfoIcon from 'components/widgets/icons/team_info_icon';

// import {t} from 'utils/i18n';
import * as Utils from 'utils/utils.jsx';

type Props = {
    team: Team;
    onTeamClick: (team: Team) => void;
    loading: boolean;
    canJoinPublicTeams: boolean;
    canJoinPrivateTeams: boolean;
};

export default class SelectTeamItem extends React.PureComponent<Props> {
    handleTeamClick = (e: MouseEvent): void => {
        e.preventDefault();
        this.props.onTeamClick(this.props.team);
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
                <TeamInfoIcon className='icon icon--info'/>
            </OverlayTrigger>
        );
    }

    render() {
        const {canJoinPublicTeams, canJoinPrivateTeams, team} = this.props;

        // let icon;
        // if (loading) {
        //     icon = (
        //         <LocalizedIcon
        //             className='fa fa-refresh fa-spin right signup-team__icon'
        //             component='span'
        //             title={{id: t('generic_icons.loading'), defaultMessage: 'Loading Icon'}}
        //         />
        //     );
        // } else {
        //     icon = (
        //         <LocalizedIcon
        //             className='fa fa-angle-right right signup-team__icon'
        //             component='span'
        //             title={{id: t('select_team.join.icon'), defaultMessage: 'Join Team Icon'}}
        //         />
        //     );
        // }

        const canJoin = (team.allow_open_invite && canJoinPublicTeams) || (!team.allow_open_invite && canJoinPrivateTeams);

        return (

            <div className='select_team_item col-xs-4'>
                <a
                    href='#'
                    id={Utils.createSafeId(team.display_name)}
                    onClick={canJoin ? this.handleTeamClick : undefined}
                    className={canJoin ? '' : 'disabled column'}
                    style={{flexDirection: 'column'}}
                >
                    <div
                        style={{width: '80px',
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

        // <Menu.ItemToggleModalRedux
        //     id='manageGroups'
        //     modalId={ModalIdentifiers.MANAGE_TEAM_GROUPS}
        //     dialogProps={{
        //         teamID: this.props.team.id,
        //     }}
        //     dialogType={TeamGroupsManageModal}
        //     text={'Team'}
        // />

        // <div className='signup-team-dir'>
        //     {this.renderDescriptionTooltip()}
        //     <a
        //         href='#'
        //         id={Utils.createSafeId(team.display_name)}
        //         onClick={canJoin ? this.handleTeamClick : undefined}
        //         className={canJoin ? '' : 'disabled'}
        //     >
        //         <span className='signup-team-dir__name'>{team.display_name}</span>
        //         {!team.allow_open_invite &&
        //             <LocalizedIcon
        //                 className='fa fa-lock light'
        //                 title={{id: t('select_team.private.icon'), defaultMessage: 'Private team'}}
        //             />}
        //         {canJoin && icon}
        //     </a>
        // </div>
        );
    }
}
