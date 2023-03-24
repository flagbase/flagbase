import React from 'react'
import { ModalLayout } from '../../../components/layout'

type WelcomeModalProps = {
    onClose: () => void
    isOpen: boolean
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose, isOpen }) => {
    return (
        <ModalLayout open={isOpen} onClose={onClose} className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
            <>
                <h2 className="mt-2 text-2xl font-bold">Flagbase Client</h2>
                <p className="mt-8 bg-yellow-100 p-3 ">
                    <strong className="font-semibold text-gray-800">⚠️ Warning:</strong>{" "}
                    All connection configuration used to connect to your instance is saved locally. If you clear you browser data, this information will be erased.
                </p>
                <p className="mt-8">
                    As a first-time user, we want to give you a quick overview of what Flagbase Client has to offer:
                </p>
                <ul role="list" className="mt-8 space-y-8 text-gray-600">
                    <li className="flex gap-x-3">
                        🗂️
                        <span>
                            <strong className="font-semibold text-gray-900">Easy Resource Management</strong> Flagbase
                            Client empowers you to manage resources on remote Flagbase instances with ease. Monitor your
                            resources and make adjustments as necessary to optimize your workspaces, projects and
                            environments. Create, edit, and delete Flagbase resources to suit your needs.
                        </span>
                    </li>
                    <li className="flex gap-x-3">
                        ⚙️
                        <span>
                            <strong className="font-semibold text-gray-900">Feature Flag Configurations</strong> Tweak
                            your feature flag settings to your heart's content, adjusting rollout strategies, targeting
                            rules, and more. Flagbase Client makes it simple to update configurations on the fly.
                        </span>
                    </li>
                    <li className="flex gap-x-3">
                        🔒
                        <span>
                            <strong className="font-semibold text-gray-900">Secure Credentials Storage</strong> Enjoy
                            peace of mind knowing that your credentials and connections to instances are securely saved
                            locally. This ensures that only authorized users have access to your valuable information.
                        </span>
                    </li>
                </ul>
                <p className="mt-8">
                    To get started, simply close this modal and explore the intuitive interface. We're confident that
                    our user-friendly design and powerful features will help you achieve greater efficiency and success
                    in your projects.
                </p>
                <div className="mt-8 flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="doNotDisplay"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            onChange={(e) =>
                                localStorage.setItem('show-welcome-message', JSON.stringify(!e.target.checked))
                            }
                        />
                        <label htmlFor="doNotDisplay" className="ml-2 block text-sm text-gray-900">
                            Do not show again
                        </label>
                    </div>

                    <div className="text-sm">
                        <button
                            onClick={onClose}
                            className="group rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </>
        </ModalLayout>
    )
}

export default WelcomeModal
