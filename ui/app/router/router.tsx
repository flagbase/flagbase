import React, { useState } from 'react';
import {
  Route,
  Navigate,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import { RouteParams } from './router.types';
import Projects from '../pages/projects';
import Flags from '../pages/flags';
import PageLayout from '../../components/page-layout';
import '../tailwind/tailwind.css';
import { PageHeadings } from '../../components/page-layout/page-layout';
import EditProject from '../pages/projects/projects.edit';
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
import { QueryCache, QueryClient } from 'react-query';
import MainWorkspaces from '../pages/workspaces/workspaces.main';
import Environments from '../pages/environments/environments';
import { Error } from '../pages/error';
import { Project } from '../pages/projects/project';
import { EditInstance } from '../pages/instances/instances.settings';
import { EditWorkspace } from '../pages/workspaces/workspaces.edit';
import Instances from '../pages/instances/instances';
import { Sdks } from '../pages/sdks/sdks';
import { EditEnvironment } from '../pages/environments/edit-environment';
import { SdkSettings } from '../pages/sdks/sdk.settings';
import { Targeting } from '../pages/targeting/targeting';
import Variations from '../pages/variations/variations';
import { FlagSettings } from '../pages/flags/flags.edit';
import { EnvironmentDropdown } from '../pages/environments/environment-dropdown';
import Button from '../../components/button';
import { CreateVariation } from '../pages/variations/variations.modal';
import VariationSettings from '../pages/variations/variation.settings';
import { CreateFlag, ModalProps } from '../pages/flags/flags.modal';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import { AddNewInstanceModal } from '../pages/instances/instances.modal';
import { CreateWorkspaceModal } from '../pages/workspaces/workspace.modal';
import { CreateProjectModal } from '../pages/projects/projects.modal';
import { CreateSDKModal } from '../pages/sdks/sdks.modal';
import { CreateEnvironment } from '../pages/environments/environments.modal';

const {
  InstanceKey,
  WorkspaceKey,
  ProjectKey,
  EnvironmentKey,
  FlagKey,
  SdkKey,
  VariationKey,
} = RouteParams;

export const getWorkspacesPath = (instanceKey: string) =>
  `/${instanceKey}/workspaces`;
export const getWorkspacePath = (instanceKey: string, workspaceKey: string) =>
  `/${instanceKey}/workspaces/${workspaceKey}/projects`;

export const getProjectsPath = (instanceKey: string, workspaceKey: string) =>
  `/${instanceKey}/workspaces/${workspaceKey}/projects`;

export const getProjectPath = (
  instanceKey: string,
  workspaceKey: string,
  projectKey: string,
) => `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/flags`;

export const getEnvironmentsPath = (
  instanceKey: string,
  workspaceKey: string,
  projectKey: string,
) =>
  `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/environments`;

export const getEnvironmentPath = (
  instanceKey: string,
  workspaceKey: string,
  projectKey: string,
  environmentKey: string,
) =>
  `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/environments/${environmentKey}/sdk-keys`;

export const getFlagPath = (
  instanceKey: string,
  workspaceKey: string,
  projectKey: string,
  environmentKey: string,
  flagKey: string,
) =>
  `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/flags/${flagKey}/environments/${environmentKey}`;

export const getFlagsPath = (
  instanceKey: string,
  workspaceKey: string,
  projectKey: string,
) => `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/flags`;

export const getVariationPath = ({
  instanceKey,
  workspaceKey,
  projectKey,
  flagKey,
  variationKey,
}: {
  instanceKey: string;
  workspaceKey: string;
  projectKey: string;
  flagKey: string;
  variationKey: string;
}) =>
  `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/flags/${flagKey}/variations/${variationKey}/settings`;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.error(error, query.queryKey);
    },
  }),
});

const ModalWithButton = ({
  buttonText,
  modal,
}: {
  buttonText: string;
  modal: React.FC<ModalProps>;
}) => {
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
};

export const newRouter = createBrowserRouter(
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
