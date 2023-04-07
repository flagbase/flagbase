import { CodeBracketIcon } from '@heroicons/react/20/solid';
import React, { useState } from 'react';
import Button from '../button';
import { ModalLayout } from '../layout';
import { Typography } from 'antd';
import { useFlagbaseParams } from '../../app/lib/use-flagbase-params';
import { useActiveEnvironment } from '../../app/pages/environments/environment-dropdown';
import { useSDKs } from '../../app/pages/sdks/sdks';
import { useVariations } from '../../app/pages/variations/variations';
import { useFeatureFlag } from '@flagbase/react-client-sdk';

const { Title, Text } = Typography;
interface ModalProps {
  visible: boolean;
  setVisible(data: boolean): void;
}

const Modal: React.FC<ModalProps> = ({ visible, setVisible }) => {
  const { flagKey } = useFlagbaseParams();

  const { data: activeEnvironmentKey } = useActiveEnvironment();
  const { data: sdks } = useSDKs();
  const { data: variations } = useVariations();

  return (
    <ModalLayout
      open={visible}
      onClose={() => setVisible(false)}
      className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6"
    >
      <>
        <div>
          <Title className="text-center" level={3}>
            How to use your feature flag in code
          </Title>
          <Text>
            When using feature flags in code, it is essential to reference the
            flag key and feature variations correctly. Check out our{' '}
            <a
              href="https://flagbase.com/docs/sdk/overview"
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              target="_blank"
            >
              SDK docs
            </a>{' '}
            for your specific programming language.
          </Text>
        </div>
        <div className="flex flex-col gap-3 mt-3">
          <p>
            Reference this flag key in your code:
            <div>
              <div className="m-2 rounded-md px-3 pt-2.5 pb-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
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
                  className="truncate text-xl block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
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
              <div className="m-2 rounded-md px-3 pt-2.5 pb-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
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
                  className="truncate text-xl block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  value={variation.attributes.key}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col ">
            <p>
              Make sure you have{' '}
              <a href="https://flagbase.com/docs/sdk/overview" target="_blank">
                set up the SDK
              </a>{' '}
              in your app, using the relevant server or client keys.
            </p>
            {sdks?.map((sdk) => (
              <div key={sdk.id} className="flex flex-col">
                <b className="text-center mt-4 font-bold text-sm capitalise">
                  SDK keys for {activeEnvironmentKey} environment
                </b>
                <div className="m-2 rounded-md px-3 pt-2.5 pb-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
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
                    className="truncate text-xl block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    value={sdk.attributes.clientKey}
                  />
                </div>
                <div className="m-2 rounded-md px-3 pt-2.5 pb-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
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
                    className="truncate text-xl block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    value={sdk.attributes.serverKey}
                  />
                </div>
              </div>
            ))}
          </div>
          <Button
            className="justify-center h-10"
            onClick={() => {
              setVisible(false);
            }}
          >
            Close
          </Button>
        </div>
      </>
    </ModalLayout>
  );
};

const CodeUsageModal = () => {
  const [showInCodeModal, setShowInCodeModal] = useState(false);

  return useFeatureFlag('use-in-code-modal', 'control') === 'treatment' ? (
    <>
      <Modal
        visible={showInCodeModal}
        setVisible={(show) => setShowInCodeModal(show)}
      />
      <Button
        suffix={CodeBracketIcon}
        secondary
        onClick={() => setShowInCodeModal(!showInCodeModal)}
      >
        How to use my flag in code
      </Button>
    </>
  ) : null;
};

export default CodeUsageModal;
