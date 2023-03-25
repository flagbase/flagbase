---
sidebar_position: 4
---

# Python Client SDK

This guide will help you set up your local environment to develop the Flagbase Python Server SDK.

## Prerequisites
Before you start, make sure you have the following installed on your system:
- Python 3.6 or higher
- pip (Python package manager)
- A code editor of your choice (e.g., Visual Studio Code, PyCharm)

## Setup
1. **Clone the repository**: First, clone the Flagbase repository to your local machine. Open a terminal and run the following command:
```sh
git clone https://github.com/flagbase/flagbase.git
```
This will create a flagbase directory in your current location.
2. **Navigate to the Python SDK directory**: Change your working directory to the `python-server-sdk` folder inside the `flagbase` directory:
```sh
cd flagbase/sdk/python-server-sdk
```
3. **Create a virtual environment**: Set up a virtual environment to manage dependencies for the SDK. Run the following command:
```sh
python -m venv venv
```
This will create a `venv` directory inside the `python-server-sdk` folder.
4. **Activate the virtual environment**: Activate the virtual environment by running the appropriate command for your platform:
* On macOS and Linux:
```sh
source venv/bin/activate
```
* On Windows:
```sh
.\venv\Scripts\activate
```
Your terminal prompt should change to show the active virtual environment.

5. *Install dependencies*: Install the required dependencies listed in the setup.py file by running:
```sh
pip install -r requirements.txt
```

## Development
You can now start developing the Flagbase Python Server SDK. Open the `python-server-sdk` directory in your favorite code editor and make changes as needed.

To test your changes, create an example app that uses the Flagbase SDK. You can use the example app provided in the SDK documentation. Save it as a Python file (e.g., `example_app.py`) in a separate directory outside the `flagbase` directory.

To test your changes, you'll need to install your local version of the SDK in your example app's virtual environment. First, create and activate a virtual environment in your example app's directory, similar to step 3 and 4 above. Then, install your local version of the SDK using the following command:
```sh
pip install -e /path/to/flagbase/sdk/python-server-sdk
```

Replace `/path/to/flagbase` with the actual path to your `flagbase` directory. This command will create a symlink to your local SDK, allowing you to test your changes in the example app without having to reinstall the package each time you make changes.

Run your example app:
```sh
python example_app.py
```
This should execute the app, and you should see the output of the app in your terminal. As you make changes to the SDK, you can rerun the example app to see the effects of your changes.

When you are satisfied with your changes, you can commit and push them to the repository. If you want to contribute your changes back to the project, you can create a pull request on GitHub.

