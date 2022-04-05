beforeEach(() => null);
it('tests expect(6).toBe(3)', async () => {
	expect(6).toBe(3);
});

it('tests expect(6).isMoreThan(3)', async () => {
	expect(6).isMoreThan(3);
});

it('tests expect(6).isMoreThan(7)', async () => {
	expect(6).isMoreThan(7);
});

it('tests expect(6).isLessThan(7)', async () => {
	expect(6).isLessThan(7);
});

it('tests expect(6).isLessThan(3).isTypeof(number)', async () => {
	expect(6).isLessThan(3).isTypeof('number');
});

it(`tests expect ['Dave', 'Geoff'] to include 'Dave' `, async () => {
	expect([
		'Dave',
		'Geoff'
	]).toInclude('Dave');
});

it(`tests expect ['Dave', 'Geoff'] to include 'Kelly' `, async () => {
	expect([
		'Dave',
		'Geoff'
	]).toInclude('Kelly');
});

it(`tests expect 'The lazy dog' to include 'dog' `, async () => {
	expect('The lazy dog').toInclude('dog');
});
