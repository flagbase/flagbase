import { defer, Params } from "react-router-dom";

import { queryClient } from "./router";
import { configureAxios } from "../../lib/axios";
import { FlagbaseParams } from "../../lib/use-flagbase-params";
import { fetchEnvironments } from "../../pages/environments/api";
import {
  fetchFlags,
  fetchTargeting,
  fetchTargetingRules,
} from "../../pages/flags/api";
import { Instance } from "../../pages/instances/instances.functions";
import { fetchProjects } from "../../pages/projects/api";
import { fetchSdkList } from "../../pages/sdks/api";
import { fetchVariations } from "../../pages/variations/api";
import { fetchWorkspaces } from "../../pages/workspaces/api";

export const getInstances = (): Instance[] =>
  JSON.parse(localStorage.getItem("instances") || "[]") as Instance[];

export const instancesQuery = async (
  instanceKey?: string
): Promise<Instance[]> => {
  const instances = await queryClient.fetchQuery({
    queryKey: ["instances"],
    queryFn: () => getInstances(),
  });
  if (instanceKey) {
    return instances.filter(
      (instance: Instance) =>
        instance.key.toLocaleLowerCase() === instanceKey.toLocaleLowerCase()
    );
  }
  if (!instances.length) {
    throw new Error("No instances found");
  }

  return instances;
};

export const instancesLoader = () => {
  // ⬇️ return data or fetch it
  const instances = queryClient.fetchQuery({
    queryKey: ["instances"],
    queryFn: () => getInstances(),
  });

  return defer({ instances });
};

export const workspaceQuery = ({ instanceKey }: { instanceKey: string }) => ({
  queryKey: ["workspaces", instanceKey.toLocaleLowerCase()],
  queryFn: async () => {
    await configureAxios(instanceKey);

    return fetchWorkspaces();
  },
});

export const workspacesLoader = async ({
  params,
}: {
  params: Params<"instanceKey">;
}) => {
  const { instanceKey } = params;
  if (!instanceKey) {
    return defer({ workspaces: [] });
  }
  const [instance] = await instancesQuery(instanceKey);
  await configureAxios(instanceKey);
  const workspaces = queryClient.fetchQuery(workspaceQuery({ instanceKey }));

  return defer({ workspaces, instance });
};

export const projectsLoader = ({
  params,
}: {
  params: Params<"instanceKey" | "workspaceKey">;
}) => {
  const { instanceKey, workspaceKey } = params;
  if (!instanceKey || !workspaceKey) {
    return defer({ projects: [] });
  }
  const projects = queryClient.fetchQuery(
    ["projects", instanceKey, workspaceKey],
    {
      queryFn: async () => {
        await configureAxios(instanceKey);

        return fetchProjects(workspaceKey);
      },
    }
  );

  return defer({ projects });
};

export const environmentsLoader = ({
  params,
}: {
  params: Params<"instanceKey" | "workspaceKey" | "projectKey">;
}) => {
  const { instanceKey, workspaceKey, projectKey } = params;
  if (!instanceKey || !workspaceKey || !projectKey) {
    return defer({ environments: [] });
  }
  const environments = queryClient.fetchQuery(
    getEnvironmentsKey({
      instanceKey,
      workspaceKey,
      projectKey,
    }),
    {
      queryFn: async () => {
        await configureAxios(instanceKey);

        return fetchEnvironments(workspaceKey, projectKey);
      },
    }
  );

  return defer({ environments });
};

export const getSdkKey = ({
  instanceKey,
  workspaceKey,
  projectKey,
  environmentKey,
}: {
  instanceKey: string;
  workspaceKey: string;
  projectKey: string;
  environmentKey: string;
}) => {
  return ["sdks", instanceKey, workspaceKey, projectKey, environmentKey];
};

export const sdkLoader = ({
  params,
}: {
  params: Params<
    "instanceKey" | "workspaceKey" | "projectKey" | "environmentKey"
  >;
}) => {
  const { instanceKey, workspaceKey, projectKey, environmentKey } = params;
  if (!instanceKey || !workspaceKey || !projectKey || !environmentKey) {
    throw new Error("Missing params");
  }
  const queryKey = getSdkKey(params);
  const sdks = queryClient.fetchQuery(queryKey, {
    queryFn: async () => {
      await configureAxios(instanceKey);

      return fetchSdkList({
        environmentKey,
        projectKey,
        workspaceKey,
      });
    },
  });

  return defer({ sdks });
};

export const getFlagsKey = ({
  instanceKey,
  workspaceKey,
  projectKey,
}:
  | {
      instanceKey: string;
      workspaceKey: string;
      projectKey: string;
    }
  | Params<"instanceKey" | "workspaceKey" | "projectKey">) => {
  return ["flags", instanceKey, workspaceKey, projectKey];
};

export const getTargetingKey = ({
  instanceKey,
  workspaceKey,
  projectKey,
  environmentKey,
  flagKey,
}: Partial<FlagbaseParams>) => {
  return [
    "targeting",
    instanceKey,
    workspaceKey,
    projectKey,
    environmentKey,
    flagKey,
  ];
};

export const getTargetingRulesKey = ({
  instanceKey,
  workspaceKey,
  projectKey,
  environmentKey,
  flagKey,
}: Partial<FlagbaseParams>) => {
  return [
    "targeting",
    "rules",
    instanceKey,
    workspaceKey,
    projectKey,
    environmentKey,
    flagKey,
  ];
};

export const flagsLoader = ({
  params,
}: {
  params: Params<"instanceKey" | "workspaceKey" | "projectKey">;
}) => {
  const { instanceKey, workspaceKey, projectKey } = params;
  if (!workspaceKey || !projectKey || !instanceKey) {
    throw new Error("Missing params");
  }
  const queryKey = getFlagsKey(params);
  const flags = queryClient.fetchQuery(queryKey, {
    queryFn: async () => {
      await configureAxios(instanceKey);

      return fetchFlags({
        projectKey,
        workspaceKey,
      });
    },
  });

  return defer({ flags });
};

export const targetingLoader = ({
  params,
}: {
  params: Params<
    "instanceKey" | "workspaceKey" | "projectKey" | "environmentKey" | "flagKey"
  >;
}) => {
  const { instanceKey, workspaceKey, projectKey, environmentKey, flagKey } =
    params;
  if (!workspaceKey || !projectKey || !instanceKey || !flagKey) {
    throw new Error("Missing params");
  }
  if (!environmentKey) {
    return defer({ targetingRules: [] });
  }
  const variations = queryClient.fetchQuery(
    getVariationsKey({
      instanceKey,
      workspaceKey,
      projectKey,
      flagKey,
    }),
    {
      queryFn: async () => {
        await configureAxios(instanceKey);

        return fetchVariations({
          workspaceKey,
          projectKey,
          flagKey,
        });
      },
    }
  );
  const targeting = queryClient.fetchQuery(getTargetingKey(params), {
    queryFn: async () => {
      await configureAxios(instanceKey);

      return fetchTargeting({
        workspaceKey,
        projectKey,
        environmentKey,
        flagKey,
      });
    },
  });
  const targetingRules = queryClient.fetchQuery(getTargetingRulesKey(params), {
    queryFn: async () => {
      await configureAxios(instanceKey);

      return fetchTargetingRules({
        workspaceKey,
        projectKey,
        environmentKey,
        flagKey,
      });
    },
  });

  return defer({ targeting, targetingRules, variations });
};

export const targetingRulesLoader = ({
  params,
}: {
  params: Params<
    "instanceKey" | "workspaceKey" | "projectKey" | "environmentKey" | "flagKey"
  >;
}) => {
  const { instanceKey, workspaceKey, projectKey, environmentKey, flagKey } =
    params;
  if (!workspaceKey || !projectKey || !instanceKey || !flagKey) {
    throw new Error("Missing params");
  }
  if (!environmentKey) {
    return defer({ targeting: [] });
  }
  const queryKey = getTargetingKey(params);
  const targetingRules = queryClient.fetchQuery(queryKey, {
    queryFn: async () => {
      await configureAxios(instanceKey);

      return fetchTargetingRules({
        workspaceKey,
        projectKey,
        environmentKey,
        flagKey,
      });
    },
  });

  return defer({ targetingRules });
};

export const getVariationsKey = ({
  instanceKey,
  workspaceKey,
  projectKey,
  flagKey,
}: {
  instanceKey?: string;
  workspaceKey?: string;
  projectKey?: string;
  flagKey?: string;
}) => {
  if (!instanceKey || !workspaceKey || !projectKey || !flagKey) {
    return ["variations"];
  }

  return ["variations", instanceKey, workspaceKey, projectKey, flagKey];
};

export const getEnvironmentsKey = ({
  instanceKey,
  workspaceKey,
  projectKey,
}: {
  instanceKey: string;
  workspaceKey: string;
  projectKey: string;
}) => {
  return ["environments", instanceKey, workspaceKey, projectKey];
};

export const getVariationKey = ({
  instanceKey,
  workspaceKey,
  projectKey,
  flagKey,
  variationKey,
}: {
  instanceKey: string;
  workspaceKey: string;
  projectKey: string;
  flagKey: string;
  variationKey: string;
}) => {
  return [
    "variations",
    instanceKey,
    workspaceKey,
    projectKey,
    flagKey,
    variationKey,
  ];
};

export const variationsLoader = ({
  params,
}: {
  params: Params<"instanceKey" | "workspaceKey" | "projectKey" | "flagKey">;
}) => {
  const { instanceKey, workspaceKey, projectKey, flagKey } = params;
  if (!workspaceKey || !projectKey || !instanceKey || !flagKey) {
    throw new Error("Missing params");
  }

  const queryKey = getVariationsKey(params);
  const variations = queryClient.fetchQuery(queryKey, {
    queryFn: async () => {
      await configureAxios(instanceKey);

      return fetchVariations({
        workspaceKey,
        projectKey,
        flagKey,
      });
    },
    cacheTime: 10 * 1000,
    staleTime: 15 * 1000,
  });

  return defer({ variations });
};
