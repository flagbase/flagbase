import React, { useState } from 'react';

import { Button } from '@flagbase/ui';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import {
  Route,
  Navigate,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import {
  environmentsLoader,
  flagsLoader,
  instancesLoader,
  projectsLoader,
  sdkLoader,
  targetingLoader,
  variationsLoader,
  workspacesLoader,
} from './loaders';
import { RouteParams } from './router.types';
import PageLayout from '../components/page-layout';
import { PageHeadings } from '../components/page-layout/page-headings';
import { EditEnvironment } from '../pages/environments/edit-environment';
import Environments from '../pages/environments/environments';
import { CreateEnvironment } from '../pages/environments/environments.modal';
import { Error } from '../pages/error';
import Flags from '../pages/flags';
import { FlagSettings } from '../pages/flags/flags.edit';
import { CreateFlag, ModalProps } from '../pages/flags/flags.modal';
import Instances from '../pages/instances/instances';
import { AddNewInstanceModal } from '../pages/instances/instances.modal';
import { EditInstance } from '../pages/instances/instances.settings';
import Projects from '../pages/projects';
import '../tailwind/tailwind.css';
import { Project } from '../pages/projects/project';
import EditProject from '../pages/projects/projects.edit';
import { CreateProjectModal } from '../pages/projects/projects.modal';
import { SdkSettings } from '../pages/sdks/sdk.settings';
import { Sdks } from '../pages/sdks/sdks';
import { CreateSDKModal } from '../pages/sdks/sdks.modal';
import { Targeting } from '../pages/targeting/targeting';
import VariationSettings from '../pages/variations/variation.settings';
import Variations from '../pages/variations/variations';
import { CreateVariation } from '../pages/variations/variations.modal';
import { CreateWorkspaceModal } from '../pages/workspaces/workspace.modal';
import { EditWorkspace } from '../pages/workspaces/workspaces.edit';
import MainWorkspaces from '../pages/workspaces/workspaces.main';

const {
  InstanceKey,
  WorkspaceKey,
  ProjectKey,
  EnvironmentKey,
  FlagKey,
  SdkKey,
  VariationKey,
} = RouteParams;

function ModalWithButton({
  buttonText,
  modal,
}: {
  buttonText: string;
  modal: React.FC<ModalProps>;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        onClick={() => setVisible(true)}
        className="py-2"
        type="button"
        suffix={PlusCircleIcon}
      >
        {buttonText}
      </Button>

      {React.createElement(modal, {
        visible: visible,
        setVisible: setVisible,
      })}
    </>
  );
}

export default createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<PageLayout />} errorElement={<Error />}>
      <Route path="/" element={<Navigate to="/instances" />} />
      <Route path="/instances" element={<PageHeadings />}>
        <Route
          loader={instancesLoader}
          path=""
          element={<Instances />}
          handle={{
            rightContainer: () => (
              <ModalWithButton
                buttonText={'Join Instance'}
                modal={AddNewInstanceModal}
              />
            ),
          }}
        />
      </Route>
      <Route path={`/${InstanceKey}/workspaces`} element={<PageHeadings />}>
        <Route
          loader={workspacesLoader}
          errorElement={<Error />}
          path=""
          element={<MainWorkspaces />}
          handle={{
            rightContainer: () => (
              <ModalWithButton
                buttonText={'Create Workspace'}
                modal={CreateWorkspaceModal}
              />
            ),
          }}
        />
        <Route path="settings" element={<EditInstance />} />
        <Route path={`${WorkspaceKey}`} errorElement={<Error />}>
          <Route path="settings" element={<EditWorkspace />} />
          <Route path="" element={<>Workspace view</>} />
          <Route path="projects">
            <Route
              loader={projectsLoader}
              path=""
              element={<Projects />}
              handle={{
                rightContainer: () => (
                  <ModalWithButton
                    buttonText={'Create Project'}
                    modal={CreateProjectModal}
                  />
                ),
              }}
            />

            <Route path={`${ProjectKey}`} errorElement={<Error />}>
              <Route path="settings" element={<EditProject />} />
              <Route path="" element={<Project />} />
              <Route path="flags">
                <Route
                  path=""
                  element={<Flags />}
                  loader={flagsLoader}
                  handle={{
                    rightContainer: () => (
                      <ModalWithButton
                        buttonText={'Create Flag'}
                        modal={CreateFlag}
                      />
                    ),
                  }}
                />
                <Route path={`${FlagKey}`}>
                  <Route
                    path="settings"
                    element={<FlagSettings />}
                    loader={flagsLoader}
                  />
                </Route>
                <Route path={FlagKey}>
                  <Route path="variations">
                    <Route
                      path=""
                      loader={variationsLoader}
                      element={<Variations />}
                      handle={{
                        rightContainer: () => <CreateVariation />,
                      }}
                    />
                    <Route path={VariationKey}>
                      <Route path="settings" element={<VariationSettings />} />
                    </Route>
                  </Route>
                  <Route
                    path={`environments/${EnvironmentKey}`}
                    errorElement={<Error />}
                  >
                    <Route
                      path=""
                      element={<Targeting />}
                      loader={targetingLoader}
                      errorElement={<Error />}
                    />
                  </Route>
                </Route>
              </Route>
              <Route path="environments">
                <Route
                  path=""
                  loader={environmentsLoader}
                  element={<Environments />}
                  handle={{
                    rightContainer: () => <CreateEnvironment />,
                  }}
                />
                <Route path={`${EnvironmentKey}`}>
                  <Route path="settings" element={<EditEnvironment />} />
                  <Route path="sdk-keys">
                    <Route
                      path=""
                      element={<Sdks />}
                      loader={sdkLoader}
                      handle={{
                        rightContainer: () => (
                          <ModalWithButton
                            buttonText={'Create SDK'}
                            modal={CreateSDKModal}
                          />
                        ),
                      }}
                    />
                    <Route
                      path={`${SdkKey}`}
                      element={<SdkSettings />}
                      loader={sdkLoader}
                    />
                  </Route>
                </Route>

                <Route path={`flags/${EnvironmentKey}`} element={<Flags />} />
                <Route
                  path={`flags/${FlagKey}/${EnvironmentKey}`}
                  element={<>Flag view</>}
                />
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Route>,
  ),
);
