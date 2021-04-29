// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Dispatch } from 'redux';
import { GenericAction, GetStateFunc } from 'mattermost-redux/types/actions';
import { UserProfile } from 'mattermost-redux/types/users';
import { Permissions } from 'mattermost-redux/constants';
import { Team } from 'mattermost-redux/types/teams';
import * as Utils from 'utils/utils';
import { trackEvent } from 'actions/telemetry_actions';
import SystemPermissionGate from 'components/permissions_gates/system_permission_gate';
import MyTeamItem from 'components/my_team/my_team_item';
import CloseIcon from 'components/widgets/icons/close_icon';
import './next_steps_view.scss';
import { getSiteURL } from 'utils/url';



// import OnboardingSuccessSvg from './images/onboarding-success-svg';

type Props = {
    currentTeam: Team;
    currentUser: UserProfile;
    actions: {
        setShowNextStepsView: (show: boolean) => void;
        closeRightHandSide: () => void;
        switchTeam: (url: string) => (dispatch: Dispatch<GenericAction>, getState: GetStateFunc) => void;
        getTeamsForUserWithOptions: (userId: any, options: any) => any;
        getUserByEmail: (email: string) => any;
    };
};

type State = {
    myTeams: Team[]
    filterValue: string
    orgTeams: Team[]
    inviteID: string
}

export default class NextStepsView extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            myTeams: [],
            filterValue: 'all',
            orgTeams: [],
            inviteID: ''
        };
    }

    async componentDidMount() {
        this.props.actions.closeRightHandSide();
        const myTeams = await this.props.actions.getTeamsForUserWithOptions(this.props.currentUser.id, {});
        
        let orgTeams: Team[] = [];
        if (this.props.currentTeam.email){
            const { data } = await this.props.actions.getUserByEmail(this.props.currentTeam.email)
            orgTeams = await this.props.actions.getTeamsForUserWithOptions(data.id, {});
        }
        this.setState({ myTeams: myTeams, orgTeams: orgTeams })
    }

    handleFilterChange = async (e: any) => {
        const fvalue = e.target.value
        this.setState({ filterValue: fvalue })
    }

    filterTeam = () => {
        const {myTeams, orgTeams} = this.state
        const myTeamsIds = myTeams.map((v, i, a) => v.id)
        switch (this.state.filterValue) {
            case 'my_all':
                return myTeams
            case 'my_created':
                return myTeams.filter(team => team.email == this.props.currentUser.email)
            case 'org_pub_can_join':
                return orgTeams.filter(team => team.type === 'O' && (!myTeamsIds.includes(team.id)))
            case 'org_pri_cant_join':
                return orgTeams.filter(team => team.type === 'I' && (!myTeamsIds.includes(team.id)))
            case 'org_all':
                return orgTeams
            default:
                return myTeams
        }
    }

    public handleTeamURLInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ inviteID: e.target.value });
    }

    render() {

        const renderListTeam = this.filterTeam().map(team =>
        (
            <MyTeamItem
                key={'team_' + team.name}
                team_id={team.id}
                onTeamClick={this.props.actions.switchTeam}
            />
        )
        )

        const renderLinkCreateTeam = (

            <SystemPermissionGate permissions={[Permissions.CREATE_TEAM]}>
                <div
                    className='margin--extra'
                    style={{ marginTop: '0.5em', fontSize: 20, minWidth: 70 }}
                >
                    <Link
                        id='createNewTeamLink'
                        to='/create_team'
                        onClick={() => trackEvent('select_team', 'click_create_team')}
                        className='signup-team-login'
                    >
                        <FormattedMessage
                            id='login.createTeam'
                            defaultMessage='Create a team'
                        />
                    </Link>
                </div>
            </SystemPermissionGate>
        );

        const renderInvite = (
            <div
                className='margin--extra'
                style={{ marginTop: '0.5em', fontSize: 20, minWidth: 70 }}
            >
                <Link
                    to='/select_team'
                    className='signup-team-login'
                >
                    <FormattedMessage
                        id='myteams.join_by_code'
                        defaultMessage='Join by code'
                    />
                </Link>
            </div>
        )

        const renderHeader = (
            <div className='NextStepsView__header' style={{ padding: 0, alignItems: 'baseline' }}>
                {renderLinkCreateTeam}
                <i style={{marginLeft: 10, marginRight:10}}>
                    <FormattedMessage
                        id='myteams.or'
                        defaultMessage='or'
                    />
                </i>

                {renderInvite}
                <CloseIcon
                    id='closeIcon'
                    className='close-icon'
                    onClick={() => this.props.actions.setShowNextStepsView(false)}
                    style={{ marginLeft: 'auto' }}
                />
            </div>
        )

        const renderTeamBox = (
            <div style={{ marginTop: 20 }}>
                {renderListTeam}
            </div>
        )

        const renderFilter = (
            <select
                id='myteamsfilter'
                className='form-control'
                value={this.state.filterValue}
                onChange={this.handleFilterChange}
                style={{ marginLeft: 0 , width: 500}}
            >
                <option value={'my_all'}>{Utils.localizeMessage('myteams.my_all', 'My All Teams')}</option>
                <option value={'my_created'}>{Utils.localizeMessage('myteams.my_created', 'My Created')}</option>
                <option value={'org_pub_can_join'}>{Utils.localizeMessage('myteams.org_pub_can_join', 'Organization Public Teams')}</option>
                <option value={'org_pri_cant_join'}>{Utils.localizeMessage('myteams.org_pri_cant_join', 'Organization Private Teams')}</option>
                <option value={'org_all'}>{Utils.localizeMessage('myteams.org_all', 'Organization All Teams')}</option>
            </select>
        )

        const renderBody = (
            <div style={{ width: '100%', marginTop: 40 }}>
                {renderFilter}
                {renderTeamBox}
            </div>
        )


        return (
            <section
                id='app-content'
                className='app__content NextStepsView'
            >
                <div className='NextStepsView__viewWrapper NextStepsView__completedView completed'>
                    <div
                        style={{ padding: 20 }}
                    >
                        {renderHeader}
                        {renderBody}
                    </div>
                </div>
            </section>
        );
    }
}
