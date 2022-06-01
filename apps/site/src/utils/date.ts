const monthNumeric = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

export function sortMonthYearFiles(files: string[]) {
  return files.sort((fileA, fileB) => {
    const [monthA, yearA] = fileA.replace(/\.md($|\/)/, '').split('-');
    const [monthB, yearB] = fileB.replace(/\.md($|\/)/, '').split('-');

    if (yearA === yearB) {
      const monthANum = monthNumeric[monthA];
      const monthBNum = monthNumeric[monthB];

      if (monthANum < monthBNum) {
        return -1;
      } else if (monthBNum > monthANum) {
        return 1;
      }

      return 0;
    } else if (yearA < yearB) {
      return -1;
    } else if (yearB > yearA) {
      return 1;
    }

    return 0;
  });
}
