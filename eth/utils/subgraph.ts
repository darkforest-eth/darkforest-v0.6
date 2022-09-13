import type { JsonFragment } from '@ethersproject/abi';

// To workaround https://github.com/graphprotocol/graph-cli/issues/588
// we remove calls they can't process from a special export subgraph ABI
export function abiFilter(item: JsonFragment) {
  if (item.type === 'function') {
    // filter out all non view fns
    if (item.stateMutability === 'nonpayable' || item.stateMutability === 'payable') {
      return false;
    }

    for (const input of item.inputs ?? []) {
      if (input.type?.includes('][') || input.internalType.includes('][')) {
        return false;
      }

      for (const component of input.components ?? []) {
        if (component.internalType.includes('][')) {
          return false;
        }
      }
    }

    for (const output of item.outputs ?? []) {
      if (output.type?.includes('][') || output.internalType.includes('][')) {
        return false;
      }

      for (const component of output.components ?? []) {
        if (component.internalType.includes('][')) {
          return false;
        }
      }
    }
  }
  return true;
}
