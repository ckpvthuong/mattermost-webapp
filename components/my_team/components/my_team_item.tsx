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
    onTeamClick: (url: string) => void;
};

export default class MyTeamItem extends React.PureComponent<Props> {
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
                <TeamInfoIcon className='icon icon--info'/>
            </OverlayTrigger>
        );
    }

    render() {
        const {team} = this.props;

        return (

            <div className='select_team_item col-xs-4'>
                <a
                    href='#'
                    id={Utils.createSafeId(team.display_name)}
                    onClick={this.handleTeamClick}
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
        );
    }
}
