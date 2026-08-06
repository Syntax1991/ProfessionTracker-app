import {
  useEffect,
  useMemo,
  useState
} from "react";
import type { BattleNetCharacterPreview } from "../types/battlenet.types";

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
  setSearch: (value: string) => void;
  setRealm: (value: string) => void;
  setClassName: (value: string) => void;
  setMinimumLevel: (value: number) => void;
  toggleCharacter: (key: string) => void;
  selectVisible: () => void;
  clearVisible: () => void;
  clearSelection: () => void;
};

export function useBattleNetCharacterSelection(
  characters: BattleNetCharacterPreview[],
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
  ] = useState(
    defaultMinimumLevel
  );

  const [
    selectedKeys,
    setSelectedKeys
  ] = useState<Set<string>>(
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

  const realms = useMemo(
    () =>
      [...new Set(
        characters.map(
          (character) =>
            character.realm
        )
      )].sort(
        (left, right) =>
          left.localeCompare(
            right,
            "de"
          )
      ),
    [characters]
  );

  const classes = useMemo(
    () =>
      [...new Set(
        characters.map(
          (character) =>
            character.className
        )
      )].sort(
        (left, right) =>
          left.localeCompare(
            right,
            "de"
          )
      ),
    [characters]
  );

  const visibleCharacters =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLocaleLowerCase(
            "de"
          );

      return characters.filter(
        (character) => {
          if (
            character.level <
            minimumLevel
          ) {
            return false;
          }

          if (
            realm !== "ALL" &&
            character.realm !== realm
          ) {
            return false;
          }

          if (
            className !== "ALL" &&
            character.className !==
              className
          ) {
            return false;
          }

          if (!normalizedSearch) {
            return true;
          }

          const searchableText = [
            character.name,
            character.realm,
            character.className
          ]
            .join(" ")
            .toLocaleLowerCase(
              "de"
            );

          return searchableText.includes(
            normalizedSearch
          );
        }
      );
    }, [
      characters,
      className,
      minimumLevel,
      realm,
      search
    ]);

  const selectedCharacterKeys =
    useMemo(
      () => [...selectedKeys],
      [selectedKeys]
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
    selectedCount:
      selectedKeys.size,
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