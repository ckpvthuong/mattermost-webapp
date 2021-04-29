// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {ActionResult} from 'mattermost-redux/types/actions';
import {UserProfile} from 'mattermost-redux/types/users';
import {TeamMembership, TeamStats, GetTeamMembersOpts} from 'mattermost-redux/types/teams';
import {Teams} from 'mattermost-redux/constants';

import Constants from 'utils/constants';
import * as UserAgent from 'utils/user_agent';

import SearchableUserList from 'components/searchable_user_list/searchable_user_list_container.jsx';
import TeamMembersDropdown from 'components/team_members_dropdown';

const USERS_PER_PAGE = 50;

type TeamMembers = {
    [userId: string]: TeamMembership;
}

type Props = {
    searchTerm: string;
    users: UserProfile[];
    teamMembers: {
        [userId: string]: TeamMembership;
    };
    // currentTeamId: string;
    teamId: string;
    totalTeamMembers: number;
    canManageTeamMembers?: boolean;
    actions: {
        getTeamMembers: (teamId: string, page?: number, perPage?: number, options?: GetTeamMembersOpts) => Promise<{data: TeamMembership}>;
        searchProfiles: (term: string, options?: {[key: string]: any}) => Promise<{data: UserProfile[]}>;
        getTeamStats: (teamId: string) => Promise<{data: TeamStats}>;
        loadProfilesAndTeamMembers: (page: number, perPage: number, teamId?: string, options?: {[key: string]: any}) => Promise<{
            data: boolean;
        }>;
        loadStatusesForProfilesList: (users: UserProfile[]) => Promise<{
            data: boolean;
        }>;
        loadTeamMembersForProfilesList: (profiles: any, teamId: string, reloadAllMembers: boolean) => Promise<{
            data: boolean;
        }>;
        setModalSearchTerm: (term: string) => ActionResult;
    };
}

type State = {
    loading: boolean;
}

export default class MemberListTeam extends React.PureComponent<Props, State> {
    private searchTimeoutId: number;

    constructor(props: Props) {
        super(props);

        this.searchTimeoutId = 0;

        this.state = {
            loading: true,
        };
    }

    async componentDidMount() {
        const arr = await Promise.all([
            this.props.actions.loadProfilesAndTeamMembers(0, Constants.PROFILE_CHUNK_SIZE, this.props.teamId, {active: true}),
            this.props.actions.getTeamMembers(this.props.teamId, 0, Constants.DEFAULT_MAX_USERS_PER_TEAM,
                {
                    sort: Teams.SORT_USERNAME_OPTION,
                    exclude_deleted_users: true,
                } as GetTeamMembersOpts,
            ),
            this.props.actions.getTeamStats(this.props.teamId),
        ]);
        
        this.loadComplete();
    }

    componentWillUnmount() {
        this.props.actions.setModalSearchTerm('');
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.searchTerm !== this.props.searchTerm) {
            clearTimeout(this.searchTimeoutId);

            const searchTerm = this.props.searchTerm;
            if (searchTerm === '') {
                this.loadComplete();
                this.searchTimeoutId = 0;
                return;
            }

            const searchTimeoutId = window.setTimeout(
                async () => {
                    const {
                        loadStatusesForProfilesList,
                        loadTeamMembersForProfilesList,
                        searchProfiles,
                    } = this.props.actions;
                    const {data} = await searchProfiles(searchTerm, {team_id: this.props.teamId});

                    if (searchTimeoutId !== this.searchTimeoutId) {
                        return;
                    }

                    this.setState({loading: true});

                    loadStatusesForProfilesList(data);
                    loadTeamMembersForProfilesList(data, this.props.teamId, true).then(({data: membersLoaded}) => {
                        if (membersLoaded) {
                            this.loadComplete();
                        }
                    });
                },
                Constants.SEARCH_TIMEOUT_MILLISECONDS,
            );

            this.searchTimeoutId = searchTimeoutId;
        }
    }

    loadComplete = () => {
        this.setState({loading: false});
    }

    nextPage = async (page: number) => {
        this.setState({loading: true});
        const arr = await Promise.all([
            this.props.actions.loadProfilesAndTeamMembers(page, USERS_PER_PAGE, this.props.teamId, {active: true}),
            this.props.actions.getTeamMembers(this.props.teamId, page, Constants.DEFAULT_MAX_USERS_PER_TEAM,
                {
                    sort: Teams.SORT_USERNAME_OPTION,
                    exclude_deleted_users: true,
                } as GetTeamMembersOpts,
            ),
        ]);
        //this.loadComplete();
        this.setState({loading: false})
    }

    search = (term: string) => {
        this.props.actions.setModalSearchTerm(term);
    }

    render() {
        let teamMembersDropdown = null;
        if (this.props.canManageTeamMembers) {
            teamMembersDropdown = [TeamMembersDropdown];
        }
        
        const {totalTeamMembers} = this.props
        
        // let teamMembers: {
        //     [userId: string]: TeamMembership;
        // } = {};
        //this.props.teamMembers.forEach( (item: any) => {teamMembers = {...teamMembers, [item.user_id]: item}} )
        
        const teamMembers = this.props.teamMembers

        const users = this.props.users;
        console.log(users)
        const actionUserProps: {
            [userId: string]: {
                teamMember: TeamMembership;
            };
        } = {};

        let usersToDisplay;
        if (this.state.loading) {
            usersToDisplay = null;
        } else {
            usersToDisplay = [];

            for (let i = 0; i < users.length; i++) {
                const user = users[i];

                if (teamMembers[user.id] && user.delete_at === 0) {
                    usersToDisplay.push(user);
                    actionUserProps[user.id] = {
                        teamMember: teamMembers[user.id],
                    };
                }
            }
        }
        console.log(usersToDisplay)
        return (
            <SearchableUserList
                users={usersToDisplay}
                usersPerPage={USERS_PER_PAGE}
                total={totalTeamMembers}
                nextPage={this.nextPage}
                search={this.search}
                actions={teamMembersDropdown}
                actionUserProps={actionUserProps}
                focusOnMount={!UserAgent.isMobile()}
            />
        );
    }
}
