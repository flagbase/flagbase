import React, { useState } from 'react';

import { useFeatureFlag } from '@flagbase/react-client-sdk';
import { CodeBracketIcon } from '@heroicons/react/20/solid';

import { useFlagbaseParams } from '../../app/lib/use-flagbase-params';
import { useActiveEnvironment } from '../../app/pages/environments/environment-dropdown';
import { useSDKs } from '../../app/pages/sdks/sdks';
import { useVariations } from '../../app/pages/variations/variations';
import Button from '../atoms/form/button';
import Modal from '../modal';
import { Heading, Text } from '../text';

interface ModalProps {
  visible: boolean;
  setVisible(data: boolean): void;
}

const CodeModal: React.FC<ModalProps> = ({ visible, setVisible }) => {
  const { flagKey } = useFlagbaseParams();

  const { data: activeEnvironmentKey } = useActiveEnvironment();
  const { data: sdks } = useSDKs();
  const { data: variations } = useVariations();

  return (
    <Modal
      open={visible}
      onClose={() => setVisible(false)}
      className="relative overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6"
    >
      <>
        <div>
          <Heading className="text-center" level={3}>
            How to use your feature flag in code
          </Heading>
          <Text>
            When using feature flags in code, it is essential to reference the
            flag key and feature variations correctly. Check out our{' '}
            <a
              href="https://flagbase.com/docs/sdk/overview"
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
              target="_blank"
              rel="noreferrer"
            >
              SDK docs
            </a>{' '}
            for your specific programming language.
          </Text>
        </div>
        <div className="mt-3 flex flex-col gap-3">
          <p>
            Reference this flag key in your code:
            <div>
              <div className="m-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                <label
                  htmlFor="flagKey"
                  className="block text-xs font-medium text-gray-500"
                >
                  Flag Key
                </label>
                <input
                  type="text"
                  name="flagKey"
                  id="flagKey"
                  className="block w-full truncate border-0 p-0 text-xl text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  value={flagKey}
                />
              </div>
            </div>
          </p>
          <p>
            It's also crucial to reference the correct variation key in your
            code. This ensures that your code behaves as expected based on the
            specific variation of the feature that is enabled.
          </p>
          <div className="flex flex-col ">
            {variations?.map((variation) => (
              <div
                key={variation.id}
                className="m-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600"
              >
                <label
                  htmlFor="variation"
                  className="block text-xs font-medium text-gray-500"
                >
                  Variation key for {variation.attributes.name} cohort
                </label>
                <input
                  type="text"
                  name="variation"
                  id="variation"
                  className="block w-full truncate border-0 p-0 text-xl text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  value={variation.attributes.key}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col ">
            <p>
              Make sure you have{' '}
              <a
                href="https://flagbase.com/docs/sdk/overview"
                target="_blank"
                rel="noreferrer"
              >
                set up the SDK
              </a>{' '}
              in your app, using the relevant server or client keys.
            </p>
            {sdks?.map((sdk) => (
              <div key={sdk.id} className="flex flex-col">
                <b className="capitalise mt-4 text-center text-sm font-bold">
                  SDK keys for {activeEnvironmentKey} environment
                </b>
                <div className="m-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                  <label
                    htmlFor="client"
                    className="block text-xs font-medium text-gray-500"
                  >
                    Client SDK Key
                  </label>
                  <input
                    type="text"
                    name="client"
                    id="client"
                    className="block w-full truncate border-0 p-0 text-xl text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    value={sdk.attributes.clientKey}
                  />
                </div>
                <div className="m-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                  <label
                    htmlFor="server"
                    className="block text-xs font-medium text-gray-500"
                  >
                    Server SDK Key
                  </label>
                  <input
                    type="text"
                    name="server"
                    id="server"
                    className="block w-full truncate border-0 p-0 text-xl text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    value={sdk.attributes.serverKey}
                  />
                </div>
              </div>
            ))}
          </div>
          <Button
            className="h-10 justify-center"
            onClick={() => {
              setVisible(false);
            }}
          >
            Close
          </Button>
        </div>
      </>
    </Modal>
  );
};

const CodeUsageModal = () => {
  const [showInCodeModal, setShowInCodeModal] = useState(false);

  return useFeatureFlag('use-in-code-modal', 'control') === 'treatment' ? (
    <>
      <CodeModal
        visible={showInCodeModal}
        setVisible={(show) => setShowInCodeModal(show)}
      />
      <Button
        suffix={CodeBracketIcon}
        variant="secondary"
        onClick={() => setShowInCodeModal(!showInCodeModal)}
      >
        How to use my flag in code
      </Button>
    </>
  ) : null;
};

export default CodeUsageModal;
