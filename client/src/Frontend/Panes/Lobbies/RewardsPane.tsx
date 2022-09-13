import _ from 'lodash';
import React from 'react';
import { DarkForestNumberInput, NumberInput } from '../../Components/Input';
import { Row } from '../../Components/Row';
import { LobbiesPaneProps, Warning } from './LobbiesUtils';

const rowChunkSize = 8;
const rowStyle = { gap: '8px' } as CSSStyleDeclaration & React.CSSProperties;
// Handling the non-input lvl 0 by calculating the items in the row
const itemStyle = { flex: `1 1 ${Math.floor(100 / rowChunkSize)}%` };

function RewardByPlayerRank({
  index,
  value,
  onUpdate,
}: LobbiesPaneProps & { value: number | undefined; index: number }) {
  return (
    <div style={itemStyle}>
      <span>Rank {index}</span>
      <NumberInput
        format='integer'
        value={value}
        onChange={(e: Event & React.ChangeEvent<DarkForestNumberInput>) => {
          onUpdate({ type: 'ROUND_END_REWARDS_BY_RANK', index, value: e.target.value });
        }}
      />
    </div>
  );
}

export function RewardsPane({ config, onUpdate }: LobbiesPaneProps) {
  let rewardInputs = null;
  if (config.ROUND_END_REWARDS_BY_RANK.displayValue) {
    rewardInputs = _.chunk(config.ROUND_END_REWARDS_BY_RANK.displayValue, rowChunkSize).map(
      (items, rowIdx) => {
        return (
          <Row key={`reward-row-${rowIdx}`} style={rowStyle}>
            {items.map((displayValue, idx) => (
              <RewardByPlayerRank
                key={`reward-rank-${idx}`}
                config={config}
                value={displayValue}
                index={rowIdx * rowChunkSize + idx}
                onUpdate={onUpdate}
              />
            ))}
          </Row>
        );
      }
    );
  }

  return (
    <>
      <Row>
        <span>XDAI Reward for Players based on their rank at the end of the round</span>
      </Row>
      {rewardInputs}
      <Row>
        <Warning>{config.ROUND_END_REWARDS_BY_RANK.warning}</Warning>
      </Row>
    </>
  );
}
