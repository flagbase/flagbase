import { FieldInputProps, FormikProps, FormikFormProps } from 'formik'
import React, { createElement, useEffect, useState } from 'react'
import { classNames } from '../../helpers'
import Tag from '../tag'

export type TagInputProps = {
    prefix?: React.ReactNode
    field: FieldInputProps<any>
    form: FormikProps<any>
    label?: string
} & Omit<FormikFormProps, 'prefix'>

export const TagInput: React.FC<TagInputProps> = ({ prefix, field, form, label, ...props }) => {
    const [inputValue, setInputValue] = useState('')
    const { placeholder } = props
    const name = field?.name
    const tags = field.value

    const onDelete = (tag: string) => {
        const newTags = tags.filter((t) => t !== tag)
        form.setFieldValue(name, newTags)
    }

    const handleKeyDown = (event) => {
        //if keyCode is enter, tab or comma
        if (event.keyCode === 13 || event.keyCode === 9 || event.keyCode === 188) {
            event.preventDefault()
            const newTags = [...tags, inputValue]
            form.setFieldValue(name, newTags)
            setInputValue('')
        }
    }

    return (
        <div>
            {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
            <div className="relative rounded-md shadow-sm">
                {prefix && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        {createElement(prefix)}
                    </div>
                )}
                <div className="w-full rounded-md border border-gray-300  sm:text-sm flex gap-3 p-2 flex-wrap">
                    {tags.map((tag, index) => (
                        <Tag key={`${tag}_${index}`} onDelete={onDelete}>
                            {tag}
                        </Tag>
                    ))}
                    <input
                        type="text"
                        id={name}
                        className={classNames(
                            `block w-full rounded-md border-0 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm flex-grow basis-0`,
                            prefix ? 'pl-10' : ''
                        )}
                        placeholder={placeholder}
                        onKeyDown={handleKeyDown}
                        onChange={(event) => setInputValue(event.target.value)}
                        value={inputValue}
                    />
                </div>
            </div>
        </div>
    )
}
