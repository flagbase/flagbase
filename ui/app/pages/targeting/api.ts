import { axios } from '../../lib/axios';
import { FlagbaseParams } from '../../lib/use-flagbase-params';
import { createPatch } from 'rfc6902';

export type Operator =
  | 'equals'
  | 'contains'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'contains'
  | 'regex';

export type TargetingRuleRequest = {
  key: string;
  name: string;
  description: string;
  tags: string[];
  type: string;
  traitKey?: string;
  traitValue?: string;
  operator: Operator;
  ruleVariations: {
    variationKey: string;
    weight: number;
  }[];
  segmentKey?: string;
};

export type TargetingRuleResponse = {
  key: string | null | undefined;
  type: 'targeting_rule';
  id: string;
  attributes: {
    description: string;
    key: string;
    name: string;
    operator: Operator;
    ruleVariations: {
      variationKey: string;
      weight: number;
    }[];
    segmentKey?: string;
    tags: string[];
    traitKey?: string;
    traitValue?: string;
    type: 'trait';
  };
};

export type TargetingResponse = {
  key: string | null | undefined;
  type: 'targeting';
  id: string;
  attributes: {
    enabled: boolean;
    fallthroughVariations: {
      variationKey: string;
      weight: number;
    }[];
  };
};

export type TargetingRequest = {
  enabled: boolean;
  fallthroughVariations: {
    variationKey: string;
    weight: number;
  }[];
};

export const createTargetingRule = async (
  {
    workspaceKey,
    projectKey,
    environmentKey,
    flagKey,
  }: Partial<FlagbaseParams>,
  request: TargetingRuleRequest,
): Promise<{ data: TargetingRuleResponse }> => {
  return axios.post(
    `/targeting/${workspaceKey}/${projectKey}/${environmentKey}/${flagKey}/rules`,
    request,
  );
};

export const updateTargetingRule = async (
  {
    workspaceKey,
    projectKey,
    environmentKey,
    flagKey,
    ruleKey,
  }: Partial<FlagbaseParams>,
  oldRule: TargetingRuleRequest,
  newRule: TargetingRuleRequest,
): Promise<{ data: TargetingRuleResponse }> => {
  const request = createPatch(oldRule, newRule);

  return axios.patch(
    `/targeting/${workspaceKey}/${projectKey}/${environmentKey}/${flagKey}/rules/${ruleKey}`,
    request,
  );
};

export const deleteTargetingRule = async ({
  workspaceKey,
  projectKey,
  environmentKey,
  flagKey,
  ruleKey,
}: Partial<FlagbaseParams>): Promise<{ data: TargetingRuleResponse }> => {
  return axios.delete(
    `/targeting/${workspaceKey}/${projectKey}/${environmentKey}/${flagKey}/rules/${ruleKey}`,
  );
};

export const patchTargeting = async (
  {
    workspaceKey,
    projectKey,
    environmentKey,
    flagKey,
  }: Partial<FlagbaseParams>,
  oldTargeting: TargetingRequest,
  newTargeting: TargetingRequest,
): Promise<{ data: TargetingRuleResponse }> => {
  const request = createPatch(oldTargeting, newTargeting);
  return axios.patch(
    `/targeting/${workspaceKey}/${projectKey}/${environmentKey}/${flagKey}`,
    request,
  );
};
