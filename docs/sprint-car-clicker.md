# Sprint: widok gry Car Clicker

## Cel sprintu

Przygotowanie pierwszej wersji widoku gry clickerowej opartej o samochod i tuning. Gracz klika w samochod, zarabia walute, kupuje ulepszenia i stopniowo zwieksza zarobek za klikniecie oraz zarobek pasywny.

Widok ma byc grywalnym MVP, nie tylko makieta. Po sprincie uzytkownik powinien moc wejsc na ekran gry, klikac samochod, widziec aktualny stan waluty, kupowac ulepszenia i czuc postep.

## Zakres MVP

- Nowy ekran gry w aplikacji mobilnej.
- Centralny samochod jako glowny obiekt do klikania.
- Waluta gry, np. `monety`, `cash` albo `garage points`.
- Zarobek za klikniecie: `per click`.
- Zarobek pasywny: `per second`.
- Lista ulepszen z cena, poziomem i efektem.
- Prosta wizualna reakcja po kliknieciu.
- Blokada zakupu, gdy gracz ma za malo waluty.
- Lokalny stan gry na czas sesji.
- Prosty zapis lokalny stanu gry, jesli projekt ma juz gotowy mechanizm storage.

## Glowne mechaniki

### Klikanie samochodu

- Tap w samochod dodaje walute.
- Kwota zalezy od aktualnego `per click`.
- Po kliknieciu widac krotki feedback:
  - animacja samochodu,
  - liczba zarobionych monet nad autem,
  - delikatny blysk, wibracja albo dzwiek w pozniejszym etapie.

### Ulepszenia per click

Ulepszenia zwiekszajace zarobek z jednego klikniecia:

- Lepsze opony: stabilny, tani upgrade startowy.
- Chip tuning: sredni koszt, mocny wzrost `per click`.
- Turbo: drozsze ulepszenie z wyraznym skokiem zarobku.
- Sportowy wydech: umiarkowany wzrost i element wizualny.
- Lzejsza karoseria: pozniejszy upgrade dla szybszego progresu.

### Ulepszenia pasywne

Ulepszenia zarabiajace automatycznie:

- Mechanik w garazu: generuje staly dochod co sekunde.
- Myjnia samochodowa: maly, stabilny pasywny dochod.
- Warsztat tuningowy: drozszy, ale mocniejszy pasywny dochod.
- Ekipa pit stop: szybsze generowanie waluty.
- Dealer aut: pozna mechanika, wysoki pasywny dochod.

### Sciezki rozwoju auta

Gracz powinien miec kilka opcji rozwoju, zamiast jednej liniowej listy:

- Moc: silnik, turbo, chip tuning, paliwo premium.
- Wyglad: lakier, felgi, body kit, neon.
- Garaz: mechanicy, narzedzia, warsztat, dealer.
- Automatyzacja: pasywny dochod, bonus offline, mnozniki czasowe.

W MVP wystarcza dwie sciezki: `Moc` i `Garaz`. Pozostale mozna dodac po sprawdzeniu, czy podstawowa petla gry jest przyjemna.

## Proponowany model ekonomii

### Stan gry

```ts
type CarClickerState = {
  cash: number;
  perClick: number;
  perSecond: number;
  upgrades: Record<string, number>;
  selectedCarTier: number;
};
```

### Ulepszenie

```ts
type Upgrade = {
  id: string;
  name: string;
  category: 'power' | 'garage' | 'style' | 'automation';
  baseCost: number;
  costMultiplier: number;
  perClickBonus?: number;
  perSecondBonus?: number;
  maxLevel?: number;
};
```

### Przykladowe wartosci startowe

| Ulepszenie | Kategoria | Koszt bazowy | Efekt | Mnoznik ceny |
| --- | --- | ---: | --- | ---: |
| Lepsze opony | Moc | 25 | +1 per click | 1.18 |
| Chip tuning | Moc | 120 | +5 per click | 1.25 |
| Turbo | Moc | 600 | +25 per click | 1.32 |
| Mechanik | Garaz | 80 | +1 per second | 1.2 |
| Warsztat | Garaz | 450 | +8 per second | 1.28 |
| Dealer | Garaz | 2500 | +45 per second | 1.35 |

Koszt kolejnego poziomu:

```txt
nextCost = floor(baseCost * costMultiplier ^ currentLevel)
```

## Progres samochodu

Samochod moze zmieniac wyglad po przekroczeniu progow:

- Tier 1: seryjny samochod.
- Tier 2: nowe felgi i lekki tuning.
- Tier 3: sportowy body kit.
- Tier 4: turbo, neon, agresywny wyglad.
- Tier 5: supercar albo auto pokazowe.

Progi mozna liczyc po sumie poziomow ulepszen albo po lacznym zarobionym cashu. W MVP prostsze bedzie liczenie po lacznym poziomie ulepszen.

## Proponowany layout widoku

- Gorna sekcja:
  - aktualny cash,
  - `per click`,
  - `per second`.
- Srodek:
  - duzy samochod do klikania,
  - animacja feedbacku po kliknieciu,
  - pasek progresu do kolejnego tieru auta.
- Dolna sekcja:
  - zakladki albo segmenty: `Moc`, `Garaz`, pozniej `Styl`, `Auto`.
  - lista ulepszen z cena, poziomem i przyciskiem zakupu.

Widok powinien byc gesty i czytelny, bo to ekran gry uzywany wielokrotnie. Nie robimy landing page ani ekranu opisowego.

## UI improvement: kierunek przebudowy wizualnej

Temat UI rozdzielamy na dwie warstwy:

- UI aplikacji implementowane natywnie w kodzie: layout, karty, przyciski, taby, progress bary, bottom navigation, teksty, listy ulepszen, badges i stany interakcji.
- Assety graficzne jako osobne pliki: samochody i etapy tuningu, tla lokacji, ikony czesci, efekty klikniecia, skrzynki, nagrody i inne elementy, ktorych nie warto odtwarzac samym kodem.

Nie budujemy ekranow jako jednej duzej grafiki. Grafiki maja wspierac gameplay, a nie zastapic system UI.

### Kierunek wizualny

Docelowy ekran clickera powinien isc w strone mobilnego game UI:

- dark UI,
- street racing i nocny tuning,
- klimat inspirowany grami wyscigowymi, ale bez kopiowania ich identyfikacji,
- nowoczesny interfejs mobilnej gry,
- lekko komiksowy charakter,
- samochody stosunkowo realistyczne,
- subtelne speed lines, halftone, spark effects i click effects,
- pomaranczowy jako glowny accent,
- electric blue jako drugi accent,
- zielony dla pieniedzy,
- fioletowy dla passive income albo specjalnych elementow,
- glow uzywany oszczednie.

UI nie moze wygladac jak przeladowany koncept AI. Ma wygladac jak interfejs, ktory da sie realnie wdrozyc, utrzymac i rozwijac w React Native.

### Clicker screen po UI improvement

Docelowo glowny ekran gameplayu powinien zawierac:

- top stats:
  - `CASH`,
  - `ZA KLIK`,
  - `NA SEKUNDE`.
- duza grafika aktualnego auta jako glowny obiekt klikany,
- aktualny tier i nazwe stage auta,
- pasek progresu aktualnego samochodu,
- informacje ile poziomow brakuje do nastepnego tieru albo auta,
- teaser nastepnego auta,
- liste lub panel ulepszen,
- subtelny feedback po kliknieciu:
  - skalowanie auta,
  - floating `+X`,
  - particle albo spark effect,
  - opcjonalnie haptic,
  - bez ciezkich animacji obnizajacych FPS.

### Progresja auta i kolekcja

Kazdy samochod powinien docelowo miec wlasna progresje:

```txt
Starter
Tier 1
level 1 -> 2 -> 3 -> ... -> MAX
```

Proponowany model wizualny:

- Stage 0: seryjne auto.
- Stage 1: nowe felgi.
- Stage 2: obnizenie / stance.
- Stage 3: spoiler.
- Stage 4: body kit.
- Stage 5: nowy lakier i agresywniejszy wyglad.
- Stage MAX: kompletnie zmodyfikowane auto.

Nie kazdy upgrade musi miec osobny asset. Rozsadniejszy model to kilka `visualStage` na samochod, a ulepszenia podbijaja progres do kolejnych stage.

Po osiagnieciu maksimum:

```txt
current car max -> unlock next car -> new car starts low -> new progression
```

Stare auta zostaja w kolekcji.

### Garage i kolekcja aut

Docelowy ekran Garage powinien zawierac:

- duza karte aktualnego auta,
- aktualny tier, rarity i progress,
- bonus `+X za klik`,
- bonus `+Y na sekunde`,
- liste/karty odblokowanych i zablokowanych samochodow,
- miniatury samochodow,
- status `locked/unlocked`,
- wymagania odblokowania.

Nazwy samochodow maja byc fikcyjne, np.:

- Starter,
- Blaze,
- Striker,
- Phantom,
- Vortex.

Nie uzywamy prawdziwych marek, logo ani kopii konkretnych modeli. Samochody moga reprezentowac archetypy:

- hot hatch,
- JDM coupe,
- muscle car,
- sport sedan,
- supercar,
- hypercar.

### Lokacje

Lokacja bedzie osobnym systemem:

```txt
lokacja = tlo clicker screena + bonus do passive income
```

Przykladowe lokacje:

- Stary garaz: `+1/sec`,
- Warsztat: `+8/sec`,
- Parking podziemny: `+18/sec`,
- Nocne miasto: `+35/sec`,
- Salon dealera: `+45/sec`.

Lokacje powinny byc odblokowywane progresja, np.:

- parking: Tier 2,
- city: Tier 3,
- dealer: Tier 4.

Wybrana lokacja docelowo zmienia background clicker screena.

### Assety

Proponowana struktura assetow do pozniejszego wdrozenia:

```txt
apps/mobile/assets/game/
  cars/
    starter/
      stage-0.webp
      stage-1.webp
      stage-2.webp
      stage-3.webp
      stage-max.webp
    blaze/
    striker/
  locations/
    old-garage.webp
    workshop.webp
    underground.webp
    night-city.webp
    dealership.webp
  upgrades/
    tires.webp
    chip.webp
    turbo.webp
    mechanic.webp
    workshop.webp
    dealer.webp
  rewards/
    daily-crate.webp
  effects/
```

W aplikacji Expo assety powinny byc importowane jako konkretne pliki albo przez stabilna mape konfiguracji, a nie przez dynamiczne stringi trudne dla bundlera.

### Performance

Clicker musi dzialac plynnie przy szybkim klikaniu. Przy UI improvement pilnujemy:

- ograniczenia niepotrzebnych rerenderow,
- animacji opartych o native driver tam, gdzie to mozliwe,
- lekkich efektow klikniecia,
- preloadu ciezszych assetow,
- rozsadnego rozmiaru grafik,
- braku duzych PNG udajacych caly ekran,
- rozdzielenia game state, ekonomii, persistence, animacji i UI.

## Pomysly na dodatkowe funkcje

- Combo za szybkie klikanie.
- Krytyczne klikniecie, np. losowe x5.
- Nitro jako aktywny boost na 15 sekund.
- Misje dzienne: wykonaj 500 klikniec, kup 10 ulepszen.
- Osiagniecia: pierwszy turbo, pierwszy milion, pelny garaz.
- Bonus offline naliczany po powrocie do gry.
- Skrzynki z czesciami.
- Kolekcja samochodow z roznymi bonusami.
- Prestiz: reset progresu w zamian za stale mnozniki.
- Mini eventy: wyscig uliczny, zlot tuningowy, aukcja czesci.

## Backlog sprintu

### Zadanie 1: model danych gry

Status: zrobione w pierwszej iteracji.

Zaimplementowane pliki:

- `apps/mobile/src/features/car-clicker/types.ts`
- `apps/mobile/src/features/car-clicker/upgrades.ts`
- `apps/mobile/src/features/car-clicker/economy.ts`
- `apps/mobile/src/features/car-clicker/index.ts`

Co zostalo przygotowane:

- Typy stanu gry, ulepszen i wyniku zakupu.
- Lista startowych ulepszen dla sciezek `Moc` i `Garaz`.
- Czyste funkcje ekonomii do liczenia ceny, `per click`, `per second` i tieru auta.
- Funkcje akcji gry: zebranie dochodu z klikniecia, zebranie dochodu pasywnego i zakup ulepszenia.
- Kod bez zaleznosci od Reacta, gotowy do testow jednostkowych i podpiecia pod ekran lub store.

Druga iteracja:

- Dodano mapowanie ulepszen po `id`, zeby logika zakupu nie przeszukiwala listy przy kazdej akcji.
- Dodano selektory danych dla UI sklepu: poziom, kolejny koszt, dostepnosc zakupu, brakujacy cash i status max level.
- Dodano model progresu tieru auta: aktualny tier, kolejny tier, prog, procent progresu i liczba poziomow brakujacych do awansu.
- Utrzymano rozdzial na konfiguracje, typy i czyste funkcje ekonomii, bez zaleznosci od React Native.

- Zdefiniowac typy stanu gry i ulepszen.
- Przygotowac liste startowych ulepszen.
- Dodac funkcje liczenia ceny kolejnego poziomu.
- Dodac funkcje przeliczania `perClick` i `perSecond`.

Kryteria akceptacji:

- Kazde ulepszenie ma nazwe, koszt, poziom i efekt.
- Cena rosnie po kazdym zakupie.
- Stan gry da sie latwo podlaczyc do komponentu widoku.

### Zadanie 2: podstawowy ekran gry

Status: pierwsza, druga, trzecia i czwarta iteracja zrobione.

Zaimplementowane w `apps/mobile/src/app/game.tsx`:

- Podmieniono ekran gry na podstawowy widok Car Clicker.
- Podpieto stan poczatkowy z `createInitialCarClickerState`.
- Podpieto akcje klikniecia samochodu przez `collectClickIncome`.
- Pokazano `cash`, `per click`, `per second` i aktualny tier auta.
- Dodano prosty samochod zbudowany z komponentow React Native jako tymczasowy, kontrolowany wizual.
- Dodano pasek progresu do kolejnego tieru przez `getCarTierProgress`.

Poza zakresem tej iteracji:

- Sklep ulepszen zostaje w Zadaniu 3.
- Dochod pasywny z timerem zostaje w Zadaniu 4.
- Zaawansowane animacje i plywajacy tekst zostaja w Zadaniu 5.

Druga iteracja:

- Odchudzono `apps/mobile/src/app/game.tsx` do roli kontenera stanu i ukladu.
- Wyniesiono panel statystyk do `CarClickerStatsPanel`.
- Wyniesiono klikalny samochod do `CarTapButton`.
- Wyniesiono pasek progresu tieru do `CarTierProgressPanel`.
- Dodano `formatCarClickerCash`, zeby formatowanie waluty bylo wspolne dla ekranu i przyszlego sklepu.
- Dodano `ScrollView`, zeby podstawowy widok byl odporniejszy na nizsze ekrany telefonow.

Trzecia iteracja:

- Dodano `useCarClickerGame` jako hook feature zarzadzajacy stanem ekranu gry.
- Przeniesiono inicjalizacje stanu, wyliczanie progresu tieru i akcje klikniecia poza plik routingu.
- Uproszczono `apps/mobile/src/app/game.tsx`, zeby byl glownie kompozycja layoutu.
- Przygotowano miejsce na kolejne akcje, np. zakup ulepszenia i dochod pasywny, bez rozbudowywania komponentu ekranu.

Czwarta iteracja:

- Dodano `CAR_CLICKER_SCREEN` jako wspolna konfiguracje tekstow i metadanych widoku.
- Podpieto tytul, opis i label przycisku samochodu do konfiguracji zamiast twardych stringow w komponentach.
- Zmieniono etykiete zakladki gry na `Clicker` w nawigacji native i web.
- Uporzadkowano nazewnictwo ekranu przed przejsciem do sklepu ulepszen.

- Dodac ekran lub rozbudowac istniejacy ekran gry.
- Pokazac cash, `per click` i `per second`.
- Dodac klikalny samochod.
- Dodac akcje `tap`, ktora zwieksza cash.

Kryteria akceptacji:

- Klikniecie w samochod natychmiast zwieksza cash.
- UI nie przeskakuje przy zmianie wartosci.
- Ekran dobrze miesci sie na telefonie.

### Zadanie 3: sklep ulepszen

Status: pierwsza iteracja zrobiona.

Zaimplementowane:

- Dodano `UpgradeShopPanel` jako komponent listy ulepszen.
- Podpieto `upgradeViews` w `useCarClickerGame`, korzystajac z selektora `getUpgradeViews`.
- Dodano akcje `purchaseUpgrade`, ktora korzysta z `purchaseCarClickerUpgrade`.
- Pokazano nazwe, opis, poziom, koszt, efekt i brakujaca kwote dla kazdego ulepszenia.
- Przyciski zakupu sa wylaczone, gdy gracz ma za malo cashu albo ulepszenie jest na max level.
- Zakup odejmuje cash, zwieksza poziom i od razu aktualizuje `per click`, `per second` oraz progres tieru.

Poza zakresem tej iteracji:

- Filtrowanie po kategoriach i segmenty `Moc` / `Garaz`.
- Lepsze sortowanie sklepu i stany pustej listy.
- Animacje zakupu i feedback po zakupie.

Druga iteracja:

- Dodano filtr kategorii sklepu: `Wszystkie`, `Moc`, `Garaz`.
- Dodano `CarClickerUpgradeCategoryFilter`, zeby UI mogl obslugiwac filtr `all` bez mieszania go z realnymi kategoriami ulepszen.
- Dodano `CAR_CLICKER_UPGRADE_CATEGORY_OPTIONS` jako konfiguracje segmentow sklepu.
- Przeniesiono wybrana kategorie do `useCarClickerGame`, razem z akcja `selectUpgradeCategory`.
- `UpgradeShopPanel` renderuje segmenty kategorii i dostaje juz przefiltrowana liste ulepszen.
- Przygotowano strukture pod pozniejsze kategorie `Styl` i `Automatyzacja`.

Trzecia iteracja:

- Dodano `CarClickerPurchaseFeedback` jako typ ostatniego wyniku zakupu.
- `useCarClickerGame` przechowuje ostatni feedback zakupu i aktualizuje go przy kazdej probie kupna.
- `UpgradeShopPanel` pokazuje komunikat po zakupie, braku cashu albo probie zakupu ulepszenia na max level.
- Doprecyzowano etykiete przycisku zakupu: `Kup <koszt>`, sam koszt dla niedostepnych zakupow i `Max` dla limitu poziomu.
- Dodano `accessibilityState` dla wylaczonych przyciskow zakupu.

Czwarta iteracja:

- Dodano `CarClickerSessionState`, ktory laczy stan gry, wybrana kategorie sklepu i feedback zakupu.
- Dodano pure reducer `carClickerReducer` z akcjami `collect_click`, `purchase_upgrade` i `select_upgrade_category`.
- Przeniesiono logike zakupu z hooka do reducera, zeby kolejne zakupy bazowaly na najnowszym stanie Reacta.
- `useCarClickerGame` odpowiada teraz za memoizowane selektory i dispatch akcji, a nie za reczne skladanie zmian stanu.
- Reducer jest gotowy do testow jednostkowych bez renderowania komponentow.

Piata iteracja:

- Dodano `compareUpgradeViews` jako czysta funkcje sortowania ulepszen.
- `getUpgradeViews` zwraca teraz liste posortowana: najpierw dostepne zakupy, potem nizszy koszt, a max level na koncu.
- Dodano stan pustej listy w `UpgradeShopPanel`, zeby sklep mial poprawny UI po dodaniu przyszlych kategorii bez ulepszen.
- Sortowanie pozostaje poza komponentem UI, wiec sklep renderuje juz gotowy model widoku.

- Pokazac liste ulepszen.
- Dodac przycisk kupna.
- Wylaczyc przycisk, gdy brakuje cashu.
- Pokazac aktualny poziom i kolejny koszt.

Kryteria akceptacji:

- Zakup odejmuje cash.
- Zakup zwieksza poziom ulepszenia.
- Efekt ulepszenia zmienia `per click` albo `per second`.

### Zadanie 4: pasywny dochod

Status: pierwsza iteracja zrobiona.

Zaimplementowane:

- Dodano akcje reducera `collect_passive_income` z jawnym `elapsedSeconds`.
- Akcja korzysta z istniejacej czystej funkcji `collectPassiveIncome`.
- `useCarClickerGame` uruchamia jeden interwal naliczajacy dochod pasywny co sekunde.
- Interwal jest czyszczony przy odmontowaniu hooka przez cleanup w `useEffect`.
- Aktualny `per second` byl juz widoczny w panelu statystyk, wiec po zakupie ulepszen pasywnych cash rosnie automatycznie.

Poza zakresem tej iteracji:

- Naliczanie dochodu offline po powrocie do gry.
- Optymalizacja zatrzymywania timera, gdy `perSecond` wynosi 0.
- Animacja albo osobny feedback dla pasywnego przychodu.

Druga iteracja:

- Timer pasywnego dochodu startuje dopiero wtedy, gdy `perSecond` jest wieksze od 0.
- `useEffect` zalezy od `game.perSecond`, wiec po zakupie ulepszenia pasywnego interwal startuje automatycznie.
- Cleanup dalej usuwa poprzedni interwal, wiec zmiana wartosci `perSecond` nie tworzy duplikatow timerow.
- Usunieto niepotrzebna prace w tle na poczatku gry, gdy gracz nie ma jeszcze pasywnego dochodu.

Trzecia iteracja:

- Dodano timestamp ostatniego ticka pasywnego dochodu przez `useRef`.
- Timer przekazuje do reducera realny `elapsedSeconds`, zamiast zawsze zakladac idealna jedna sekunde.
- Przy zmianie `perSecond` albo czyszczeniu interwalu timestamp jest resetowany.
- Naliczanie jest bardziej odporne na opoznienia JS thread i chwilowe przyciecia aplikacji.

Czwarta iteracja:

- Dodano obsluge `AppState`, zeby po powrocie aplikacji na foreground doliczyc pasywny dochod za realny czas od ostatniego ticka.
- Interwal nalicza dochod tylko, gdy aplikacja jest aktywna.
- Cleanup usuwa teraz zarowno interwal, jak i subskrypcje `AppState`.
- `collectPassiveIncome` nie ucina juz dochodu przez `floor` na kazdym ticku, wiec opoznione ticki nie gubia ulamkow przychodu.

Piata iteracja:

- Wyniesiono obsluge timera, timestampow i `AppState` do `usePassiveIncomeTicker`.
- `useCarClickerGame` nie zna juz szczegolow interwalu; przekazuje tylko `isEnabled` i akcje dispatchowana na tick.
- Hook timera trzyma aktualny callback w refie, wiec nie restartuje interwalu przy kazdym renderze.
- Separacja ulatwia testowanie i dalsze uzycie timera, np. przy zapisie lokalnym albo osobnym feedbacku pasywnego przychodu.

Szosta iteracja:

- Rozbudowano `CarClickerStatsPanel` o status pasywnego dochodu.
- Gdy `perSecond` wynosi 0, panel podpowiada zakup ulepszenia w `Garazu`.
- Gdy pasywny dochod jest aktywny, panel pokazuje aktualne `+cash / s`.
- Status jest czescia istniejacego panelu statystyk, wiec ekran nie dostal kolejnego osobnego elementu layoutu.

Siodma iteracja:

- Dodano `calculatePassiveIncome` jako czysta funkcje liczaca przychod z `perSecond` i `elapsedSeconds`.
- `collectPassiveIncome` uzywa teraz tej funkcji i odpowiada tylko za zlozenie nowego stanu.
- Funkcja zabezpiecza sie przed ujemnym `perSecond` i ujemnym czasem.
- Logika jest gotowa do testow balansu oraz przyszlego pokazania przychodu offline bez zmiany stanu gry.

- Dodac timer naliczajacy `per second`.
- Upewnic sie, ze naliczanie nie tworzy wielu timerow po rerenderach.
- Pokazac aktualny `per second` w UI.

Kryteria akceptacji:

- Cash rosnie automatycznie po zakupie ulepszen pasywnych.
- Timer jest czyszczony po opuszczeniu komponentu.

### Zadanie 5: feedback i progres wizualny

Status: pierwsza iteracja zrobiona.

Zaimplementowane:

- Dodano animacje klikniecia samochodu w `CarTapButton`.
- Samochod po kliknieciu lekko skaluje sie i wraca sprężynowo do normalnego rozmiaru.
- Dodano plywajacy tekst z wartoscia zarobku z klikniecia.
- Animacja korzysta z natywnego `Animated` z React Native, bez dodawania nowych zaleznosci.
- Efekt jest zamkniety w komponencie samochodu, wiec ekran gry nadal nie zna szczegolow animacji.

Poza zakresem tej iteracji:

- Zmiana wygladu auta po tierach.
- Animacje zakupu ulepszen.
- Osobny feedback pasywnego dochodu.

Druga iteracja:

- Dodano `car-appearance.ts` z konfiguracja wygladu auta dla tierow.
- `CarTapButton` pobiera wyglad przez `getCarAppearance(tier)`.
- Auto zmienia nazwe wariantu, kolor nadwozia, kolor akcentu oraz dodatki wizualne po awansie tieru.
- Dodano spoiler, akcent boczny i neon jako kontrolowane elementy React Native.
- Wyglad auta jest danymi feature, wiec pozniej mozna podmienic renderer albo assety bez zmiany ekonomii gry.

Trzecia iteracja:

- Dodano `CarClickerTierFeedback` do stanu sesji gry.
- Reducer ustawia feedback tylko wtedy, gdy zakup ulepszenia realnie podniesie tier auta.
- Dodano `TierUpFeedbackPanel`, ktory pokazuje awans tieru i nazwe nowego wariantu auta.
- Panel jest renderowany pod progresem auta i nie zaslania samochodu ani sklepu.

Czwarta iteracja:

- Rozszerzono `CarClickerPurchaseFeedback` o `upgradeId`, zeby UI mogl stabilnie rozpoznac kupione ulepszenie.
- `UpgradeShopPanel` wyróżnia ostatnio kupiony wiersz przez kolor tla, kolor obramowania i etykiete `Ostatnio kupione`.
- Wyróżnienie pojawia sie tylko po udanym zakupie, nie po probie zakupu bez cashu.
- Feedback zakupu zostaje w sklepie i nie wymaga dodatkowej logiki w ekranie gry.

Piata iteracja:

- Dodano animowane wejscie `TierUpFeedbackPanel`.
- Panel awansu tieru pojawia sie przez fade-in i subtelne przesuniecie w pionie.
- Animacja jest zamknieta w komponencie panelu i korzysta z natywnego `Animated`.
- Efekt uruchamia sie przy zmianie feedbacku awansu, bez dodatkowej logiki w ekranie gry.

Szosta iteracja:

- Dodano animacje wypelnienia paska progresu w `CarTierProgressPanel`.
- Pasek plynnie przechodzi do nowej wartosci po zmianie `progressRatio`.
- Animacja jest zamknieta w komponencie progresu, wiec ekran gry nadal przekazuje tylko model danych.
- Uzyto `Animated.Value` i interpolacji szerokosci bez dodawania zaleznosci.

Siodma iteracja:

- Dodano pulsujacy wskaznik aktywnego pasywnego dochodu w `CarClickerStatsPanel`.
- Animacja startuje tylko, gdy `perSecond` jest wieksze od 0.
- Cleanup zatrzymuje petle animacji i resetuje opacity wskaznika.
- Feedback pasywnego dochodu pozostaje w panelu statystyk, bez dodatkowej logiki w ekranie gry.

- Dodac animacje klikniecia samochodu.
- Dodac plywajacy tekst z zarobkiem po kliknieciu.
- Dodac progress do kolejnego tieru auta.
- Zmienic etykiete lub wyglad auta po awansie tieru.

Kryteria akceptacji:

- Klikniecie jest odczuwalne wizualnie.
- Gracz widzi, ile brakuje do kolejnego etapu auta.
- Efekty nie zaslaniaja kluczowych przyciskow.

### Zadanie 6: zapis lokalny

Status: pierwsza, druga, trzecia, czwarta, piata, szosta, siodma i osma iteracja zrobione.

Zaimplementowane:

- Sprawdzono storage aplikacji mobilnej: projekt nie mial osobnej warstwy persistencji dla gry, ale ma juz zaleznosc `expo-secure-store`.
- Dodano `storage.ts` w feature `car-clicker` jako izolowana warstwe zapisu lokalnego bez dokladania nowych bibliotek.
- Zapis ma `saveVersion`, `savedAt` i stan gry, zeby przyszle migracje byly mozliwe bez mieszania ich z reducerem albo UI.
- Dodano bezpieczny parser zapisu: pusty, uszkodzony albo niezgodny wersja zapis zwraca `null` i gra startuje ze stanem domyslnym.
- Parser odtwarza tylko znane poziomy ulepszen, klamruje wartosci liczbowe do zakresu nieujemnego i przelicza pochodne pola `perClick`, `perSecond` oraz tier auta.
- Dodano akcje reducera `hydrate_game`, ktora podmienia stan gry po odczycie zapisu i czysci feedbacki sesyjne.
- `useCarClickerGame` laduje zapis przy starcie, a po hydracji zapisuje kolejne zmiany stanu gry.

Poza zakresem tej iteracji:

- Rozbudowany modal powrotu do gry z animacja nagrody offline.
- Migracja na AsyncStorage albo SQLite, jesli zapis urosnie poza maly stan MVP.

Druga iteracja:

- Wydzielono `useCarClickerSave`, zeby `useCarClickerGame` nie trzymal szczegolow persistencji, timeoutow i hydracji.
- Dodano opozniony zapis po zmianach stanu gry, zeby szybkie klikanie i pasywny tick nie wykonywaly natychmiastowego zapisu po kazdej zmianie.
- Dodano zapis ostatniego znanego stanu przy odmontowaniu hooka, jesli hydracja juz sie zakonczyla.
- `loadCarClickerSave` i `saveCarClickerState` obsluguja bledy storage bez przerywania petli gameplayu.
- Sprawdzono setup testow: aplikacja mobilna nie ma jeszcze runnera testow jednostkowych, wiec w tej iteracji nie dokladano nowej zaleznosci testowej.

Poprawka UI po drugiej iteracji:

- Usunieto nadmiarowy dolny inset z ekranu gry, ktory tworzyl duzy czarny odstep miedzy gra a dolnym menu.
- Scroll ekranu gry zaczyna teraz uklad od gory zamiast centrowac cala zawartosc w pomniejszonym obszarze.
- Dolny padding ekranu gry zostal ograniczony do malego odstepu, bo natywny tab bar sam zajmuje swoje miejsce w layoucie.

Trzecia iteracja:

- Dodano naliczanie ograniczonego bonusu offline na podstawie `savedAt` z lokalnego zapisu.
- Limit offline income wynosi 4 godziny, zeby dluga przerwa nie psula balansu ekonomii.
- Logika offline income jest czysta i znajduje sie w `economy.ts`, wiec mozna ja testowac bez UI i bez storage.
- `storage.ts` potrafi zwrocic pelne dane zapisu przez `loadCarClickerSaveData`, a dotychczasowe `loadCarClickerSave` zostalo zachowane jako prosty helper kompatybilny z poprzednim uzyciem.
- `useCarClickerSave` dolicza bonus offline podczas hydracji i przekazuje feedback do reducera.
- Dodano `OfflineIncomeFeedbackPanel`, ktory pokazuje graczowi naliczony cash i czas offline po powrocie do gry.

Czwarta iteracja:

- Dodano obsluge `AppState` w `useCarClickerSave`, zeby zapis wykonywal sie przy przejsciu aplikacji z aktywnej do `inactive` albo `background`.
- Wydzielono `clearPendingSave` i `flushSave`, zeby debounce, background save i cleanup korzystaly z jednej sciezki zapisu.
- Przy flushu anulowany jest oczekujacy debounce, wiec nie zapisujemy tego samego stanu niepotrzebnie dwa razy.
- Zapis przy przejsciu w tlo aktualizuje `savedAt`, co poprawia dokladnosc pozniejszego bonusu offline.

Piata iteracja:

- Dodano throttle zapisu w `useCarClickerSave`, zeby pasywny tick co sekunde nie wymuszal zapisu do storage co sekunde.
- Zachowano debounce dla szybkich klikniec, a minimalny odstep miedzy zapisami ustawiono na 5 sekund.
- `flushSave` przy przejsciu aplikacji w tlo i cleanup dalej zapisuje natychmiast, omijajac throttle tam, gdzie utrata stanu bylaby bardziej ryzykowna.
- Po hydracji z offline income `latestGameRef` dostaje stan po naliczeniu bonusu od razu, zanim React wykona kolejny render.

Szosta iteracja:

- Zawezono format zapisu do jawnego `CarClickerPersistedGameState`: `cash`, `totalEarnedCash`, `upgrades` i `selectedCarTier`.
- `perClick` i `perSecond` nie sa juz zapisywane jako dane zrodlowe, tylko sa odtwarzane przez `recalculateCarClickerState` po odczycie.
- Dodano osobny typ `CarClickerLoadedSaveData`, zeby rozdzielic surowy snapshot zapisu od stanu gotowego do hydracji gry.
- `createCarClickerSaveData` buduje kontrolowany snapshot, co zmniejsza ryzyko przypadkowego utrwalenia pol UI albo przyszlych pol sesyjnych.

Siodma iteracja:

- Dodano akcje reducera `dismiss_offline_income_feedback`, zeby feedback offline byl czescia kontrolowanego stanu sesji.
- `useCarClickerGame` wystawia akcje zamkniecia panelu offline razem z pozostalymi akcjami gry.
- `OfflineIncomeFeedbackPanel` dostal przycisk zamkniecia z `accessibilityLabel` i bez lokalnego stanu UI.
- Ekran gry przekazuje `onDismiss` do panelu, dzieki czemu informacja o zarobku po powrocie nie zostaje na ekranie na stale.

Osma iteracja:

- Dodano auto-dismiss feedbacku offline po 8 sekundach w `useCarClickerGame`.
- Timer jest czyszczony przy zmianie feedbacku albo odmontowaniu hooka, wiec nie zostawia wiszacych timeoutow.
- Reczne zamkniecie panelu dalej idzie przez te sama akcje reducera, a komponent panelu pozostaje bez lokalnego stanu.

- Sprawdzic, jaki storage jest juz uzywany w aplikacji.
- Jesli brak gotowego storage, dodac najprostszy lokalny zapis dopiero po decyzji technologicznej.
- Zapisywac cash, poziomy ulepszen i tier auta.

Kryteria akceptacji:

- Po zamknieciu i ponownym otwarciu aplikacji stan gry wraca.
- Bledny albo pusty zapis nie psuje startu gry.

### Zadanie 7: UI improvement clicker screena

Cel: przebudowac obecny prosty wyglad w kierunku docelowego game UI, zachowujac natywny UI w kodzie i uzywajac assetow tylko jako grafiki gry.

Zakres pierwszej iteracji:

- Zdefiniowac lokalne tokeny wizualne Car Clicker: kolory accentow, statusow i glow.
- Przebudowac panel statystyk na ciemniejszy, bardziej growy top HUD.
- Wzmocnic hierarchie clicker screena: stats -> car stage -> progress -> upgrades.
- Ujednolicic style przyciskow, segmentow, paneli i feedbackow.
- Upewnic sie, ze UI miesci sie na malych telefonach i nie zaslania elementow interakcji.

Kryteria akceptacji:

- UI jest nadal implementowane komponentami React Native, nie jako jeden obraz.
- Glow i efekty sa subtelne.
- Kolory maja czytelne role: money, click, passive, accent.
- Ekran wyglada bardziej jak gra, ale pozostaje utrzymywalny.
- `typecheck` i `lint` przechodza.

### Zadanie 8: plan assetow gry

Cel: przygotowac strukture i kontrakt assetow, zanim zaczniemy podmieniac placeholder samochodu na grafiki.

Zakres:

- Dodac docelowa strukture `apps/mobile/assets/game`.
- Przygotowac konwencje nazw plikow dla aut, stage, lokacji, upgrade i efektow.
- Zaprojektowac mape konfiguracji assetow dla Expo.
- Okreslic minimalny zestaw assetow dla pierwszego auta `starter`.
- Okreslic minimalny zestaw tla dla pierwszej lokacji `old-garage`.

Kryteria akceptacji:

- Kod UI nie zaklada dynamicznych stringow assetow.
- Assety samochodow sa rozdzielone od UI.
- Mozna dodac kolejne auto bez przebudowy komponentu clickera.

### Zadanie 9: garage, cars i locations jako kolejne sprinty

Zakres koncepcyjny:

- Rozszerzyc model gry o `currentCar`, `currentCarLevel`, `currentLocation`, `unlockedCars`.
- Dodac ekran lub sekcje Garage.
- Dodac kolekcje fikcyjnych samochodow.
- Dodac lokacje jako tlo clicker screena i bonus do passive income.
- Przygotowac save pod `selectedCar`, `selectedLocation`, `carProgress`, `lastActiveAt` i `saveVersion`.

To nie wchodzi do obecnego MVP clickera, ale architektura nie powinna blokowac tych systemow.

## Definicja ukonczenia sprintu

- Widok car clickera jest dostepny w aplikacji.
- Gracz moze klikac samochod i zarabiac walute.
- Gracz moze kupic kilka ulepszen.
- Ulepszenia realnie zwiekszaja `per click` lub `per second`.
- UI pokazuje aktualne wartosci i stan zakupu.
- Podstawowa petla gry jest testowalna bez backendu.
- Kod przechodzi lokalne sprawdzenie TypeScript/lint, jesli projekt ma takie komendy.

## Decyzje do podjecia przed implementacja

- Czy waluta ma miec polska nazwe, np. `kasa`, czy neutralna, np. `cash`.
- Czy samochod ma byc grafika z assetow, prosty komponent UI, czy tymczasowy placeholder.
- Czy progres ma byc zapisywany tylko lokalnie, czy docelowo synchronizowany z backendem.
- Czy widok gry ma byc osobna zakladka, czy ekran otwierany z obecnego `game.tsx`.
- Czy pierwsza iteracja UI improvement ma uzywac tylko komponentowego placeholdera auta, czy od razu przygotowujemy asset `starter/stage-0.webp`.
- Czy `Explore` ma docelowo stac sie hubem dla `Garage`, `Cars` i `Locations`.
- Jaki maksymalny czas offline income przyjmujemy, zeby uniknac zbyt duzego naliczania po dlugiej przerwie.

## Rekomendacja na pierwszy build

Najpierw zrobic petle:

```txt
klik -> cash -> zakup ulepszenia -> wiekszy zarobek -> kolejny zakup
```

Dopiero potem dodawac efekty wizualne, misje, prestiz i kolekcje samochodow. Bez dobrej petli ekonomii dodatkowe funkcje beda tylko ozdobami.
