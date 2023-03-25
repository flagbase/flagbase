from typing import Callable, Dict, Union
from functools import lru_cache
import re


class EvalMapper:
    def __init__(self):
        self.matchers = {
            'equal': self._equal,
            'contains': self._contains,
            'greater_than': self._greater_than,
            'greater_than_or_equal': self._greater_than_or_equal,
            'regex': self._regex
        }

    def _equal(self, i: Union[str, float], r: str) -> bool:
        return isinstance(i, str) and i == r

    def _contains(self, i: Union[str, float], r: str) -> bool:
        return isinstance(i, str) and r in i

    def _greater_than(self, i: Union[str, float], r: str) -> bool:
        if not isinstance(i, float):
            return False
        r_float = self._parse_float_cached(r)
        return i > r_float

    def _greater_than_or_equal(self, i: Union[str, float], r: str) -> bool:
        if not isinstance(i, float):
            return False
        r_float = self._parse_float_cached(r)
        return i >= r_float

    def _regex(self, i: Union[str, float], r: str) -> bool:
        if not isinstance(i, str):
            return False
        return self._match_string_cached(r, i)

    @lru_cache(maxsize=None)
    def _parse_float_cached(self, s: str) -> float:
        return float(s)

    @lru_cache(maxsize=None)
    def _match_string_cached(self, pattern: str, s: str) -> bool:
        return bool(re.match(pattern, s))
