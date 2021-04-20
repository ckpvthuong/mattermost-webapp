// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router-dom';
import {Dispatch} from 'redux';
import {GenericAction, GetStateFunc} from 'mattermost-redux/types/actions';

import {PreferenceType} from 'mattermost-redux/types/preferences';
import {UserProfile} from 'mattermost-redux/types/users';
import {Permissions} from 'mattermost-redux/constants';
import {Team} from 'mattermost-redux/types/teams';

import {pageVisited, trackEvent} from 'actions/telemetry_actions';
import {getAnalyticsCategory} from 'components/next_steps_view/step_helpers';

import logoImage from 'images/logo.png';
import AnnouncementBar from 'components/announcement_bar';
import SiteNameAndDescription from 'components/common/site_name_and_description';
import SystemPermissionGate from 'components/permissions_gates/system_permission_gate';
import LoadingScreen from 'components/loading_screen';
import MyTeamItem from 'components/my_team/components/my_team_item';
import CloseIcon from 'components/widgets/icons/close_icon';

import {StepType} from './steps';
import './next_steps_view.scss';

// import NextStepsTips from './next_steps_tips';
import OnboardingBgSvg from './images/onboarding-bg-svg';

// import OnboardingSuccessSvg from './images/onboarding-success-svg';

type Props = {
    myTeams: Team[];
    currentUser: UserProfile;
    canCreateTeams: boolean;
    currentUserIsGuest?: boolean;
    preferences: PreferenceType[];
    isFirstAdmin: boolean;
    steps: StepType[];
    siteName?: string;
    customDescriptionText?: string;
    actions: {
        savePreferences: (userId: string, preferences: PreferenceType[]) => void;
        setShowNextStepsView: (show: boolean) => void;
        closeRightHandSide: () => void;
        getProfiles: () => void;
        switchTeam: (url: string) => (dispatch: Dispatch<GenericAction>, getState: GetStateFunc) => void;
    };
};

type State = {
    showFinalScreen: boolean;
    showTransitionScreen: boolean;
    animating: boolean;
    show: boolean;
    loadingTeamId?: string;
    error: any;
}

export default class NextStepsView extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            loadingTeamId: '',
            showFinalScreen: false,
            showTransitionScreen: false,
            animating: false,
            show: false,
            error: null,
        };
    }

    async componentDidMount() {
        await this.props.actions.getProfiles();

        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({show: true});
        pageVisited(getAnalyticsCategory(this.props.isFirstAdmin), 'pageview_welcome');
        this.props.actions.closeRightHandSide();
    }

    stopAnimating = () => {
        this.setState({animating: false});
    }

    render() {
        const {
            currentUserIsGuest,
            customDescriptionText,
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

        return (
            <section
                id='app-content'
                className='app__content NextStepsView'
            >
                {this.state.show &&
                <>
                    <OnboardingBgSvg/>
                    <div>
                        <header className='NextStepsView__header'>
                            <div className='NextStepsView__header-headerText'>
                                <AnnouncementBar/>
                            </div>
                            <CloseIcon
                                id='closeIcon'
                                className='close-icon'
                                onClick={() => {}}
                            />
                        </header>
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
                </>}
            </section>
        );
    }
}
