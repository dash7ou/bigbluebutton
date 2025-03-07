import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import BreakoutService from '/imports/ui/components/breakout-room/service';
import Meetings from '/imports/api/meetings';
import Auth from '/imports/ui/services/auth';
import UserListItem from './component';
import UserListService from '/imports/ui/components/user-list/service';
import { layoutDispatch } from '../../../../layout/context';

const UserListItemContainer = (props) => {
  const layoutContextDispatch = layoutDispatch();

  const {
    toggleVoice,
    removeUser,
    toggleUserLock,
    changeRole,
    ejectUserCameras,
    assignPresenter,
    getAvailableActions,
    normalizeEmojiName,
    getGroupChatPrivate,
    hasPrivateChatBetweenUsers,
  } = UserListService;

  return <UserListItem {
    ...{
      layoutContextDispatch,
      toggleVoice,
      removeUser,
      toggleUserLock,
      changeRole,
      ejectUserCameras,
      assignPresenter,
      getAvailableActions,
      normalizeEmojiName,
      getGroupChatPrivate,
      hasPrivateChatBetweenUsers,
      ...props,
    }
  } />;
};
const isMe = (intId) => intId === Auth.userID;

export default withTracker(({ user }) => {
  const findUserInBreakout = BreakoutService.getBreakoutUserIsIn(user.userId);
  const findUserLastBreakout = BreakoutService.getBreakoutUserWasIn(user.userId, null);
  const breakoutSequence = (findUserInBreakout || {}).sequence;
  const Meeting = Meetings.findOne({ meetingId: Auth.meetingID },
    { fields: { lockSettingsProps: 1 } });

  return {
    isMe,
    userInBreakout: !!findUserInBreakout,
    userLastBreakout: findUserLastBreakout,
    breakoutSequence,
    lockSettingsProps: Meeting && Meeting.lockSettingsProps,
    isMeteorConnected: Meteor.status().connected,
    isThisMeetingLocked: UserListService.isMeetingLocked(Auth.meetingID),
    voiceUser: UserListService.curatedVoiceUser(user.userId),
    getEmojiList: UserListService.getEmojiList(),
    getEmoji: UserListService.getEmoji(),
    usersProp: UserListService.getUsersProp(),
  };
})(UserListItemContainer);
