const Sequencer = require('@jest/test-sequencer').default

class CustomSequencer extends Sequencer {
  /**
   * Select tests for shard requested via --shard=shardIndex/shardCount
   * Sharding is applied before sorting
   */
  shard(tests, { shardIndex, shardCount }) {
    const shardSize = Math.ceil(tests.length / shardCount)
    const shardStart = shardSize * (shardIndex - 1)
    const shardEnd = shardSize * shardIndex

    return [...tests].sort((a, b) => (a.path > b.path ? 1 : -1)).slice(shardStart, shardEnd)
  }

  /**
   * Sort method for identifying order of execution in alphabetical order
   */
  sort(tests) {
    const testsClone = tests.slice().map(test => Object.assign({}, test))
    return testsClone.sort((t1, t2) => t1.path.localeCompare(t2.path))
  }
}

module.exports = CustomSequencer
