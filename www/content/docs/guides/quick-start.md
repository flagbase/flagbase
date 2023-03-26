---
sidebar_position: 0
---

# Quick Start

This guide aims to provide a comprehensive walkthrough on how to get started with Flagbase, a powerful feature flagging and rollout management platform. By the end of this guide, you will be able to create, manage, and control feature flags in your application using Flagbase.

## 1. Creating your feature flags in Flagbase
a. Sign up for a Flagbase account, if you haven't already. Visit the Flagbase website and follow the registration process.

b. Once you are logged in, navigate to the 'Feature Flags' section in the dashboard.

c. Click on 'Create New Flag' to start the process of creating a new feature flag. You will be prompted to provide a unique flag key, a description, and any additional metadata.

d. Choose the flag type, such as boolean, multivariate, or percentage-based rollouts. This will determine how your flag will behave and what kind of data it will control.

e. Save your feature flag. It will now be available in the Flagbase dashboard for further management.

## 2. Setting up the SDK in your application
a. Install the Flagbase SDK for your specific programming language or platform. You can find the installation instructions and relevant documentation on the Flagbase website.

b. Import the SDK in your application and configure it with your Flagbase API key, which can be found in your account settings or the documentation.

c. Initialize the SDK by creating a new instance of the Flagbase client. This will allow you to interact with the feature flags you have created in your Flagbase dashboard.

## 3. Wrapping your code with feature flags
a. Identify the parts of your application that need to be controlled by feature flags. These could be UI elements, API calls, or even entire features.

b. Use the Flagbase SDK to query the state of your feature flags. Depending on the programming language and platform, the syntax for querying feature flags may vary. Refer to the SDK documentation for specific instructions.

c. Wrap the relevant sections of your code with conditional statements that correspond to the flag state. This will enable or disable the respective feature depending on the state of the flag.

## 4. Controlling what users see what in your application 
a. In the Flagbase dashboard, navigate to the 'Feature Flags' section and click on your desired flag.

b. Configure targeting rules for your flag, which determine the criteria for enabling or disabling the feature. These can be based on user attributes, such as age, location, or any other custom attributes that you define.

c. Optionally, set up percentage-based rollouts to gradually release the feature to a certain percentage of your user base. This can help with A/B testing, phased rollouts, and load management.

d. Save your changes, and Flagbase will automatically update the flag state in your application through the SDK.

# That's a wrap
By following these steps, you will have successfully integrated Flagbase into your application and can now leverage the power of feature flags to manage the visibility and functionality of various features. This will enable you to perform controlled rollouts, A/B testing, and more, ultimately improving the user experience and the overall quality of your application.
