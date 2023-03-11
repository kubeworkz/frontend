import React from 'react';
import { ModalHeader } from '../../components/Modal/ModalHeader';
import { ModalActions } from '../../components/Modal/ModalActions';
import { Button } from '../../components/Button/Button';
import { Modal } from '../../components/Modal/Modal';
import { ModalBody } from '../../components/Modal/ModalBody';
import { ProjectsItemForm, ProjectsItemFormProps } from './ProjectsItemForm';

export const ProjectsItemFormModal = (props: ProjectsItemFormProps) => (
  <Modal
    isOpen
    onRequestClose={props.onDecline}
  >
    <ModalHeader>
      Edit project
      {' '}
      {props.project.id}
    </ModalHeader>
    <ModalBody>
      <ProjectsItemForm {...props} />
    </ModalBody>
    <ModalActions>
      <Button
        type="button"
        onClick={props.onDecline}
        appearance="secondary"
      >
        Close
      </Button>
      <Button type="submit" form="project_edit">Save</Button>
    </ModalActions>
  </Modal>
);
