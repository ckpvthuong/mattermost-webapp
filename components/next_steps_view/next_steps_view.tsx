// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { Dispatch } from "redux";
import { GenericAction, GetStateFunc } from "mattermost-redux/types/actions";
import { UserProfile } from "mattermost-redux/types/users";
import { Permissions } from "mattermost-redux/constants";
import { Team } from "mattermost-redux/types/teams";
import * as Utils from "utils/utils";
import { trackEvent } from "actions/telemetry_actions";
import SystemPermissionGate from "components/permissions_gates/system_permission_gate";
import MyTeamItem from "components/my_team/my_team_item";
import CloseIcon from "components/widgets/icons/close_icon";
import "./next_steps_view.scss";
import { getSiteURL } from "utils/url";
import team from "components/admin_console/team_channel_settings/team";
import { t } from "utils/i18n";
import ToggleModalButtonRedux from "components/toggle_modal_button_redux";
import { ModalIdentifiers } from "utils/constants";
import JoinTeamModal from "components/join_team_modal";
import CusJoinTeamModal from "components/cus_join_team_modal";

// import OnboardingSuccessSvg from './images/onboarding-success-svg';

type Props = {
  currentTeam: Team;
  currentUser: UserProfile;
  actions: {
    setShowNextStepsView: (show: boolean) => void;
    closeRightHandSide: () => void;
    switchTeam: (
      url: string
    ) => (dispatch: Dispatch<GenericAction>, getState: GetStateFunc) => void;
    getTeamsForUserWithOptions: (userId: any, options: any) => any;
    getUserByEmail: (email: string) => any;
  };
};

type State = {
  myTeams: Team[];
  filterValue: string;
  orgTeams: Team[];
  inviteID: string;
};

export default class NextStepsView extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      myTeams: [],
      filterValue: "all",
      orgTeams: [],
      inviteID: "",
    };
  }

  async componentDidMount() {
    this.props.actions.closeRightHandSide();
    const myTeams = await this.props.actions.getTeamsForUserWithOptions(
      this.props.currentUser.id,
      {}
    );

    let orgTeams: Team[] = [];
    if (this.props.currentTeam.email) {
      if (this.props.currentTeam.email === this.props.currentUser.email) {
        orgTeams = myTeams.filter(
          (team: { email: any }) => team.email == this.props.currentUser.email
        );
      } else {
        const { data } = await this.props.actions.getUserByEmail(
          this.props.currentTeam.email
        );
        orgTeams = await this.props.actions.getTeamsForUserWithOptions(
          data.id,
          { created: true }
        );
      }
    }
    this.setState({ myTeams: myTeams, orgTeams: orgTeams });
  }

  handleFilterChange = async (e: any) => {
    const fvalue = e.target.value;
    this.setState({ filterValue: fvalue });
  };

  filterTeam = () => {
    const { myTeams, orgTeams } = this.state;
    const myTeamsIds = myTeams.map((v, i, a) => v.id);
    switch (this.state.filterValue) {
      case "my_all":
        return myTeams;
      case "my_created":
        return myTeams.filter(
          (team) => team.email == this.props.currentUser.email
        );
      case "org_pub_can_join":
        return orgTeams.filter(
          (team) =>
            team.allow_open_invite === true &&
            !myTeamsIds.includes(team.id) &&
            team.email == this.props.currentTeam.email
        );
      case "all_org_pub":
        return orgTeams.filter(
          (team) =>
            team.allow_open_invite === true &&
            team.email == this.props.currentTeam.email
        );
      case "org_pri_cant_join":
        return orgTeams.filter(
          (team) =>
            team.allow_open_invite === false &&
            !myTeamsIds.includes(team.id) &&
            team.email == this.props.currentTeam.email
        );
      case "org_all":
        return orgTeams;
      default:
        return myTeams;
    }
  };

  public handleTeamURLInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ inviteID: e.target.value });
  };

  render() {
    const { currentTeam } = this.props;

    let teamArr = this.filterTeam();

    const renderListTeam = teamArr.map((team) => (
      <MyTeamItem
        key={"team_" + team.name}
        team_id={team.id}
        onTeamClick={team.allow_open_invite ? this.props.actions.switchTeam : null}
      />
    ));

    const renderLinkCreateTeam = (
      <SystemPermissionGate permissions={[Permissions.CREATE_TEAM]}>
        <div
          className="margin--extra"
          style={{ marginTop: "0.5em", fontSize: 20, minWidth: 70 }}
        >
          <Link
            id="createNewTeamLink"
            to="/create_team"
            onClick={() => trackEvent("select_team", "click_create_team")}
            className="signup-team-login"
          >
            <FormattedMessage
              id="login.createTeam"
              defaultMessage="Create a team"
            />
          </Link>
        </div>
      </SystemPermissionGate>
    );

    const renderInvite = (
      <div
        className="margin--extra"
        style={{ marginTop: "0.5em", fontSize: 20, minWidth: 70 }}
      >
        <Link to="/select_team" className="signup-team-login">
          <FormattedMessage
            id="myteams.join_by_code"
            defaultMessage="Join by code"
          />
        </Link>
      </div>
    );

    const renderHeader = (
      <div
        className="NextStepsView__header"
        style={{ padding: 0, alignItems: "baseline" }}
      >
        {renderLinkCreateTeam}
        <span style={{ marginLeft: 10, marginRight: 10 }}>
          <FormattedMessage id="myteams.or" defaultMessage="or" />
        </span>

        {renderInvite}
        <CloseIcon
          id="closeIcon"
          className="close-icon"
          onClick={() => this.props.actions.setShowNextStepsView(false)}
          style={{ marginLeft: "auto" }}
        />
      </div>
    );

    const renderTeamBox = <div style={{ marginTop: 20 }}>{renderListTeam}</div>;

    const renderFilter = (
      <div>
        <select
          id="myteamsfilter"
          className="form-control"
          value={this.state.filterValue}
          onChange={this.handleFilterChange}
          style={{ marginLeft: 0, width: 500 }}
        >
          <option value={"my_all"}>
            {Utils.localizeMessage("myteams.my_all", "My All Teams")}
          </option>
          <option value={"my_created"}>
            {Utils.localizeMessage("myteams.my_created", "My Created")}
          </option>
          <option value={"org_pub_can_join"}>
            {Utils.localizeMessage(
              "myteams.org_pub_can_join",
              "Organization Public Teams you can join"
            )}
          </option>
          <option value={"all_org_pub"}>
            {Utils.localizeMessage(
              "myteams.all_org_pub",
              "All Organization Public Teams"
            )}
          </option>
          <option value={"org_pri_cant_join"}>
            {Utils.localizeMessage(
              "myteams.org_pri_cant_join",
              "Organization Private Teams"
            )}
          </option>
          <option value={"org_all"}>
            {Utils.localizeMessage("myteams.org_all", "Organization All Teams")}
          </option>
        </select>
      </div>
    );

    const renderBody = (
      <div style={{ width: "100%", marginTop: 40 }}>
        {renderFilter}
        {renderTeamBox}
      </div>
    );

    return (
      <section id="app-content" className="app__content NextStepsView">
        <div className="NextStepsView__viewWrapper NextStepsView__completedView completed">
          <div style={{ padding: 20 }}>
            {renderHeader}

            {/* <FormattedMessage
                            id='myteams.search_message'
                            defaultMessage='Search'
                        /> */}
            <ToggleModalButtonRedux
              style={{ marginLeft: 0 }}
              id="joinTeam"
              modalId={ModalIdentifiers.JOIN_ANOTHER_TEAM}
              dialogType={CusJoinTeamModal}
              modal
            >
              <button
                className="btn btn-primary"
                style={{ marginLeft: 0, marginTop: 10 }}
              >
                <FormattedMessage
                  id="myteams.search_button"
                  defaultMessage="Search"
                />
              </button>
            </ToggleModalButtonRedux>

            {renderBody}
          </div>
        </div>
      </section>
    );
  }
}
