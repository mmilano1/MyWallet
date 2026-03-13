import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    income: Palette['primary'];
    expense: Palette['primary'];
  }

  interface PaletteOptions {
    income?: PaletteOptions['primary'];
    expense?: PaletteOptions['primary'];
  }
}
