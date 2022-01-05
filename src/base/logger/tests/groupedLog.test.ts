import { GROUPED_LOG_ID, groupedLog, isGroupedLog } from '../groupedLog';

describe(isGroupedLog.name, () => {
  test('it should return true given grouped log', () => {
    expect(isGroupedLog(groupedLog('test-group'))).to.be.true;
  });

  test('it should return false given random object', () => {
    expect(isGroupedLog({})).to.be.false;
  });

  test('it should return false given primitive value', () => {
    expect(isGroupedLog(10)).to.be.false;
  });
});

describe(groupedLog.name, () => {
  test('it should create GroupedLog', () => {
    const group = groupedLog('test-group');
    expect(group[GROUPED_LOG_ID]).to.be.true;
    expect(group.title).to.equal('test-group');
    expect(group.logs).to.be.empty;
  });

  test('it should add log', () => {
    const group = groupedLog('test-group').log(
      'Test Message',
      'Test Message Two'
    );
    expect(group.logs).eqls([{ data: ['Test Message', 'Test Message Two'] }]);
  });

  test('it should add labelled log', () => {
    const group = groupedLog('test-group').labelledLog(
      'Test Label',
      'Test Message'
    );
    expect(group.logs).eqls([{ label: 'Test Label', data: ['Test Message'] }]);
  });

  test('it should nest groups', () => {
    const group = groupedLog('test-group')
      .log('Test Message')
      .groupStart('test-group-2')
      .log('Test Message 2')
      .groupEnd()
      .log('Test Message 3');

    expect(JSON.stringify(group.logs)).to.equal(
      JSON.stringify([
        { data: ['Test Message'] },
        groupedLog('test-group-2').log('Test Message 2'),
        { data: ['Test Message 3'] }
      ])
    );
  });
});
