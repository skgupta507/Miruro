import React, { useState, useMemo, useCallback } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

interface Episode {
  id: string;
  number: number;
  title: string;
  image: string;
}

interface Props {
  episodes: Episode[];
  selectedEpisodeId: string;
  onEpisodeSelect: (id: string) => void;
}

const ListContainer = styled.div`
  background-color: var(--global-secondary-bg);
  color: var(--global-text);
  border-radius: 0.2rem;
  overflow: hidden;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const EpisodeGrid = styled.div<{ $isRowLayout: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isRowLayout }) =>
    $isRowLayout ? "1fr" : "repeat(auto-fill, minmax(4rem, 1fr))"};
  gap: 0.4rem;
  padding: 0.75rem;
  overflow-y: auto;
  flex-grow: 1;
`;

const ListItem = styled.button<{ $isSelected: boolean; $isRowLayout: boolean }>`
  background-color: var(--global-tertiary-bg);
  border: none;
  border-radius: 0.2rem;
  color: ${({ $isSelected }) => ($isSelected ? "white" : "grey")};
  padding: ${({ $isRowLayout }) =>
    $isRowLayout ? "0.6rem 0.5rem" : "0.4rem 0"};
  text-align: ${({ $isRowLayout }) => ($isRowLayout ? "left" : "center")};
  cursor: pointer;
  justify-content: ${({ $isRowLayout }) =>
    $isRowLayout ? "space-between" : "center"};
  align-items: center;
  transition: background-color 0.15s, color 0.15s;

  &:hover {
    background-color: var(--global-button-hover-bg);
    color: white;
  }
`;

const SelectInterval = styled.select`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 10px;
  background-color: var(--global-secondary-bg);
  color: var(--global-text);
  border: 1px solid var(--global-shadow);
  border-top: none;
  border-right: none;
  border-left: none;
`;

const EpisodeNumber = styled.span``;
const EpisodeTitle = styled.span`
  padding: 0.5rem;
`;

const EpisodeList: React.FC<Props> = ({
  episodes,
  selectedEpisodeId,
  onEpisodeSelect,
}) => {
  const [interval, setInterval] = useState<[number, number]>([0, 99]);
  const isRowLayout = episodes.length < 26;

  const intervalOptions = useMemo(() => {
    return episodes.reduce<{ start: number; end: number }[]>(
      (options, _, index) => {
        if (index % 100 === 0) {
          const start = index;
          const end = Math.min(index + 99, episodes.length - 1);
          options.push({ start, end });
        }
        return options;
      },
      []
    );
  }, [episodes]);

  const handleIntervalChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const [start, end] = e.target.value.split("-").map(Number);
      setInterval([start, end]);
    },
    []
  );

  return (
    <ListContainer>
      <SelectInterval onChange={handleIntervalChange}>
        {intervalOptions.map(({ start, end }, index) => (
          <option key={index} value={`${start}-${end}`}>
            Episodes {start + 1} - {end + 1}
          </option>
        ))}
      </SelectInterval>

      <EpisodeGrid $isRowLayout={isRowLayout}>
        {episodes.slice(interval[0], interval[1] + 1).map((episode) => {
          const $isSelected = episode.id === selectedEpisodeId;

          return (
            <ListItem
              key={episode.id}
              $isSelected={$isSelected}
              $isRowLayout={isRowLayout}
              onClick={() => onEpisodeSelect(episode.id)}
              aria-selected={$isSelected}
            >
              {isRowLayout ? (
                <>
                  <EpisodeNumber>{episode.number}</EpisodeNumber>
                  <EpisodeTitle>{episode.title}</EpisodeTitle>
                  {$isSelected && <FontAwesomeIcon icon={faPlay} />}
                </>
              ) : $isSelected ? (
                <FontAwesomeIcon icon={faPlay} />
              ) : (
                <EpisodeNumber>{episode.number}</EpisodeNumber>
              )}
            </ListItem>
          );
        })}
      </EpisodeGrid>
    </ListContainer>
  );
};

export default EpisodeList;