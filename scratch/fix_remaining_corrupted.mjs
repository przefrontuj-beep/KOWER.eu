import fs from "fs";

const filePath = "components/admin/VisibilityOrderManager.tsx";

const replacements = [
  ["gĹĂłwnej", "głównej"],
  ["gĹĂłwna", "główna"],
  ["gĹĂłwną", "główną"],
  ["odrzuciĹ", "odrzucił"],
  ["SprawdĹ", "Sprawdź"],
  ["reguĹy", "reguły"],
  ["bĹąd", "błąd"],
  ["BĹąd", "Błąd"],
  ["UkĹad", "Układ"],
  ["taĹmie", "taśmie"],
  ["kolejnoĹć", "kolejność"],
  ["kolejnoĹci", "kolejności"],
  ["WĹącz", "Włącz"],
  ["przeĹącznikiem", "przełącznikiem"],
  ["„Na gĹĂłwnejť", "„Na głównej”"],
  ["PeĹna", "Pełna"],
  ["elementĂłw", "elementów"],
  ["Nie udaĹo", "Nie udało"],
  ["WysyĹam", "Wysyłam"],
  ["wersję Ĺrednią", "wersję średnią"],
  ["ĹĽadnego", "żadnego"],
  ["TytuĹ", "Tytuł"],
  ["zostaĹa", "została"],
  ["SprĂłbuj", "Spróbuj"],
  ["niezaleĹĽną", "niezależną"],
  ["OdĹwieĹĽ", "Odśwież"],
  ["PrzesyĹam", "Przesyłam"],
  ["poĹączenia", "połączenia"],
  ["PrzesuĹ", "Przesuń"],
  ["Ĺrodowiskowe", "środowiskowe"],
  ["widocznoĹć", "widoczność"],
  ["Â·", "·"]
];

console.log("Reading file...");
let content = fs.readFileSync(filePath, "utf8");

for (const [bad, good] of replacements) {
  const count = content.split(bad).length - 1;
  if (count > 0) {
    console.log(`Replacing "${bad}" with "${good}" (${count} times)`);
    content = content.split(bad).join(good);
  }
}

fs.writeFileSync(filePath, content, "utf8");
console.log("Finished writing fixed file.");
