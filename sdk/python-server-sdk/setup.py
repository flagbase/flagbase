from os import path
from setuptools import setup

INSTALL_REQUIRES = [
    'requests>=2.9.1',
    'pyyaml>=5.4',
    'docopt>=0.6.2',
    'enum34;python_version<"3.4"',
    'bloom-filter2>=2.0.0',
    'xxhash>=3.2.0',
]

with open(path.join(path.abspath(path.dirname(__file__)), 'flagbase', 'version.py'), encoding='utf-8') as f:
    exec(f.read())

with open(path.join(path.abspath(path.dirname(__file__)), 'README.md'), encoding='utf-8') as r:
    README = r.read()

setup(
    name="flagbase",
    # pylint: disable=undefined-variable
    version=__version__,  # type: ignore
    description='Flagbase Python Server SDK',
    packages=['flagbase'],
    author_email='cjoy@flagbase.com',
    url='https://github.com/flagbase/flagbase/tree/master/sdk/python-server-sdk',
    install_requires=[
        'requests',
        'ua_parser',
        'ip3country',
    ],
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
