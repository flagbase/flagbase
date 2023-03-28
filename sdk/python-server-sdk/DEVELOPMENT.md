# Development


1. Update version.py
2. python3 setup.py sdist bdist_wheel
3. python3 -m twine upload --repository pypi dist/* --verbose