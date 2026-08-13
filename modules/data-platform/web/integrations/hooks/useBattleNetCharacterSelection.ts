import {
  useEffect,
  useMemo,
  useState
} from "react";
import type {
  BattleNetCharacterPreview
} from "../types/battlenet.types";
import {
  createBattleNetFilterOptions,
  filterBattleNetCharacters
} from "../utils/battleNetCharacterSelection";

type CharacterSelectionState = {
  search: string;
  realm: string;
  className: string;
  minimumLevel: number;
  realms: string[];
  classes: string[];
  visibleCharacters:
    BattleNetCharacterPreview[];
  selectedCharacterKeys: string[];
  selectedKeys: Set<string>;
  selectedCount: number;
  hiddenSelectedCount: number;
  setSearch:
    (value: string) => void;
  setRealm:
    (value: string) => void;
  setClassName:
    (value: string) => void;
  setMinimumLevel:
    (value: number) => void;
  toggleCharacter:
    (key: string) => void;
  selectVisible:
    () => void;
  clearVisible:
    () => void;
  clearSelection:
    () => void;
};

export function useBattleNetCharacterSelection(
  characters:
    BattleNetCharacterPreview[],
  defaultMinimumLevel: number
): CharacterSelectionState {
  const [search, setSearch] =
    useState("");

  const [realm, setRealm] =
    useState("ALL");

  const [className, setClassName] =
    useState("ALL");

  const [
    minimumLevel,
    setMinimumLevel
  ] =
    useState(
      defaultMinimumLevel
    );

  const [
    selectedKeys,
    setSelectedKeys
  ] =
    useState<Set<string>>(
      new Set()
    );

  useEffect(() => {
    setMinimumLevel(
      defaultMinimumLevel
    );

    setSelectedKeys(
      new Set(
        characters
          .filter(
            (character) =>
              character.level >=
              defaultMinimumLevel
          )
          .map(
            (character) =>
              character.key
          )
      )
    );
  }, [
    characters,
    defaultMinimumLevel
  ]);

  const realms =
    useMemo(
      () =>
        createBattleNetFilterOptions(
          characters.map(
            (character) =>
              character.realm
          )
        ),
      [characters]
    );

  const classes =
    useMemo(
      () =>
        createBattleNetFilterOptions(
          characters.map(
            (character) =>
              character.className
          )
        ),
      [characters]
    );

  const visibleCharacters =
    useMemo(
      () =>
        filterBattleNetCharacters(
          characters,
          {
            search,
            realm,
            className,
            minimumLevel
          }
        ),
      [
        characters,
        className,
        minimumLevel,
        realm,
        search
      ]
    );

  const selectedCharacterKeys =
    useMemo(
      () =>
        visibleCharacters
          .filter(
            (character) =>
              selectedKeys.has(
                character.key
              )
          )
          .map(
            (character) =>
              character.key
          ),
      [
        selectedKeys,
        visibleCharacters
      ]
    );

  const selectedCount =
    selectedCharacterKeys.length;

  const hiddenSelectedCount =
    Math.max(
      0,
      selectedKeys.size -
        selectedCount
    );

  const toggleCharacter = (
    key: string
  ) => {
    setSelectedKeys(
      (current) => {
        const next =
          new Set(current);

        if (next.has(key)) {
          next.delete(key);
        }
        else {
          next.add(key);
        }

        return next;
      }
    );
  };

  const selectVisible = () => {
    setSelectedKeys(
      (current) => {
        const next =
          new Set(current);

        for (
          const character of
          visibleCharacters
        ) {
          next.add(
            character.key
          );
        }

        return next;
      }
    );
  };

  const clearVisible = () => {
    setSelectedKeys(
      (current) => {
        const next =
          new Set(current);

        for (
          const character of
          visibleCharacters
        ) {
          next.delete(
            character.key
          );
        }

        return next;
      }
    );
  };

  const clearSelection = () => {
    setSelectedKeys(
      new Set()
    );
  };

  return {
    search,
    realm,
    className,
    minimumLevel,
    realms,
    classes,
    visibleCharacters,
    selectedCharacterKeys,
    selectedKeys,
    selectedCount,
    hiddenSelectedCount,
    setSearch,
    setRealm,
    setClassName,
    setMinimumLevel,
    toggleCharacter,
    selectVisible,
    clearVisible,
    clearSelection
  };
}