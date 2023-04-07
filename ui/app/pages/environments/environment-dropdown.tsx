import React, { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { RawSelect } from '../../../components/input/select';
import { Loader } from '../../../components/loader';
import { useEnvironments } from './environments';

export const useActiveEnvironment = () => {
  const query = useQuery(['activeEnvironment'], {
    queryFn: () => {
      const environment = sessionStorage.getItem('activeEnvironment');

      return environment;
    },
  });

  return query;
};

export const useUpdateActiveEnvironment = () => {
  const { data: environments } = useEnvironments();
  const queryClient = useQueryClient();
  const query = useMutation(['updateActiveEnvironment'], {
    mutationFn: async (environmentKey: string) => {
      sessionStorage.setItem('activeEnvironment', environmentKey);
      const returnEnvironment = environments?.find(
        (env) => env.attributes.key === environmentKey,
      );
      return returnEnvironment;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['activeEnvironment']);
    },
  });

  return query;
};

export const EnvironmentDropdown = () => {
  const { data: environments, isLoading, isError } = useEnvironments();
  const { data: activeEnvironmentKey } = useActiveEnvironment();
  const { mutate: setActiveEnvironmentKey, isSuccess } =
    useUpdateActiveEnvironment();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const activeEnvironment = environments?.find(
    (env) => env.attributes.key === activeEnvironmentKey,
  );

  function replaceEnvironmentKey(route: string, newEnvironmentKey: string) {
    const environmentPattern = /\/environments\/[^/]+/;
    const newEnvironmentPath = `/environments/${newEnvironmentKey}`;
    const updatedRoute = route.replace(environmentPattern, newEnvironmentPath);
    return updatedRoute;
  }

  useEffect(() => {
    if (isSuccess && activeEnvironment) {
      navigate(
        replaceEnvironmentKey(pathname, activeEnvironment.attributes.key),
      );
    }
  }, [activeEnvironment, isSuccess, navigate, pathname]);

  const environmentList = environments?.map((environment) => {
    return {
      name: environment.attributes.name,
      value: environment.attributes.key,
    };
  });

  if (isError) {
    return null;
  }

  if (isLoading || !environmentList || !activeEnvironment) {
    return <Loader size="small" />;
  }

  return (
    <RawSelect
      options={environmentList}
      selected={{
        name: activeEnvironment.attributes.name,
        value: activeEnvironment.attributes.key,
      }}
      setSelected={(environment) => {
        setActiveEnvironmentKey(environment.value);
      }}
    />
  );
};
