// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo, useState} from 'react';
import styled from 'styled-components';

import {Accessor, DropdownList, LazyTippy, Typeahead} from '@kepler.gl/components';
import {ColorRange, SCALE_TYPES} from '@kepler.gl/constants';
import {Layer, VisualChannelDomain} from '@kepler.gl/layers';
import {ColorUI, Field, NestedPartial} from '@kepler.gl/types';
import {colorBreaksToColorMap, getLayerColorScale, getLegendOfScale, hasColorMap} from '@kepler.gl/utils';
import ColorBreaksPanelFactory, {ColorBreaksPanelProps} from './color-breaks-panel';
import {SetColorUIFunc} from './custom-palette';
import DropdownSelect from '../../common/item-selector/dropdown-select';
import {KeplerTable} from '@kepler.gl/table';
import type {Instance as TippyInstance} from 'tippy.js';

export type ScaleOption = {
  label: string;
  value: string;
};
export type OnSelectFunc = (v: string, visConfg?: Record<string, any>) => void;

export type ContextProps = ColorBreaksPanelProps;

export type ColorScaleSelectorProps = {
  layer: Layer;
  field: Field;
  dataset: KeplerTable;
  scaleType: string;
  domain: VisualChannelDomain;
  range: ColorRange;
  onSelect: OnSelectFunc;
  setColorUI: SetColorUIFunc;
  colorUIConfig: ColorUI;
  options: ScaleOption[];
  disabled?: boolean;
  selectedItems: ScaleOption[];
  multiSelect: boolean;
  searchable: boolean;
  displayOption: string;
  getOptionValue: string;
};

const DropdownPropContext = React.createContext({});
const POPPER_OPTIONS = {
  modifiers: [
    // zero offsets since they are already added in VerticalToolbar
    {name: 'offset', options: {offset: [0, 0]}}
  ]
};

const DropdownBottom = styled.div<{light?: boolean}>`
  border-top: 1px solid
    ${props =>
      props.light ? props.theme.dropdownListBorderTopLT : props.theme.dropdownListBorderTop};
`;

const StyledScaleSelectDropdown = styled.div`
  box-shadow: ${props => props.theme.dropdownListShadow};
  .list-selector {
    box-shadow: none;
    border-top: 0;
  }
  .list__item {
    padding: 4px 9px;
  }
`;
const DropdownWrapper = styled.div`
  border: 0;
  width: 100%;
  left: 0;
  z-index: ${props => props.theme.dropdownWrapperZ};
  position: absolute;
  margin-top: ${props => props.theme.dropdownWapperMargin}px;
`;

const StyledColorScaleSelector = styled.div`
  position: relative;
  .typeahead {
    // adds padding to bottom of dropdown
    margin-bottom: 40px;
  }
  [data-tippy-root] {
    width: 100%;
  }
`;

function hideTippy(tippyInstance) {
  if (tippyInstance) {
    tippyInstance.hide();
  }
}
ColorScaleSelectorFactory.deps = [ColorBreaksPanelFactory];

function ColorScaleSelectorFactory(
  ColorBreaksPanel: ReturnType<typeof ColorBreaksPanelFactory>
): React.FC<ColorScaleSelectorProps> {
  const ColorScaleSelectDropdown = props => (
    <StyledScaleSelectDropdown>
      <DropdownList {...props} />
      <DropdownPropContext.Consumer>
        {(context: any) => (
          <DropdownBottom>
            <ColorBreaksPanel {...context} />
          </DropdownBottom>
        )}
      </DropdownPropContext.Consumer>
    </StyledScaleSelectDropdown>
  );

  const ColorScaleSelector: React.FC<ColorScaleSelectorProps> = ({
    layer,
    field,
    dataset,
    onSelect,
    scaleType,
    domain,
    range,
    setColorUI,
    colorUIConfig,
    ...dropdownSelectProps
  }) => {
    const displayOption = Accessor.generateOptionToStringFor(dropdownSelectProps.displayOption);
    const getOptionValue = useMemo(
      () => Accessor.generateOptionToStringFor(dropdownSelectProps.getOptionValue),
      [dropdownSelectProps.getOptionValue]
    );
    const [tippyInstance, setTippyInstance] = useState<TippyInstance>();
    const isEditingColorBreaks = colorUIConfig?.colorRangeConfig?.customBreaks;
    const colorScale = useMemo(
      () =>
        getLayerColorScale({
          range,
          domain,
          scaleType,
          layer
        }),
      [range, domain, scaleType, layer]
    );

    const colorBreaks = useMemo(
      () =>
        colorScale ? getLegendOfScale({scale: colorScale, scaleType, fieldType: field.type}) : null,
      [colorScale, scaleType, field.type]
    );

    const onSelectScale = useCallback(
      val => {
        // highlight selected option
        if (getOptionValue(val) === SCALE_TYPES.custom) {
          // update custom breaks
          const customPalette: NestedPartial<ColorRange> = {
            name: 'color.customPalette',
            type: 'custom',
            category: 'Custom',
            colors: range.colors,
            colorMap: range.colorMap
              ? range.colorMap
              : colorBreaks
              ? colorBreaksToColorMap(colorBreaks)
              : undefined
          };
          setColorUI({
            showColorChart: true,
            colorRangeConfig: {
              customBreaks: true
            },
            customPalette
          });
          onSelect(SCALE_TYPES.custom, customPalette);
        } else {
          // not custom
          if (isEditingColorBreaks) {
            setColorUI({
              colorRangeConfig: {
                customBreaks: false
              }
            });
          }
          if (hasColorMap(range)) {
            // remove custom breaks
            // eslint-disable-next-line no-unused-vars
            const {colorMap: _, ...newRange} = range;
            onSelect(getOptionValue(val), newRange);
          } else {
            onSelect(getOptionValue(val));
          }
        }
      },
      [setColorUI, onSelect, range, getOptionValue, isEditingColorBreaks, colorBreaks]
    );

    const onApply = useCallback(() => {
      onSelect(SCALE_TYPES.custom, colorUIConfig.customPalette);
      hideTippy(tippyInstance);
    }, [onSelect, colorUIConfig.customPalette, tippyInstance]);

    const onCancel = useCallback(() => {
      hideTippy(tippyInstance);
    }, [tippyInstance]);

    const isCustomBreaks = scaleType === SCALE_TYPES.custom;

    return (
      <DropdownPropContext.Provider
        value={{
          setColorUI,
          colorField: field,
          dataset,
          colorUIConfig,
          colorBreaks,
          isCustomBreaks,
          onScaleChange: onSelect,
          onApply,
          onCancel
        }}
      >
        <StyledColorScaleSelector>
          <LazyTippy
            trigger="click"
            placement="bottom-start"
            appendTo="parent"
            interactive={true}
            hideOnClick={!isEditingColorBreaks}
            onCreate={setTippyInstance}
            popperOptions={POPPER_OPTIONS}
            render={attrs => (
              <DropdownWrapper {...attrs}>
                {/*@ts-ignore*/}
                {!dropdownSelectProps.disabled && (
                  <Typeahead
                    {...dropdownSelectProps}
                    displayOption={displayOption}
                    // @ts-ignore
                    getOptionValue={getOptionValue}
                    onOptionSelected={onSelectScale}
                    customListComponent={ColorScaleSelectDropdown}
                    searchable={false}
                    showOptionsWhenEmpty
                  />
                )}
              </DropdownWrapper>
            )}
          >
            <div className="dropdown-select">
              {/*@ts-ignore*/}
              <DropdownSelect
                {...dropdownSelectProps}
                displayOption={displayOption}
                value={dropdownSelectProps.selectedItems[0]}
              />
            </div>
          </LazyTippy>
        </StyledColorScaleSelector>
      </DropdownPropContext.Provider>
    );
  };
  return ColorScaleSelector;
}
export default ColorScaleSelectorFactory;
