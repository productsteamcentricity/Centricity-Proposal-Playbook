// Rehearsal cases for tools/dev/rehearse.js. Placeholders: {HTML} {SITE} {MU} {SLIDES}.
// Older months' inputs are applied on top of the live (Sep-2026) site so that the tools really
// write; the same chain on both sides must produce identical files unless a change is intended.
// `oldArgs` / `newArgs` override `args` on one side (for flags only the new tools understand).
const M = m => `{MU}/${m}`;
const AUG = M('2026-08_Aug-2026'), SEP = M('2026-09_Sep-2026'), JUL = M('2026-07_Jul-2026'), JUN = M('2026-06_Jun-2026');
const RK = `${JUL}/Monthly Investment Reckoner - August 2026.pptx`;

module.exports = [
  {
    name: 'mf-chain-sep', desc: 'Sep-2026 MF cycle re-applied on the live site (idempotence)', steps: [
      { tool: 'rename_schemes.js', args: ['--monitor', `${SEP}/Daily MF monitor_30th Sep 2026.xlsx`, '--html', '{HTML}'] },
      { tool: 'bake_month.js', args: ['--dir', SEP, '--as-on', '30th September 2026', '--html', '{HTML}'] },
      { tool: 'fill_variant_analytics.js', args: ['--dir', SEP, '--html', '{HTML}'] },
      { tool: 'rekey_sif_analytics.js', args: ['--html', '{HTML}'] },
      { tool: 'merge_de_universe.js', args: [`${SEP}/Analytics/Listed Direct Equity_Sep 2026.xlsx`, '--html', '{HTML}'] },
      { tool: 'merge_direct_equity_returns.js', args: [`${SEP}/Listed Direct Equity_30th Sep 2026.xlsx`, '--html', '{HTML}'] },
      { tool: 'merge_expense_exitload.js', args: ['--expense', `${SEP}/Expense Ratio_Sep 2026.xlsx`, '--exitload', `${SEP}/Exit Load_Sep 2026.xlsx`, '--html', '{HTML}'] },
      { tool: 'merge_sif_monitor.js', args: [`${SEP}/SIF Monitor_30th Sep 2026.xlsx`, '--as-on', '30th September 2026', '--sibling', '{SITE}/Centricity_SIF_Refresh.js'] },
      { tool: 'merge_risk_matrix.js', args: [`${SEP}/Fund Risk Ratios & 3Y Rolling - All Funds (as on 30-Sep-2026).xlsx`, '--as-on', '30 Sep 2026', '--html', '{HTML}'] },
    ],
  },
  {
    name: 'mf-chain-aug', desc: 'Aug-2026 MF cycle applied on the live site (real writes)', steps: [
      { tool: 'rename_schemes.js', args: ['--monitor', `${AUG}/Daily MF Monitor as on 31st August 2026.xlsx`, '--html', '{HTML}'] },
      { tool: 'bake_month.js', args: ['--dir', AUG, '--as-on', '31st August 2026', '--html', '{HTML}'] },
      { tool: 'fill_variant_analytics.js', args: ['--dir', AUG, '--html', '{HTML}'] },
      { tool: 'rekey_sif_analytics.js', args: ['--html', '{HTML}'] },
      { tool: 'merge_de_universe.js', args: [`${AUG}/Analytics/Listed Direct Equity_August 2026.xlsx`, '--html', '{HTML}'] },
      { tool: 'merge_direct_equity_returns.js', args: [`${AUG}/Listed Direct Equity_31st Aug 2026.xlsx`, '--html', '{HTML}'] },
      { tool: 'merge_expense_exitload.js', args: ['--expense', `${AUG}/Expense Ratio_Aug 2026.xlsx`, '--exitload', `${AUG}/Exit Load_Aug 2026.xlsx`, '--html', '{HTML}'] },
      { tool: 'merge_sif_monitor.js', args: [`${AUG}/SIF Monitor_31st August 2026.xlsx`, '--as-on', '31st August 2026', '--sibling', '{SITE}/Centricity_SIF_Refresh.js'] },
      { tool: 'merge_fund_managers.js', args: [`${AUG}/Fund Manager Data_31st Aug 2026.xlsx`, '--html', '{HTML}'] },
      { tool: 'merge_risk_matrix.js', args: [`${AUG}/Fund Risk Ratios & 3Y Rolling - All Funds (as on 31-Aug-2026).xlsx`, '--as-on', '31 Aug 2026', '--html', '{HTML}'] },
    ],
  },
  {
    name: 'analytics-one-class', desc: 'merge_analytics.js re-bakes the Aug debt class', steps: [
      { tool: 'merge_analytics.js', args: ['--debt', `${AUG}/Analytics/Debt Analytics_Aug 2026.xlsx`, '--as-on', '31st August 2026', '--html', '{HTML}'] },
    ],
  },
  {
    name: 'direct-perf', desc: 'rebuild_directperf.js from the Aug Direct monitor', steps: [
      { tool: 'rebuild_directperf.js', args: [`${AUG}/Daily MF Monitor_Direct_31st August 2026.xlsx`, '--html', '{HTML}'] },
    ],
  },
  {
    name: 'fund-managers-aug', desc: 'merge_fund_managers.js with the Aug roster on the live site', steps: [
      { tool: 'merge_fund_managers.js', args: [`${AUG}/Fund Manager Data_31st Aug 2026.xlsx`, '--html', '{HTML}'] },
    ],
  },
  {
    name: 'reckoner-jul', desc: 'Centricity Select + AIF performance from the Aug-2026 deck', steps: [
      { tool: 'merge_reckoner.js', args: [RK, '--html', '{HTML}'] },
      { tool: 'merge_aif_performance.js', args: [RK, '--html', '{HTML}'] },
    ],
  },
  {
    name: 'pin-alias', desc: 'pin_pms_alias.js against the live PMS block', steps: [
      { tool: 'pin_pms_alias.js', args: ['--html', '{HTML}'] },
    ],
  },
  {
    name: 'pms-aif-analytics-jul', desc: 'PMS/AIF look-through from the Jul-2026 workbook', steps: [
      { tool: 'merge_pms_aif_analytics.js', args: [`${JUL}/Analytics/PMS & AIF Analytics July 2026.xlsx`, '--as-on', '31st July 2026', '--html', '{HTML}'] },
    ],
  },
  {
    name: 'add-reckoner-funds', desc: 'add_reckoner_funds.js with the Aug-2026 deck (no-op expected)', steps: [
      { tool: 'add_reckoner_funds.js', args: [RK, '--html', '{HTML}'] },
    ],
  },
  {
    name: 'bond-list-jun', desc: 'Bond List of 08-Jun-2026 (two sheets)', steps: [
      { tool: 'merge_bond_list.js', args: [`${JUN}/Bond List_08th June 2026.xlsx`, '--html', '{HTML}'],
        newArgs: [`${JUN}/Bond List_08th June 2026.xlsx`, '--sheet', 'Invictus Bonds Options', '--desk', 'Invictus', '--html', '{HTML}'] },
    ],
  },
  {
    name: 'slides', desc: 'Market and closing slides re-baked from the live images', steps: [
      { tool: 'update_market_slides.js', args: ['--slides', '{SLIDES}/market', '--js', '{SITE}/Centricity_ExtraSlides.js'] },
      { tool: 'update_closing_slides.js', args: ['--dir', '{SLIDES}/closing', '--sibling', '{SITE}/Centricity_ExtraSlides.js'] },
    ],
  },
  {
    name: 'one-offs', desc: 'Already-applied one-off tools (no-ops expected)', steps: [
      { tool: 'fold_duplicate_names.js', args: ['--monitor', `${SEP}/Daily MF monitor_30th Sep 2026.xlsx`, '--html', '{HTML}'] },
      { tool: 'fold_index_funds.js', args: ['--html', '{HTML}'] },
      { tool: 'split_sif_add_mld.js', args: ['--html', '{HTML}'] },
    ],
  },
];
