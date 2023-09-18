import { parse } from "node-html-parser";

const inputFile = Bun.file('./data.html');
const outputFIle = Bun.file('./data.json');

const document = parse(await inputFile.text());

class Pair {
  constructor(
    public num: number,
    public name: string,
    public teacher: string,
    public cabinet: string,
  ) { }
}

class GroupData {
  pairs: Pair[] = [];
  constructor(public name: string) { }
}

const groupsData: GroupData[] = [];

for (const element of document.querySelectorAll('.row')) {
  if (element.classNames.indexOf('mt-3') !== -1) {
    groupsData.push(new GroupData(element.innerText.trim()));
    continue;
  }

  const last = groupsData.at(-1);

  if (!last || element.classNames !== 'row')
    continue;

  const [num, data, cab] = element.querySelectorAll('.info');
  const name = data.querySelector('h4')?.text.trim() ?? '';
  const teacher = data.querySelector('p')?.text.trim() ?? '';

  last.pairs.push(
    new Pair(
      +num.text.trim(),
      name,
      teacher,
      cab.text.trim()
    )
  );
}

outputFIle.writer()
  .write(JSON.stringify(groupsData));
