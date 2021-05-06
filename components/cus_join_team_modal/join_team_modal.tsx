// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-literals */

import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

import { Team } from 'mattermost-redux/types/teams';

import './join_team_modal.scss';
import LocalizedIcon from 'components/localized_icon';
import { t } from 'utils/i18n';
import TeamList from './list';
import { FormattedMessage } from 'react-intl';

export const TEAMS_PER_PAGE = 5;

// const TEAM_MEMBERSHIP_DENIAL_ERROR_ID = 'api.team.add_members.user_denied';

type Props = {
    onHide: () => void;
    onLoad?: () => void;
    actions: {
        openModal: (modalData: {
            modalId: string;
            dialogType: any;
        }) => Promise<{
            data: boolean;
        }>;
        getTeams: (
            page?: number,
            perPage?: number,
            includeTotalCount?: boolean
        ) => any;
        loadRolesIfNeeded: (roles: Iterable<string>) => any;
        addUserToTeam: (teamId: string, userId?: string) => any;
    };
    currentUserId: string;
    currentUserRoles: string;
    listableTeams: Team[];
};

export const JoinTeamModal = (props: Props) => {
    const [showing, setShowing] = useState(true);
    const [loadingTeamId, setLoadingTeamId] = useState('');
    const [error, setError] = useState(null);
    const [endofTeamsData, setEndofTeamsData] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentListableTeams, setCurrentListableTeams] = useState<Team[]>([]);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (props.onLoad) {
            props.onLoad();
        }
        fetchMoreTeams();
        if (props.currentUserRoles !== undefined) {
            props.actions.loadRolesIfNeeded(props.currentUserRoles.split(' '));
        }
    }, []);

    const searchTeams = (event: any) => {
        setSearchTerm(event.target.value);
    };

    const fetchMoreTeams = async () => {
        const response = await props.actions.getTeams(
            currentPage,
            TEAMS_PER_PAGE,
            true,
        );

        // console.log(response)

        // We don't want to increase the page number if no data came back previously
        if (!response.error && !(response.error instanceof Error)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleHide = () => {
        setShowing(false);
    };

    const handleExit = () => {
        props.onHide();
    };

    const handleTeamClick = async (team: Team) => {
        const { currentUserRoles } = props;
        setLoadingTeamId(team.id);
        const { data } = await props.actions.addUserToTeam(
            team.id,
            props.currentUserId,
        );
    };

    return (
        <Modal
            dialogClassName='a11y__modal more-modal'
            show={showing}
            onHide={handleHide}
            onExited={handleExit}
            role='dialog'
            aria-labelledby='teamMemberModalLabel'
            id='teamMembersModal'
        >
            <Modal.Header closeButton={true}>
                <Modal.Title
                    componentClass='h1'
                    id='teamMemberModalLabel'
                // eslint-disable-next-line react/jsx-no-literals
                >
                    <FormattedMessage
                        id='myteams.searchTeamsHeader'
                        defaultMessage='Click to join public team'
                    />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='p-4 join-team'>
                <TeamList closeModal={handleExit}/>
            </Modal.Body>
        </Modal>
    );
};
