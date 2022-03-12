import type { PluginSimple } from 'markdown-it';

export const responsiveTablePlugin: PluginSimple = (parser) => {
  parser.renderer.rules.table_open = function () {
    return `<TableWrapper><table>`;
  };

  parser.renderer.rules.table_close = function () {
    return '</table></TableWrapper>';
  };
};
