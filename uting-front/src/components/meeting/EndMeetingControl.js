import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  ControlBarButton,
  Phone,
  Modal,
  ModalBody,
  ModalHeader,
  ModalButton,
  ModalButtonGroup
} from 'amazon-chime-sdk-component-library-react';

import { endMeeting } from '../../utils/api';
import { useAppState } from '../../providers/AppStateProvider';

const EndMeetingControl= () => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);
  const { meetingId } = useAppState();
  const history = useHistory();

  const leaveMeeting = async () => {
    history.push('/main');
  };

  const endMeetingForAll = async () => {
    try {
      if (meetingId) {
        await endMeeting(meetingId);
        history.push('/main');
      }
    } catch (e) {
    }
  };

  return (
    <>
      <ControlBarButton icon={<Phone />} onClick={toggleModal} label="Leave" />
      {showModal && (
        <Modal size="md" onClose={toggleModal} rootId="modal-root">
          <ModalHeader title="End Meeting" />
          <ModalBody>
            <p>
              Leave meeting or you can end the meeting for all. The meeting
              cannot be used once it ends.
            </p>
          </ModalBody>
          <ModalButtonGroup
            primaryButtons={[
              <ModalButton
                onClick={endMeetingForAll}
                variant="primary"
                label="End meeting for all"
                closesModal
              />,
              <ModalButton
                onClick={leaveMeeting}
                variant="primary"
                label="Leave Meeting"
                closesModal
              />,
              <ModalButton variant="secondary" label="Cancel" closesModal />
            ]}
          />
        </Modal>
      )}
    </>
  );
};

export default EndMeetingControl;
