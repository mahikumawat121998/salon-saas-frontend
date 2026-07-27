import { Components, Theme } from '@mui/material/styles';
import { buttonOverride } from './button';
import { cardContentOverride, cardOverride } from './card';
import { inputLabelOverride, outlinedInputOverride, textFieldOverride } from './input';
import { tableCellOverride, tableOverride, tableRowOverride } from './table';
import { datePickerOverrides } from './datePickers';

export const components: Components<Theme> = {
  MuiButton: buttonOverride,
  MuiCard: cardOverride,
  MuiCardContent: cardContentOverride,
  MuiTextField: textFieldOverride,
  MuiOutlinedInput: outlinedInputOverride,
  MuiInputLabel: inputLabelOverride,
  MuiTable: tableOverride,
  MuiTableCell: tableCellOverride,
  MuiTableRow: tableRowOverride,
  ...datePickerOverrides,
};
