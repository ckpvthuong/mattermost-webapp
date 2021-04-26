// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode, MouseEvent} from 'react';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router-dom';

import {Permissions} from 'mattermost-redux/constants';

import {Team} from 'mattermost-redux/types/teams';
import {Dispatch} from 'redux';
import {GenericAction, GetStateFunc} from 'mattermost-redux/types/actions';

import {emitUserLoggedOutEvent} from 'actions/global_actions';
import {trackEvent} from 'actions/telemetry_actions.jsx';

import logoImage from 'images/logo.png';

import AnnouncementBar from 'components/announcement_bar';

import BackButton from 'components/common/back_button';
import LoadingScreen from 'components/loading_screen';

import SystemPermissionGate from 'components/permissions_gates/system_permission_gate';
import SiteNameAndDescription from 'components/common/site_name_and_description';
import LogoutIcon from 'components/widgets/icons/fa_logout_icon';

import MyTeamItem from './my_team_item';

export const TEAMS_PER_PAGE = 30;

type Actions = {
    getTeams: (page?: number, perPage?: number, includeTotalCount?: boolean) => any;
    loadRolesIfNeeded: (roles: Iterable<string>) => any;
    addUserToTeam: (teamId: string, userId?: string) => any;
    switchTeam: (url: string) => (dispatch: Dispatch<GenericAction>, getState: GetStateFunc) => void;
}

type Props = {
    currentUserId: string;
    currentUserRoles: string;
    currentUserIsGuest?: boolean;
    customDescriptionText?: string;
    isMemberOfTeam: boolean;
    listableTeams: Team[];
    siteName?: string;
    canCreateTeams: boolean;
    canManageSystem: boolean;
    canJoinPublicTeams: boolean;
    canJoinPrivateTeams: boolean;
    history?: any;
    siteURL?: string;
    actions: Actions;
    totalTeamsCount: number;
    myTeams: Team[];
};

type State = {
    loadingTeamId?: string;
    error: any;
    endofTeamsData: boolean;
    currentPage: number;
    currentListableTeams: Team[];
}

export default class MyTeam extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            loadingTeamId: '',
            error: null,
            endofTeamsData: false,
            currentPage: 0,
            currentListableTeams: [],
        };
    }

    static getDerivedStateFromProps(props: Props, state: State) {
        if (props.listableTeams.length !== state.currentListableTeams.length) {
            return {
                currentListableTeams: props.listableTeams.slice(0, TEAMS_PER_PAGE * state.currentPage),
            };
        }
        return null;
    }

    componentDidMount() {
        trackEvent('signup', 'signup_select_team', {userId: this.props.currentUserId});
        this.fetchMoreTeams();
        if (this.props.currentUserRoles !== undefined) {
            this.props.actions.loadRolesIfNeeded(this.props.currentUserRoles.split(' '));
        }
    }

    fetchMoreTeams = async () => {
        const {currentPage} = this.state;
        const {actions} = this.props;

        const response = await actions.getTeams(currentPage, TEAMS_PER_PAGE, true);

        // We don't want to increase the page number if no data came back previously
        if (!response.error && !(response.error instanceof Error)) {
            this.setState((prevState) => (
                {
                    currentPage: prevState.currentPage + 1,
                }
            ),
            );
        }
    }

    handleLogoutClick = (e: MouseEvent): void => {
        e.preventDefault();
        trackEvent('select_team', 'click_logout');
        emitUserLoggedOutEvent('/login');
    };

    clearError = (e: MouseEvent): void => {
        e.preventDefault();

        this.setState({
            error: null,
        });
    };

    render(): ReactNode {
        const {
            currentUserIsGuest,
            customDescriptionText,
            isMemberOfTeam,
            siteName,
            canCreateTeams,
        } = this.props;

        let openContent;
        if (this.state.loadingTeamId) {
            openContent = <LoadingScreen/>;
        } else if (this.state.error) {
            openContent = (
                <div className='signup__content'>
                    <div className={'form-group has-error'}>
                        <label className='control-label'>{this.state.error}</label>
                    </div>
                </div>
            );
        } else if (currentUserIsGuest) {
            openContent = (
                <div className='signup__content'>
                    <div className={'form-group has-error'}>
                        <label className='control-label'>
                            <FormattedMessage
                                id='signup_team.guest_without_channels'
                                defaultMessage='Your guest account has no channels assigned. Please contact an administrator.'
                            />
                        </label>
                    </div>
                </div>
            );
        } else {
            let joinableTeamContents: any = [];
            this.props.myTeams.forEach((listableTeam) => {
                joinableTeamContents.push(
                    <MyTeamItem
                        key={'team_' + listableTeam.name}
                        team={listableTeam}
                        onTeamClick={this.props.actions.switchTeam}
                    />,
                );
            });

            if (joinableTeamContents.length === 0 && (canCreateTeams)) {
                joinableTeamContents = (
                    <div className='signup-team-dir-err'>
                        <div>
                            <FormattedMessage
                                id='signup_team.no_open_teams_canCreate'
                                defaultMessage='No teams are available to join. Please create a new team or ask your administrator for an invite.'
                            />
                        </div>
                    </div>
                );
            } else if (joinableTeamContents.length === 0) {
                joinableTeamContents = (
                    <div className='signup-team-dir-err'>
                        <div>
                            <SystemPermissionGate permissions={[Permissions.CREATE_TEAM]}>
                                <FormattedMessage
                                    id='signup_team.no_open_teams_canCreate'
                                    defaultMessage='No teams are available to join. Please create a new team or ask your administrator for an invite.'
                                />
                            </SystemPermissionGate>
                            <SystemPermissionGate
                                permissions={[Permissions.CREATE_TEAM]}
                                invert={true}
                            >
                                <FormattedMessage
                                    id='signup_team.no_open_teams'
                                    defaultMessage='No teams are available to join. Please ask your administrator for an invite.'
                                />
                            </SystemPermissionGate>
                        </div>
                    </div>
                );
            }

            openContent = (
                <div
                    id='teamsYouCanJoinContent'
                    className='signup__content'
                >
                    <h4>
                        <FormattedMessage
                            id='signup_team.join_open'
                            defaultMessage='Teams you can join: '
                        />
                    </h4>
                    <div className='row'>
                        {joinableTeamContents}
                    </div>
                </div>
            );
        }

        const teamSignUp = (
            <SystemPermissionGate permissions={[Permissions.CREATE_TEAM]}>
                <div
                    className='margin--extra'
                    style={{marginTop: '0.5em'}}
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

        let headerButton;
        if (this.state.error) {
            headerButton = <BackButton onClick={this.clearError}/>;
        } else if (isMemberOfTeam) {
            headerButton = <BackButton/>;
        } else {
            headerButton = (
                <div className='signup-header'>
                    <a
                        href='#'
                        id='logout'
                        onClick={this.handleLogoutClick}
                    >
                        <LogoutIcon/>
                        <FormattedMessage
                            id='web.header.logout'
                            defaultMessage='Logout'
                        />
                    </a>
                </div>
            );
        }
        return (
            <div>
                <AnnouncementBar/>
                {headerButton}
                <div className='col-sm-12'>
                    <div
                        className={'select-team__container signup-team__container'}
                    >
                        <img
                            alt={'signup team logo'}
                            className='signup-team-logo'
                            src={logoImage}
                        />
                        <SiteNameAndDescription
                            customDescriptionText={customDescriptionText}
                            siteName={siteName}
                        />
                        {teamSignUp}
                        {openContent}
                    </div>
                </div>
            </div>
        );
    }
}
