// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {line} from 'd3-shape';
import {FormattedMessage} from '@kepler.gl/localization';

import Table from '../example-table';

const CenterFlexbox = styled.div`
  display: flex;
  align-items: center;
`;

const lineFunction = line()
  .x(d => d[0] * 10)
  .y(d => d[1] * 10);

const IconShape = ({mesh}) => (
  <svg className="icon-table__item__shape" width="20px" height="20px">
    <g transform="translate(10, 10)">
      {mesh.cells.map((cell, i) => (
        <path key={i} fill="#000000" d={lineFunction(cell.map(idx => mesh.positions[idx]))} />
      ))}
    </g>
  </svg>
);

const StyledIconItem = styled(CenterFlexbox)`
  padding-left: 6px;
  width: 180px;
  height: 48px;
  margin-right: 12px;

  .icon-table_item__name {
    margin-left: 12px;
  }
`;

const StyledCode = styled.code`
  color: ${props => props.theme.titleColorLT};
`;

const StyledTitle = styled.div`
  font-size: 20px;
  letter-spacing: 1.25px;
  margin: 18px 0 14px 0;
  color: ${props => props.theme.titleColorLT};
`;

const IconItem = ({icon: {id, mesh}}) => (
  <StyledIconItem className="icon-table__item">
    <IconShape mesh={mesh} />
    <div className="icon-table_item__name">
      <StyledCode>{id}</StyledCode>
    </div>
  </StyledIconItem>
);

const ExampleTable = () => (
  <Table className="icon-example-table">
    <thead>
      <tr>
        <th>point_lat</th>
        <th>point_lng</th>
        <th>icon</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>37.769897</td>
        <td>-122.41168</td>
        <td>
          <StyledCode>android</StyledCode>
        </td>
      </tr>
      <tr>
        <td>37.806928</td>
        <td>-122.40218</td>
        <td />
      </tr>
      <tr>
        <td>37.778564</td>
        <td>-122.39096</td>
        <td>
          <StyledCode>calendar</StyledCode>
        </td>
      </tr>
      <tr>
        <td>37.745995</td>
        <td>-122.30220</td>
        <td />
      </tr>
      <tr>
        <td>37.329841</td>
        <td>-122.103847</td>
        <td>
          <StyledCode>control-off</StyledCode>
        </td>
      </tr>
    </tbody>
  </Table>
);

const IconTable = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const IconInfoModalFactory = (svgIcons: any[] = []) => {
  const IconInfoModal = () => (
    <div className="icon-info-modal">
      <div className="icon-info-modal__description">
        <FormattedMessage id={'modal.iconInfo.description1'} />{' '}
        <code>
          <FormattedMessage id={'modal.iconInfo.code'} />
        </code>
        <FormattedMessage id={'modal.iconInfo.description2'} />
      </div>
      <div className="icon-info-modal__example">
        <StyledTitle>
          <FormattedMessage id={'modal.iconInfo.example'} />
        </StyledTitle>
        <ExampleTable />
      </div>
      <div className="icon-info-modal__icons">
        <StyledTitle>
          <FormattedMessage id={'modal.iconInfo.icons'} />
        </StyledTitle>
        <IconTable className="icon-info-modal__icons__table">
          {svgIcons.map(icon => (
            <IconItem key={icon.id} icon={icon} />
          ))}
        </IconTable>
      </div>
    </div>
  );

  return IconInfoModal;
};

export default IconInfoModalFactory;
