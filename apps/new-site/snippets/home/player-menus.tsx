import clsx from 'clsx';
import React from 'react';
import { Menu, useMediaRemote, useMediaState, useVideoQualityOptions } from '@vidstack/react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  SettingsIcon,
  SettingsMenuIcon,
} from '@vidstack/react/icons';

export function Settings() {
  return (
    <Menu.Root>
      <Menu.Button
        className={clsx(
          'w-10 h-10 flex items-center justify-center',
          'rounded-sm hocus:bg-white/20 select-none',
        )}
      >
        <SettingsIcon />
      </Menu.Button>
      <Menu.Portal>
        <Menu.Content
          className={clsx(
            'flex flex-col p-2.5 bg-black/95 rounded-md max-h-[250px]',
            // Enter Animation
            'animate-in fade-in slide-in-from-top-4',
            // Exit Animation
            'animate-out fade-out slide-out-to-top-2',
          )}
          placement="bottom end"
        >
          <QualitySubmenu />
          {/* ... */}
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
}

function QualitySubmenu() {
  const options = useVideoQualityOptions({ sort: 'descending' }),
    autoQuality = useMediaState('autoQuality'),
    remote = useMediaRemote(),
    currentQualityText = options.selectedQuality?.height + 'p' ?? '',
    hint = !autoQuality ? currentQualityText : `Auto (${currentQualityText})`;
  return (
    <Menu.Root>
      <Menu.Button className="group flex items-center text-white" disabled={!options.length}>
        <ArrowLeftIcon className="w-5 h-5 mr-1.5 hidden group-aria-expanded:inline-block" />
        <SettingsMenuIcon className="w-5 h-5 mr-1.5 group-aria-expanded:hidden" />
        <span className="text-sm font-medium">Quality</span>
        <span className="ml-auto text-xs text-black/50 group-aria-expanded:hidden">{hint}</span>
        <ArrowRightIcon className="w-5 h-5 ml-1.5 group-aria-expanded:hidden" />
      </Menu.Button>

      <Menu.Content className="aria-hidden:hidden">
        <Menu.RadioGroup className="flex flex-col space-y-1" value={options.selectedValue}>
          <Menu.Radio
            className="w-full px-2 py-1 flex items-center rounded-sm hocus:bg-white/20"
            value="auto"
            onSelect={(event) => remote.requestAutoQuality(event)}
          >
            <RadioCheck />
            Auto
          </Menu.Radio>
          {options.map(({ label, value, bitrateText, select }) => (
            <Menu.Radio
              className="group w-full px-2 py-1 flex items-center rounded-sm hocus:bg-white/20"
              value={value}
              onSelect={select}
              key={value}
            >
              <RadioCheck />
              <span className="text-sm text-white font-medium">{label}</span>
              <span className="ml-auto bg-white/50 text-xs">{bitrateText}</span>
            </Menu.Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

function RadioCheck() {
  return (
    <div
      className={clsx(
        'w-2 h-2 rounded-full flex items-center justify-center',
        'border border-white/50 mr-1.5',
      )}
    >
      <div className="w-1 h-1 bg-white hidden group-aria-checked:inline-block" />
    </div>
  );
}
