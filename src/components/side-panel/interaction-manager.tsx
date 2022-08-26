// Copyright (c) 2022 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from 'react';
import {InteractionConfig} from '@kepler.gl/types';
import InteractionPanelFactory from './interaction-panel/interaction-panel';
import {VisStateActions} from '@kepler.gl/actions';
import {Datasets} from 'reducers/table-utils/kepler-table';

type InteractionManagerProps = {
  interactionConfig: InteractionConfig;
  datasets: Datasets;
  visStateActions: typeof VisStateActions;
};

InteractionManagerFactory.deps = [InteractionPanelFactory];

function InteractionManagerFactory(InteractionPanel: ReturnType<typeof InteractionPanelFactory>) {
  const InteractionManager = ({
    interactionConfig,
    datasets,
    visStateActions
  }: InteractionManagerProps) => {
    const {interactionConfigChange: onConfigChange} = visStateActions;

    return (
      <div className="interaction-manager">
        {Object.keys(interactionConfig).map(key => (
          <InteractionPanel
            datasets={datasets}
            config={interactionConfig[key]}
            key={key}
            onConfigChange={onConfigChange}
          />
        ))}
      </div>
    );
  };

  return InteractionManager;
}

export default InteractionManagerFactory;