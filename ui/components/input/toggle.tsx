import { Switch } from '@headlessui/react'
import { classNames } from '../../helpers'
import React from 'react'
import { FieldProps } from 'formik'

export function Toggle({ label, field, form }: { label?: string } & FieldProps) {
    return (
        <>
            {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

            <Switch
                checked={field.value}
                onChange={(checked) => form.setFieldValue(field.name, checked)}
                className={classNames(
                    field.value ? 'bg-indigo-600' : 'bg-gray-200',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
                )}
            >
                <span className="sr-only">Use setting</span>
                <span
                    aria-hidden="true"
                    className={classNames(
                        field.value ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                    )}
                />
            </Switch>
        </>
    )
}
