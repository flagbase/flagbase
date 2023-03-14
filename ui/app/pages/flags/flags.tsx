import { PlusCircleIcon } from '@heroicons/react/20/solid'
import React, { Suspense } from 'react'
import { Await, Link, useLoaderData } from 'react-router-dom'
import Button from '../../../components/button'
import EmptyState from '../../../components/empty-state'
import { Loader } from '../../../components/loader'
import Table from '../../../components/table/table'
import Tag from '../../../components/tag'
import Text from '../../../components/text/text'
import { Error } from '../error'
import { Flag } from './api'
import { flagConstants, flagsColumn } from './constants'

const convertFlags = ({ flags, filter }: { flags: Flag[]; filter: string }) => {
    if (!flags) {
        return []
    }

    return Object.values(flags).map((flag: Flag, index: number) => {
        return {
            id: index,
            title: flag.attributes.name,
            href: `/`,
            name: <Text>{flag.attributes.name}</Text>,
            description: <Text>{flag.attributes.description}</Text>,
            tags: (
                <div>
                    {(flag.attributes.tags || []).map((tag) => (
                        <Tag key={tag} className="mr-2">
                            {tag}
                        </Tag>
                    ))}
                </div>
            ),
            action: (
                <Link to={``}>
                    <Button secondary className="py-2">
                        Connect
                    </Button>
                </Link>
            ),
            key: flag.attributes.key,
        }
    })
}
const Flags: React.FC = () => {
    const { flags: prefetchedFlags } = useLoaderData() as { flags: Flag[] }
    console.log('flags', prefetchedFlags)
    return (
        <Suspense fallback={<Loader />}>
            <Await resolve={prefetchedFlags}>
                {(flags) => (
                    <div className="mt-5">
                        <div className="flex flex-col-reverse md:flex-row gap-3 items-stretch pb-5">
                            <Button className="py-2" type="button" suffix={PlusCircleIcon}>
                                {flagConstants.FLAG_ADD_TEXT}
                            </Button>
                        </div>

                        <Table
                            loading={false}
                            dataSource={convertFlags({ flags, filter: '' })}
                            columns={flagsColumn}
                            emptyState={
                                <EmptyState
                                    title="No Flags"
                                    description={'Get started by creating a new flag.'}
                                    cta={
                                        <Button
                                            className="py-2"
                                            suffix={PlusCircleIcon}
                                            onClick={() => setVisible(true)}
                                        >
                                            {flagConstants.FLAG_ADD_TEXT}
                                        </Button>
                                    }
                                />
                            }
                        />
                    </div>
                )}
            </Await>
        </Suspense>
    )
}

export default Flags
