import { Components, Theme } from '@mui/material/styles';
import { buttonOverride } from './button';
import { cardContentOverride, cardOverride } from './card';
import { inputLabelOverride, outlinedInputOverride, textFieldOverride } from './input';
import { tableCellOverride, tableOverride, tableRowOverride } from './table';
import { datePickerOverrides } from './datePickers';
import { paperOverride, drawerOverride, dialogOverride, menuOverride, chipOverride, dividerOverride } from './paper';

export const components: Components<Theme> = {
  MuiPaper: paperOverride,
  MuiDrawer: drawerOverride,
  MuiDialog: dialogOverride,
  MuiMenu: menuOverride,
  MuiChip: chipOverride,
  MuiDivider: dividerOverride,
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
