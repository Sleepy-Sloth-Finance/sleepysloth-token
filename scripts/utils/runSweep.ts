export function runSweep(salers: any, object: any) {
  Object.keys(object).forEach((key) => {
    salers.push([key, object[key]]);
  });
}
