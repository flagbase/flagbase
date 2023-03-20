import React, { Suspense, useState } from 'react'
import { Await, useLoaderData, useParams } from 'react-router-dom'
import Table from '../../../components/table/table'
import { Instance } from '../../context/instance'
import { Workspace } from './api'
import Button from '../../../components/button'
import { constants, workspaceColumns } from './workspace.constants'
import Input from '../../../components/input'
import { SearchOutlined } from '@ant-design/icons'
import { convertWorkspaces } from './workspaces.helpers'
import { CreateWorkspace } from './modal'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import EmptyState from '../../../components/empty-state'
import { Loader } from '../../../components/loader'

const Variations = () => {
    return (
        <Suspense fallback={<Loader />}>
            <Await resolve={prefetchedWorkspaces}>
                {(variations) => (
                    <React.Fragment>
                        <Table
                            loading={isFetching || isRefetching || isLoading}
                            dataSource={workspaces ? convertWorkspaces(workspaces, instance, filter) : []}
                            columns={workspaceColumns}
                            emptyState={
                                <EmptyState
                                    title="No workspaces found"
                                    description="This workspace does not have any workspaces yet."
                                    cta={
                                        <Button
                                            onClick={() => showCreateWorkspace(true)}
                                            className="py-2"
                                            suffix={PlusCircleIcon}
                                        >
                                            {constants.create}
                                        </Button>
                                    }
                                />
                            }
                        />
                    </React.Fragment>
                )}
            </Await>
        </Suspense>
    )
}

export default Variations
