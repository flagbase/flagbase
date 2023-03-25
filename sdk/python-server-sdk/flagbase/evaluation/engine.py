from flagbase.evaluation.bucket import derive_variation
from flagbase.evaluation.matcher import EvalMapper
from flagbase.identity import Identity


def evaluate(flag: dict, salt: str, identity: Identity) -> dict:
    evaluation = {
        'FlagKey': flag['flagKey']
    }

    matched = False

    if not flag['useFallthrough'] and len(flag['rules']) > 0:
        eval_result, match = evaluate_rules(flag['rules'], salt, identity)
        if match:
            evaluation['Reason'] = eval_result['Reason']
            evaluation['VariationKey'] = eval_result['VariationKey']
            matched = True

    if not matched:
        evaluation['Reason'] = 'fallthrough'
        if len(flag['fallthroughVariations']) > 1:
            evaluation['Reason'] = 'fallthrough_weighted'
        evaluation['VariationKey'] = derive_variation(salt, flag['fallthroughVariations'])

    return evaluation


def evaluate_rules(rules, salt: str, identity: Identity):
    for r in rules:
        eval_result, matched = evaluate_rule(r, salt, identity)
        if matched:
            return eval_result, True

    return None, False


def evaluate_rule(rule, salt: str, identity: Identity):
    evaluation = {}

    if rule['traitKey'] not in identity.traits:
        return None, False

    matcher = EvalMapper().matchers[rule['operator']]
    matches = matcher(identity.traits[rule['traitKey']], rule['traitValue'])

    if rule['negate']:
        matches = not matches

    if not matches:
        return None, False

    evaluation['Reason'] = 'targeted'
    if len(rule['ruleVariations']) > 1:
        evaluation['Reason'] = 'targeted_weighted'
    evaluation['VariationKey'] = derive_variation(salt, rule['ruleVariations'])

    return evaluation, True
