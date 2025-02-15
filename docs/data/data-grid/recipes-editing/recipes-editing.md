# Data Grid - Editing recipes

<p class="description">Advanced grid customization recipes.</p>

## Multiline editing

You can have columns with multiline text and edit them by creating a custom edit component.

In the demo below, the **Bio** column is composed of multiple lines.
To persist the changes, use <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Enter</kbd></kbd> (or <kbd><kbd class="key">⌘ Command</kbd>+<kbd class="key">Enter</kbd></kbd> on macOS).

{{"demo": "MultilineEditing.js", "bg": "inline", "defaultCodeOpen": false}}

## Conditional validation

When all cells in a row are in edit mode, you can validate fields by comparing their values against one another.
To do this, start by adding the `preProcessEditCellProps` as explained in the [validation](#validation) section.
When the callback is called, it will have an additional `otherFieldsProps` param containing the props from the other fields in the same row.
Use this param to check if the value from the current column is valid or not.
Return the modified `props` containing the error as you would for cell editing.
Once at the least one field has the `error` attribute set to a truthy value, the row will not exit edit mode.

The following demo requires a value for the **Payment method** column only if the **Is paid?** column is checked:

{{"demo": "ConditionalValidationGrid.js", "bg": "inline", "defaultCodeOpen": false}}

## Linked fields

The options available for one field may depend on the value of another field.
For instance, if the `singleSelect` column is used, you can provide a function to `valueOptions` returning the relevant options for the value selected in another field, as exemplified below.

```tsx
const columns: GridColDef[] = [
  {
    field: 'account',
    type: 'singleSelect',
    valueOptions: ({ row }) => {
      if (!row) {
        // The row is not available when filtering this column
        return ['Sales', 'Investments', 'Ads', 'Taxes', 'Payroll', 'Utilities'];
      }

      return row.type === 'Income' // Gets the value of the "type" field
        ? ['Sales', 'Investments', 'Ads']
        : ['Taxes', 'Payroll', 'Utilities'];
    },
  },
];
```

The code above is already enough to display different options in the **Account** column based on the value selected in the **Type** column.
The only task left is to reset the account once the type is changed.
This is needed because the previously selected account will not exist now in the options.
To solve that, you can create a custom edit component, reusing the built-in one, and pass a function to the `onValueChange` prop.
This function should call `apiRef.current.setEditCellValue` to reset the value of the other field.

```tsx
const CustomTypeEditComponent = (props: GridEditSingleSelectCellProps) => {
  const apiRef = useGridApiContext();

  const handleValueChange = async () => {
    await apiRef.current.setEditCellValue({
      id: props.id,
      field: 'account',
      value: '',
    });
  };

  return <GridEditSingleSelectCell onValueChange={handleValueChange} {...props} />;
};
```

The demo below combines the steps showed above.
You can experiment it by changing the value of any cell in the **Type** column.
The **Account** column is automatically updated with the correct options.

{{"demo": "LinkedFieldsRowEditing.js", "bg": "inline", "defaultCodeOpen": false}}

:::warning
The call to `apiRef.current.setEditCellValue` returns a promise that must be awaited.
For instance, if the `singleSelect` column type is used, not awaiting will cause the other column to be rendered with a `value` that is not in the options.

```ts
const handleChange = async () => {
  await apiRef.current.setEditCellValue({
    id: props.id,
    field: 'account',
    value: '',
  });
};
```

:::

A similar behavior can be reproduced with cell editing.
Instead of `apiRef.current.setEditCellValue`, the `rows` prop must be updated or `apiRef.current.updateRows` be used.
Note that the `onCellEditStart` and `onCellEditStop` props also have to be used to revert the value of the cell changed, in case the user cancels the edit.

{{"demo": "LinkedFieldsCellEditing.js", "bg": "inline", "defaultCodeOpen": false}}

## Usage with `@mui/x-date-pickers`

By default, the grid uses native browser inputs for editing `date` and `dateTime` columns.

While [MUI X Date / Time Pickers](/x/react-date-pickers/getting-started/) are not supported by the grid out of the box yet, it is easy to integrate them by creating [custom edit components](/x/react-data-grid/editing/#create-your-own-edit-component) and [custom filter operators](/x/react-data-grid/filtering/#create-a-custom-operator).

The example below uses `@mui/x-date-pickers` for both `date` and `dateTime` column types:

{{"demo": "EditingWithDatePickers.js", "bg": "inline", "defaultCodeOpen": false }}

:::warning
You can change date format by importing different locale (`en-US` locale is used in the example above).
See [Localization](/x/react-date-pickers/localization/) for more information.
:::
