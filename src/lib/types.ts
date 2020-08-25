// Make sure to keep the TS types below up-to-date with the Form JSON Schema
// that we use for form validation and IDE intellisense.
//
// The Form's JSON Schema is stored in `public/form.schema.json`
export interface Form {
  title: Copy
  description: Copy
  definitions?: Record<string, Question[]>
  variables?: Record<string, string>
  sections?: Record<string, Section>
  instructions: Record<string, Copy>
  pages: Page[]
  seal: string
}

export interface Section {
  title: Copy
  content: Copy
}

export interface Page {
  title: Copy
  heading: Copy
  instructions?: Copy
  questions: Question[]
}

export interface Question {
  name?: Copy
  instructions?: Copy
  required?: boolean
  type: QuestionType
  validate?: QuestionValidation[]
  id: string
  options?: Option[]
  switch?: Switch
  sections?: Sections
  additionalKeys?: string
}

export interface Sections {
  name: Copy
  instructions?: Copy
  id?: string
  include?: string[]
  color: string
}

export interface Option {
  name: Copy
  id: string
  value?: string
  icon?: Icon
  [key: string]: string | undefined | Copy | Icon
}

export interface Icon {
  label: string
  color: string
}

interface Switch {
  [option: string]: string | Question[]
}

export interface Copy {
  [languageCode: string]: string
}

export type QuestionType =
  | 'shorttext'
  | 'date'
  | 'dropdown'
  | 'single-select'
  | 'boolean'
  | 'phone'
  | 'ssn'
  | 'arn'
  | 'address'
  | 'integer'
  | 'decimal'
  | 'dollar-amount'
  | 'longtext'
  | 'multiselect'
  | 'state-picker'
  | 'instructions-only'
  | 'warning-only'
  | 'email'
  | 'file'
  | 'checkbox'
  | 'sections'

export interface QuestionValidation {
  type: 'matches_field' | 'regex' | 'min' | 'max'
  value: string
  error: Copy
}

export interface ErrorMessage {
  message: string
}

export interface Values {
  [key: string]: Value
}

export interface Errors {
  [key: string]: Copy[]
}

export type Value = string | string[] | Date | number | boolean | FileValues | Record<string, Option[]> | undefined

export type FileValues = FileValue[]

export type FileValue = {
  name: string | undefined
  type: string | undefined
  size: number
  contents: string
}
