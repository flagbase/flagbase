import { axios } from '../../lib/axios';
import { FlagbaseParams } from '../../lib/use-flagbase-params';
import { TargetingResponse, TargetingRuleResponse } from '../targeting/api';
import { UpdateBody } from '../workspaces/api';

export type Flag = {
  id: string;
  type: 'flag';
  attributes: {
    key: string;
    name: string;
    description: string;
    tags: string[];
  };
};

export type FlagCreateBody = {
  key: string;
  name: string;
  description?: string;
  tags?: string[];
};

export const createFlag = async ({
  workspaceKey,
  projectKey,
  flag,
}: {
  workspaceKey: string;
  projectKey: string;
  flag: FlagCreateBody;
}): Promise<Flag> => {
  const { data } = await axios.post(
    `/flags/${workspaceKey}/${projectKey}`,
    flag,
  );

  return data;
};

export const fetchFlags = async ({
  workspaceKey,
  projectKey,
}: {
  workspaceKey: string;
  projectKey: string;
}): Promise<Flag[]> => {
  const { data } = await axios.get(`/flags/${workspaceKey}/${projectKey}`);

  return data;
};

export const updateFlag = async ({
  workspaceKey,
  projectKey,
  flagKey,
  body,
}: {
  workspaceKey: string;
  projectKey: string;
  flagKey: string;
  body: UpdateBody[];
}) => {
  const { data } = await axios.patch(
    `/flags/${workspaceKey}/${projectKey}/${flagKey}`,
    body,
  );

  return data;
};

export const deleteFlag = async ({
  workspaceKey,
  projectKey,
  flagKey,
}: {
  workspaceKey: string;
  projectKey: string;
  flagKey: string;
}) => {
  const { data } = await axios.delete(
    `/flags/${workspaceKey}/${projectKey}/${flagKey}`,
  );

  return data;
};

export const fetchTargeting = async ({
  workspaceKey,
  projectKey,
  environmentKey,
  flagKey,
}: Partial<FlagbaseParams>): Promise<TargetingResponse> => {
  const { data } = await axios.get(
    `/targeting/${workspaceKey}/${projectKey}/${environmentKey}/${flagKey}`,
  );

  return data;
};

export const fetchTargetingRules = async ({
  workspaceKey,
  projectKey,
  environmentKey,
  flagKey,
}: Partial<FlagbaseParams>): Promise<TargetingRuleResponse> => {
  const { data } = await axios.get(
    `/targeting/${workspaceKey}/${projectKey}/${environmentKey}/${flagKey}/rules`,
  );

  return data;
};

export const fetchTargetingRule = async ({
  workspaceKey,
  projectKey,
  environmentKey,
  flagKey,
  ruleKey,
}: Partial<FlagbaseParams>): Promise<TargetingRuleResponse> => {
  const { data } = await axios.get(
    `/targeting/${workspaceKey}/${projectKey}/${environmentKey}/${flagKey}/rules/${ruleKey}`,
  );

  return data;
};
