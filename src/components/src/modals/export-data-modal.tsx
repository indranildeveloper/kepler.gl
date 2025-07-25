// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import {injectIntl, IntlShape} from 'react-intl';

import {DatasetType, EXPORT_DATA_TYPE_OPTIONS} from '@kepler.gl/constants';
import {FormattedMessage} from '@kepler.gl/localization';
import {Datasets} from '@kepler.gl/table';

import {FileType} from '../common/icons';
import {
  StyledExportSection,
  StyledFilteredOption,
  StyledModalContent,
  StyledType,
  CheckMark
} from '../common/styled-components';
import {StyledWarning} from './export-map-modal/components';

const getDataRowCount = (
  datasets: Datasets,
  selectedDataset: string | undefined,
  filtered: boolean,
  intl: IntlShape
) => {
  if (selectedDataset === undefined) {
    return;
  }
  const selectedData = datasets[selectedDataset];
  if (!selectedData) {
    return intl.formatMessage(
      {id: 'modal.exportData.fileCount'},
      {fileCount: Object.keys(datasets).length}
    );
  }
  const {dataContainer, filteredIdxCPU} = selectedData;

  if (filtered && !filteredIdxCPU) {
    return '-';
  }

  const rowCount = filtered ? filteredIdxCPU?.length : dataContainer.numRows();

  return intl.formatMessage(
    {id: 'modal.exportData.rowCount'},
    {rowCount: rowCount?.toLocaleString()}
  );
};

export interface ExportDataModalProps {
  datasets: Datasets;
  selectedDataset?: string;
  dataType: string;
  filtered: boolean;
  // callbacks
  applyCPUFilter: (filter: string | string[]) => void;
  onChangeExportSelectedDataset: (dataset: string) => void;
  onChangeExportDataType: (type: string) => void;
  onChangeExportFiltered: (isFiltered: boolean) => void;
  intl: IntlShape;
  supportedDataTypes: {
    id: string;
    label: string;
    available: boolean;
  }[];
}

const ExportDataModalFactory = () => {
  class ExportDataModal extends Component<ExportDataModalProps> {
    componentDidMount() {
      const toCPUFilter = this.props.selectedDataset || Object.keys(this.props.datasets);
      this.props.applyCPUFilter(toCPUFilter);
    }

    _onSelectDataset: React.ChangeEventHandler<HTMLSelectElement> = ({target: {value}}) => {
      this.props.applyCPUFilter(value);
      this.props.onChangeExportSelectedDataset(value);
    };

    render() {
      const {
        supportedDataTypes = EXPORT_DATA_TYPE_OPTIONS,
        datasets,
        selectedDataset,
        dataType,
        filtered,
        onChangeExportDataType,
        onChangeExportFiltered,
        intl
      } = this.props;

      const exportAllDatasets = selectedDataset ? !datasets[selectedDataset] : true;
      const showTiledDatasetWarning = Object.keys(datasets).some(datasetId => {
        return (
          (datasets[datasetId].type === DatasetType.VECTOR_TILE ||
            datasets[datasetId].type === DatasetType.RASTER_TILE ||
            datasets[datasetId].type === DatasetType.WMS_TILE) &&
          (selectedDataset === datasetId || exportAllDatasets)
        );
      });

      return (
        <StyledModalContent className="export-data-modal">
          <div>
            <StyledExportSection>
              <div className="description">
                <div className="title">
                  <FormattedMessage id={'modal.exportData.datasetTitle'} />
                </div>
                <div className="subtitle">
                  <FormattedMessage id={'modal.exportData.datasetSubtitle'} />
                </div>
              </div>
              <div className="selection">
                <select value={selectedDataset} onChange={this._onSelectDataset}>
                  {[intl.formatMessage({id: 'modal.exportData.allDatasets'})]
                    .concat(Object.keys(datasets))
                    .map(d => (
                      <option key={d} value={d}>
                        {(datasets[d] && datasets[d].label) || d}
                      </option>
                    ))}
                </select>
              </div>
            </StyledExportSection>
            <StyledExportSection>
              <div className="description">
                <div className="title">
                  <FormattedMessage id={'modal.exportData.dataTypeTitle'} />
                </div>
                <div className="subtitle">
                  <FormattedMessage id={'modal.exportData.dataTypeSubtitle'} />
                </div>
              </div>
              <div className="selection">
                {supportedDataTypes.map(op => (
                  <StyledType
                    key={op.id}
                    selected={dataType === op.id}
                    onClick={() => op.available && onChangeExportDataType(op.id)}
                  >
                    <FileType ext={op.label} height="80px" fontSize="11px" />
                    {dataType === op.id && <CheckMark />}
                  </StyledType>
                ))}
              </div>
            </StyledExportSection>
            <StyledExportSection>
              <div className="description">
                <div className="title">
                  <FormattedMessage id={'modal.exportData.dataTypeTitle'} />
                </div>
                <div className="subtitle">
                  <FormattedMessage id={'modal.exportData.filterDataSubtitle'} />
                </div>
              </div>
              <div className="selection">
                <StyledFilteredOption
                  className="unfiltered-option"
                  selected={!filtered}
                  onClick={() => onChangeExportFiltered(false)}
                >
                  <div className="filter-option-title">
                    <FormattedMessage id={'modal.exportData.unfilteredData'} />
                  </div>
                  <div className="filter-option-subtitle">
                    {getDataRowCount(datasets, selectedDataset, false, intl)}
                  </div>
                  {!filtered && <CheckMark />}
                </StyledFilteredOption>
                <StyledFilteredOption
                  className="filtered-option"
                  selected={filtered}
                  onClick={() => onChangeExportFiltered(true)}
                >
                  <div className="filter-option-title">
                    <FormattedMessage id={'modal.exportData.filteredData'} />
                  </div>
                  <div className="filter-option-subtitle">
                    {getDataRowCount(datasets, selectedDataset, true, intl)}
                  </div>
                  {filtered && <CheckMark />}
                </StyledFilteredOption>
              </div>
            </StyledExportSection>
            {showTiledDatasetWarning ? (
              <div className="title">
                <StyledWarning>
                  <FormattedMessage id={'modal.exportData.tiledDatasetWarning'} />
                </StyledWarning>
              </div>
            ) : null}
          </div>
        </StyledModalContent>
      );
    }
  }

  return injectIntl(ExportDataModal);
};

export default ExportDataModalFactory;
