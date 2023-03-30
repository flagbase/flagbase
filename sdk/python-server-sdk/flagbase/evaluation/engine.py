from typing import Optional, Tuple, Dict, List
from flagbase.evaluation.bucket import derive_variation
from flagbase.evaluation.matcher import EvalMapper
from flagbase.identity import Identity


class InvalidFlagDataException(Exception):
    pass


class InvalidIdentityDataException(Exception):
    pass


class UnsupportedOperatorException(Exception):
    pass


def evaluate(flag: Dict, salt: str, identity: Identity) -> Dict:
    validate_flag_data(flag)
    validate_salt(salt)
    validate_identity(identity)

    evaluation = {
        'FlagKey': flag['flagKey']
    }

    eval_mapper = EvalMapper()
    matched, eval_result = evaluate_rules(flag['rules'], salt, identity, eval_mapper) if flag['rules'] else (False, None)

    if matched:
        evaluation.update(eval_result)
    else:
        evaluation['Reason'] = 'fallthrough_weighted' if len(flag['fallthroughVariations']) > 1 else 'fallthrough'
        evaluation['VariationKey'] = derive_variation(salt, flag['fallthroughVariations'])

    return evaluation


def evaluate_rules(rules: Optional[List[Dict]], salt: str, identity: Identity, eval_mapper: EvalMapper) -> Tuple[bool, Optional[Dict]]:
    if not rules:
        return False, None

    for rule in rules:
        eval_result, matched = evaluate_rule(rule, salt, identity, eval_mapper)
        if matched:
            return True, eval_result

    return False, None


def evaluate_rule(rule: Dict, salt: str, identity: Identity, eval_mapper: EvalMapper) -> Tuple[Optional[Dict], bool]:
    if rule['traitKey'] not in identity.traits:
        return None, False

    matcher = eval_mapper.matchers.get(rule['operator'])
    if not matcher:
        raise UnsupportedOperatorException(f"Unsupported operator '{rule['operator']}' in rule '{rule}'")

    matches = matcher(identity.traits[rule['traitKey']], rule['traitValue'])

    if rule['negate']:
        matches = not matches

    if not matches:
        return None, False

    evaluation = {
        'Reason': 'targeted_weighted' if len(rule['ruleVariations']) > 1 else 'targeted',
        'VariationKey': derive_variation(salt, rule['ruleVariations'])
    }

    return evaluation, True


def validate_flag_data(flag: Dict):
    if not isinstance(flag, dict):
        raise InvalidFlagDataException("Flag data should be a dictionary.")
    required_keys = {'flagKey', 'useFallthrough', 'rules', 'fallthroughVariations'}
    if not required_keys.issubset(flag.keys()):
        raise InvalidFlagDataException(f"Flag data is missing required keys: {required_keys - set(flag.keys())}")


def validate_salt(salt: str):
    if not isinstance(salt, str) or not salt:
        raise ValueError("Salt should be a non-empty string.")


def validate_identity(identity: Identity):
    if not isinstance(identity, Identity) or not hasattr(identity, 'traits'):
        raise InvalidIdentityDataException("Identity should be an instance of the Identity class with a valid 'traits' attribute.")
