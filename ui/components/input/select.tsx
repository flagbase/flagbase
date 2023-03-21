import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline'
import { FieldInputProps, FormikProps, FormikFormProps } from 'formik'
import React, { Fragment } from 'react'
import { classNames } from '../../helpers'

export type InputProps = {
    prefix?: React.ReactNode
    field: FieldInputProps<any>
    form: FormikProps<any>
    label?: string
} & Omit<FormikFormProps, 'prefix'>

const rules = [
    { name: 'Equal', operator: 'equal', negate: false },
    { name: 'Not Equal', operator: 'equal', negate: true },
    { name: 'Greater Than', operator: 'greater_than', negate: false },
    { name: 'Less Than or Equal', operator: 'greater_than', negate: true },
    { name: 'Greater Than or Equal', operator: 'greater_than_or_equal', negate: false },
    { name: 'Less Than', operator: 'greater_than_or_equal', negate: true },
    { name: 'Contains', operator: 'contains', negate: false },
    { name: 'Not Contains', operator: 'contains', negate: true },
    { name: 'Regex', operator: 'regex', negate: false },
    { name: 'Not Regex', operator: 'regex', negate: true },
]

export const Select: React.FC<InputProps> = ({ prefix, field, form, label, ...props }) => {
    const [selected, setSelected] = React.useState(rules[0])
    const name = field?.name
    const errors = form?.errors[name]
    const isTouched = form?.touched[name]
    return (
        <div>
            {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

            <Listbox value={selected} onChange={setSelected}>
                {({ open }) => (
                    <>
                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                            <span className="block truncate">{selected.name}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-fit overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {rules.map((rule) => (
                                    <Listbox.Option
                                        key={rule.id}
                                        className={({ active }) =>
                                            classNames(
                                                active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                                'relative cursor-default select-none py-2 pl-8 pr-4'
                                            )
                                        }
                                        value={rule}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span
                                                    className={classNames(
                                                        selected ? 'font-semibold' : 'font-normal',
                                                        'block truncate'
                                                    )}
                                                >
                                                    {rule.name}
                                                </span>

                                                {selected ? (
                                                    <span
                                                        className={classNames(
                                                            active ? 'text-white' : 'text-indigo-600',
                                                            'absolute inset-y-0 left-0 flex items-center pl-1.5'
                                                        )}
                                                    >
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </>
                )}
            </Listbox>

            {errors && isTouched && <span className="text-red-600 mt-1">{errors}</span>}
        </div>
    )
}
