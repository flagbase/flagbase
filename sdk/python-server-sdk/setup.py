from os import path
from setuptools import setup, find_packages
from pathlib import Path

long_description = (Path(__file__).parent / "README.md").read_text()

INSTALL_REQUIRES = [
    'requests>=2.26.0',
    'xxhash>=3.2.0',
]

with open(path.join(path.abspath(path.dirname(__file__)), 'flagbase', 'version.py'), encoding='utf-8') as f:
    exec(f.read())

setup(
    name="flagbase",
    # pylint: disable=undefined-variable
    version=__version__,  # type: ignore
    description='Flagbase Python Server SDK',
    long_description=long_description,
    long_description_content_type="text/markdown",
    author='The Flagbase Team',
    packages=find_packages(),
    author_email='cjoy@flagbase.com',
    url='https://flagbase.com',
    install_requires=INSTALL_REQUIRES,
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        'Programming Language :: Python',
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        'Topic :: Software Development :: Libraries'
    ],
)
