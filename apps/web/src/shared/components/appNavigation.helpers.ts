import {
  getAvailableModuleItems
} from "../../app/modules/mainModules";
import type {
  MainModuleDefinition,
  MainModuleItem
} from "../../app/modules/mainModules";

function isItemCurrent(
  item: MainModuleItem,
  pathname: string
) {
  if (!item.path) {
    return false;
  }

  if (item.end) {
    return pathname === item.path;
  }

  return pathname === item.path ||
    pathname.startsWith(
      `${item.path}/`
    );
}

export function isModuleCurrent(
  module: MainModuleDefinition,
  pathname: string
) {
  return getAvailableModuleItems(
    module
  ).some(
    (item) =>
      isItemCurrent(
        item,
        pathname
      )
  );
}
