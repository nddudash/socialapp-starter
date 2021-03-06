import React from "react";
import ProfilePictureDisplay from "../profilePictureDisplay/ProfilePictureDisplay";
import UserAboutDisplay from "../userAboutDisplay/UserAboutDisplay";
import UserDataService from "../../services/UserDataService";
import { Card } from "semantic-ui-react";
import UploadProfilePicture from "../uploadProfilePicture/UploadProfilePicture";
import "./ProfilePictureParent.css";
import UpdateUserInfoForm from "../updateUserInfoForm/UpdateUserInfoForm";
import DeleteUser from "../deleteUser/DeleteUser";
import GetUserPictureService from "../../services/GetUserPictureService";

class ProfilePictureParent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageData: null,
      userAboutInfo: null,
      userUsername: null,
      userDisplayname: null,
    };

    //Gets the User's info, set's it in state
    this.userInfo = UserDataService.getDirectUser(
      this.props.usernameFromURL
    ).then((response) => {
      this.setState({
        userAboutInfo: response.data.user.about,
        userUsername: response.data.user.username,
        userDisplayname: response.data.user.displayName,
      });
    });

    this.GetUserPictureService = new GetUserPictureService();
  }

  componentDidMount = (event) => {
    this.GetUserPictureService.GetUserPicture(this.props.usernameFromURL)
      .then((result) => {
        this.setState({
          imageData: result.config.url,
        });
      })
      .catch((error) => {
        if (error.response.data.statusCode === 404) {
          this.setState({
            imageData: 404,
          });
        }
      });
  };

  updateImage = (uploadImage) => {
    this.GetUserPictureService.GetUserPictureTimestamped(
      this.props.usernameFromURL
    )
      .then((result) => {
        this.setState({
          imageData: result.config.url,
        });
      })
      .catch((error) => {
        if (error.response.data.statusCode === 404) {
          this.setState({
            imageData: 404,
          });
        }
      });
  };

  render() {
    if (this.state.userUsername === this.props.loggedInUser) {
      return (
        <div className="ProfilePictureParent">
          <Card className="ProfileParentCard">
            <Card.Content className="ProfileCardContentImage">
              <ProfilePictureDisplay
                usernameFromURL={this.props.usernameFromURL}
                imageData={this.state.imageData}
              />
            </Card.Content>
            <Card.Content className="ProfileCardContentBody" extra>
              <Card.Header className="cardHeader">
                {this.state.userDisplayname}
              </Card.Header>
              <Card.Description>
                <UserAboutDisplay userAboutInfo={this.state.userAboutInfo} />
              </Card.Description>
            </Card.Content>
            <Card.Content className="ProfileCardUserControls">
              <UploadProfilePicture updateImage={this.updateImage} />
              <UpdateUserInfoForm />
              <DeleteUser />
            </Card.Content>
          </Card>
        </div>
      );
    }

    return (
      <div className="ProfilePictureParent">
        <Card className="ProfileParentCard">
          <Card.Content className="ProfileCardContentImage">
            <ProfilePictureDisplay
              usernameFromURL={this.props.usernameFromURL}
              imageData={this.state.imageData}
            />
          </Card.Content>
          <Card.Content className="ProfileCardContentBody" extra>
            <Card.Header id="cardHeader">
              {this.state.userDisplayname}
            </Card.Header>
            <Card.Description>
              <UserAboutDisplay userAboutInfo={this.state.userAboutInfo} />
            </Card.Description>
          </Card.Content>
        </Card>
      </div>
    );
  }
}

export default ProfilePictureParent;
