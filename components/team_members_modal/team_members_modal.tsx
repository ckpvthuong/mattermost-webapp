// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {Modal} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';

import Permissions from 'mattermost-redux/constants/permissions';

import TeamPermissionGate from 'components/permissions_gates/team_permission_gate';
import MemberListTeam from 'components/member_list_team';
import InvitationModal from 'components/invitation_modal';

import {ModalIdentifiers} from 'utils/constants';

type Props = {
    currentTeam: {
        id: string;
        display_name: string;
    };
    currentTeamSetting?: any;
    onHide: () => void;
    onClose?: () => void;
    onLoad?: () => void;
    actions: {
        openModal: (modalData: {modalId: string; dialogType: any}) => Promise<{
            data: boolean;
        }>;
    };
}

type State = {
    show: boolean;
}

export default class TeamMembersModal extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            show: true,
        };
    }

    componentDidMount() {
        if (this.props.onLoad) {
            this.props.onLoad();
        }
    }

    handleHide = () => {
        this.props.onClose && this.props.onClose();
        this.setState({show: false});
    }

    handleExit = () => {
        this.props.onHide();
        this.props.onClose && this.props.onClose();
    }

    handleInvitePeople = () => {
        const {actions} = this.props;

        actions.openModal({
            modalId: ModalIdentifiers.INVITATION,
            dialogType: InvitationModal,
        });

        this.handleExit();
    }

    render() {
        let {currentTeam, currentTeamSetting} = this.props;
        currentTeam = currentTeamSetting || currentTeam

        let teamDisplayName = '';
        if (currentTeam) {
            teamDisplayName = currentTeam.display_name;
        }

        return (
            <Modal
                dialogClassName='a11y__modal more-modal'
                show={this.state.show}
                onHide={this.handleHide}
                onExited={this.handleExit}
                role='dialog'
                aria-labelledby='teamMemberModalLabel'
                id='teamMembersModal'
            >
                <Modal.Header closeButton={true}>
                    <Modal.Title
                        componentClass='h1'
                        id='teamMemberModalLabel'
                    >
                        <FormattedMessage
                            id='team_member_modal.members'
                            defaultMessage='{team} Members'
                            values={{
                                team: teamDisplayName,
                            }}
                        />
                    </Modal.Title>
                    {/* <TeamPermissionGate
                        teamId={currentTeam.id}
                        permissions={[Permissions.ADD_USER_TO_TEAM, Permissions.INVITE_GUEST]}
                    >
                        <button
                            id='invitePeople'
                            type='button'
                            className='btn btn-primary invite-people-btn'
                            onClick={this.handleInvitePeople}
                        >
                            <FormattedMessage
                                id='team_member_modal.invitePeople'
                                defaultMessage='Invite People'
                            />
                        </button>
                    </TeamPermissionGate> */}
                </Modal.Header>
                <Modal.Body>
                    <MemberListTeam
                        teamId={currentTeam.id}
                    />
                </Modal.Body>
            </Modal>
        );
    }
}
