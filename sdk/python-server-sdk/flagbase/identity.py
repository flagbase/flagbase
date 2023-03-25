from typing import Dict, Union

class Identity:
    def __init__(self, identifier: str, traits: Dict[str, Union[str, int]]):
        self._identifier = identifier
        self._traits = traits

    @property
    def identifier(self) -> str:
        return self._identifier

    @identifier.setter
    def identifier(self, value: str) -> None:
        self._identifier = value

    @property
    def traits(self) -> Dict[str, Union[str, int]]:
        return self._traits

    @traits.setter
    def traits(self, value: Dict[str, Union[str, int]]) -> None:
        self._traits = value
