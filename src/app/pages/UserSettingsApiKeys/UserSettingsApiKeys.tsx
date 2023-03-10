import React from 'react';

import { Button } from '../../../components/Button/Button';
import { AnyLink } from '../../../components/AnyLink/AnyLink';
import { DOCUMENTATION_URL } from '../../../config/config';

import { Alert } from '../../../components/Alert/Alert';
import { apiErrorToaster } from '../../../api/utils';
import {
  SettingsDesc,
  SettingsHeader,
  SettingsPageHeader,
  SettingsSection,
} from '../../../components/Settings/Settings';
import {
  ModalForm,
  ModalFormActions,
  ModalFormBody, ModalFormCancelButton, ModalFormSubmitButton,
} from '../../../components/Modal/ModalForm/ModalForm';
import { ApiKeyForm } from '../../../components/ApiKeyForm/ApiKeyForm';
import { ApiKeysList } from '../../../components/ApiKeysList/ApiKeysList';
import { ApiKeyFormFields } from '../../../components/ApiKeyForm/ApiKeyFormFields';
import { useApiKeys } from './apiKeys';

export const UserSettingsApiKeys = () => {
  const {
    state, onCreateToken, revoke, get, newToken,
  } = useApiKeys();
  const [showCreationForm, setShowCreationForm] = React.useState(false);

  React.useEffect(() => {
    get();
  }, []);

  return (
    <>
      <ModalForm
        isOpen={showCreationForm}
        onRequestClose={() => setShowCreationForm(false)}
        title="Create new API key"
      >
        <ApiKeyForm
          onSuccess={(token) => {
            onCreateToken(token);
            setShowCreationForm(false);
          }}
          onFail={apiErrorToaster}
        >
          <ModalFormBody>
            <ApiKeyFormFields />
          </ModalFormBody>
          <ModalFormActions>
            <ModalFormCancelButton />
            <ModalFormSubmitButton
              data-qa="api_key_form_submit"
            >
              Create
            </ModalFormSubmitButton>
          </ModalFormActions>
        </ApiKeyForm>
      </ModalForm>
      {/* <ModalForm */}
      {/*  formId={formId} */}
      {/*  form={( */}
      {/*    <ApiKeyForm */}
      {/*      id={formId} */}
      {/*      onSubmit={(data: ApiKeyCreateRequest) => { */}
      {/*        create(data).then(() => { */}
      {/*          setShowCreationForm(false); */}
      {/*        }).catch(apiErrorToaster); */}
      {/*      }} */}
      {/*    /> */}
      {/*  )} */}
      {/*  submitBtnProps={{ */}
      {/*    // @ts-ignore */}
      {/*    'data-qa': 'api_key_form_submit', */}
      {/*    children: 'Create', */}
      {/*  }} */}
      {/* /> */}
      <div>
        <SettingsPageHeader>
          Developer Settings
        </SettingsPageHeader>
        <SettingsSection>
          <SettingsHeader>
            <span>
              API keys
            </span>
            <Button
              size="s"
              appearance="secondary"
              onClick={() => setShowCreationForm(true)}
              data-qa="api_key_create_button"
            >
              Generate new API key
            </Button>
          </SettingsHeader>
          <SettingsDesc>
            Generated API keys can be used to access
            {' '}
            <AnyLink
              as="a"
              target="_blank"
              href={DOCUMENTATION_URL}
            >
              our API
            </AnyLink>
            .
          </SettingsDesc>
          {newToken && (
            <SettingsDesc>
              <Alert>
                Make sure to copy your personal access token now. You won’t be able to see it again!
              </Alert>
            </SettingsDesc>
          )}
          <SettingsDesc>
            <ApiKeysList
              newKey={newToken}
              apiKeys={state.list}
              onRevoke={revoke}
            />
          </SettingsDesc>
        </SettingsSection>
      </div>
    </>
  );
};
